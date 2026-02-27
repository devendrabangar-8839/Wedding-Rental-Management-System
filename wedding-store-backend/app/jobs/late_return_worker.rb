# frozen_string_literal: true

# Processes late returns and sends late notices
# Runs daily at 9:10 AM via sidekiq-cron
#
# Finds orders where:
#   - end_date < today
#   - status != completed/cancelled
#   - No late notice already sent (or sent but order still not returned)
#
# Actions:
#   - Marks order as 'late' status
#   - Calculates late fee (₹500 per day)
#   - Sends late notice email
#
# Idempotency:
#   - Only sends one late notice per order
#   - Updates order status even if notification already sent
class LateReturnWorker
  include Sidekiq::Worker

  LATE_FEE_PER_DAY = 500

  sidekiq_options queue: :notifications, retry: 3, backtrace: true

  def perform
    Rails.logger.info "[LateReturnWorker] Starting late return processing job"

    late_orders = find_late_orders
    Rails.logger.info "[LateReturnWorker] Found #{late_orders.count} late orders"

    processed_count = 0
    notified_count = 0

    late_orders.find_each do |order|
      begin
        days_late = calculate_days_late(order)
        
        # Update order status to late
        update_order_status(order)
        
        # Send late notice (only once per order)
        if send_late_notice(order, days_late)
          notified_count += 1
        end
        
        processed_count += 1
      rescue => e
        Rails.logger.error "[LateReturnWorker] Failed to process late order #{order.id}: #{e.message}"
      end
    end

    Rails.logger.info "[LateReturnWorker] Completed. Processed #{processed_count} orders, sent #{notified_count} notices"
    
    { processed: processed_count, notified: notified_count }
  end

  private

  def find_late_orders
    Order
      .joins(:rental_bookings)
      .where(rental_bookings: { end_date: ..Date.current - 1.day })
      .where(status: %w[confirmed packed out_for_delivery delivered picked])
      .distinct
  end

  def calculate_days_late(order)
    booking = order.rental_bookings.first
    return 0 unless booking

    (Date.current - booking.end_date.to_date).to_i
  end

  def update_order_status(order)
    return if order.status == 'late'

    order.update!(status: 'late')
    Rails.logger.info "[LateReturnWorker] Marked order #{order.id} as late"
  end

  def send_late_notice(order, days_late)
    # Check idempotency - only send one late notice per order
    if Notification.already_sent?(order.user_id, order.id, 'late_notice')
      Rails.logger.info "[LateReturnWorker] Late notice already sent for order #{order.id}"
      return false
    end

    # Check if already pending
    if Notification.pending_for_order_and_type?(order.id, 'late_notice')
      Rails.logger.info "[LateReturnWorker] Late notice already pending for order #{order.id}"
      return false
    end

    late_fee = days_late * LATE_FEE_PER_DAY

    NotificationService.send_late_notice(
      order: order,
      late_fee: late_fee,
      days_late: days_late
    )

    Rails.logger.info "[LateReturnWorker] Sent late notice for order #{order.id} (#{days_late} days, ₹#{late_fee})"
    true
  end
end
