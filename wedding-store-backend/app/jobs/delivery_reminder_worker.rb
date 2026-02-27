# frozen_string_literal: true

# Sends delivery reminders 1 day before rental start date
# Runs daily at 9 AM via sidekiq-cron
#
# Finds orders where:
#   - start_date = tomorrow
#   - status = confirmed/pending
#   - No delivery reminder already sent
#
# Idempotency:
#   - Checks Notification table for existing reminders
#   - Skips orders that already received reminder
class DeliveryReminderWorker
  include Sidekiq::Worker

  sidekiq_options queue: :notifications, retry: 3, backtrace: true

  def perform
    Rails.logger.info "[DeliveryReminderWorker] Starting delivery reminder job"

    tomorrow = Date.current + 1.day
    orders_to_remind = find_orders_for_delivery(tomorrow)

    Rails.logger.info "[DeliveryReminderWorker] Found #{orders_to_remind.count} orders for delivery reminder"

    processed_count = 0
    orders_to_remind.find_each do |order|
      begin
        send_delivery_reminder(order)
        processed_count += 1
      rescue => e
        Rails.logger.error "[DeliveryReminderWorker] Failed to send reminder for order #{order.id}: #{e.message}"
      end
    end

    Rails.logger.info "[DeliveryReminderWorker] Completed. Processed #{processed_count}/#{orders_to_remind.count} reminders"
    
    { processed: processed_count, total: orders_to_remind.count }
  end

  private

  def find_orders_for_delivery(tomorrow)
    Order
      .joins(:rental_bookings)
      .where(rental_bookings: { start_date: tomorrow })
      .where(status: %w[pending confirmed packed])
      .where.not(id: Notification.select(:order_id)
                                .where(notification_type: 'delivery_reminder')
                                .where(status: 'sent'))
  end

  def send_delivery_reminder(order)
    # Check idempotency again at order level
    return if Notification.already_sent?(order.user_id, order.id, 'delivery_reminder')
    return if Notification.pending_for_order_and_type?(order.id, 'delivery_reminder')

    NotificationService.send_delivery_reminder(order: order)
    
    Rails.logger.info "[DeliveryReminderWorker] Sent delivery reminder for order #{order.id} to #{order.user.email}"
  end
end
