# frozen_string_literal: true

# Sends return reminders 1 day before rental end date
# Runs daily at 9:05 AM via sidekiq-cron
#
# Finds orders where:
#   - end_date = tomorrow
#   - status = delivered/out_for_delivery
#   - No return reminder already sent
#
# Idempotency:
#   - Checks Notification table for existing reminders
#   - Skips orders that already received reminder
class ReturnReminderWorker
  include Sidekiq::Worker

  sidekiq_options queue: :notifications, retry: 3, backtrace: true

  def perform
    Rails.logger.info "[ReturnReminderWorker] Starting return reminder job"

    tomorrow = Date.current + 1.day
    orders_to_remind = find_orders_for_return(tomorrow)

    Rails.logger.info "[ReturnReminderWorker] Found #{orders_to_remind.count} orders for return reminder"

    processed_count = 0
    orders_to_remind.find_each do |order|
      begin
        send_return_reminder(order)
        processed_count += 1
      rescue => e
        Rails.logger.error "[ReturnReminderWorker] Failed to send reminder for order #{order.id}: #{e.message}"
      end
    end

    Rails.logger.info "[ReturnReminderWorker] Completed. Processed #{processed_count}/#{orders_to_remind.count} reminders"
    
    { processed: processed_count, total: orders_to_remind.count }
  end

  private

  def find_orders_for_return(tomorrow)
    Order
      .joins(:rental_bookings)
      .where(rental_bookings: { end_date: tomorrow })
      .where(status: %w[confirmed packed out_for_delivery delivered])
      .where.not(id: Notification.select(:order_id)
                                .where(notification_type: 'return_reminder')
                                .where(status: 'sent'))
  end

  def send_return_reminder(order)
    # Check idempotency again at order level
    return if Notification.already_sent?(order.user_id, order.id, 'return_reminder')
    return if Notification.pending_for_order_and_type?(order.id, 'return_reminder')

    NotificationService.send_return_reminder(order: order)
    
    Rails.logger.info "[ReturnReminderWorker] Sent return reminder for order #{order.id} to #{order.user.email}"
  end
end
