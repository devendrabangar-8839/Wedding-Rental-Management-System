# frozen_string_literal: true

# Sends booking confirmation email immediately after successful booking
# Triggered synchronously after order creation
#
# Usage:
#   BookingConfirmationWorker.perform_async(order_id)
#
# Note:
#   - Uses low-priority queue to not block request
#   - Idempotent - won't send duplicate confirmations
class BookingConfirmationWorker
  include Sidekiq::Worker

  sidekiq_options queue: :mailers, retry: 3, backtrace: true

  def perform(order_id)
    order = Order.find_by(id: order_id)
    
    unless order
      Rails.logger.error "[BookingConfirmationWorker] Order #{order_id} not found"
      return
    end

    # Check idempotency
    if Notification.already_sent?(order.user_id, order.id, 'booking_confirmation')
      Rails.logger.info "[BookingConfirmationWorker] Confirmation already sent for order #{order_id}"
      return
    end

    if Notification.pending_for_order_and_type?(order.id, 'booking_confirmation')
      Rails.logger.info "[BookingConfirmationWorker] Confirmation already pending for order #{order_id}"
      return
    end

    Rails.logger.info "[BookingConfirmationWorker] Sending booking confirmation for order #{order_id}"

    NotificationService.send_booking_confirmation(order: order)
    
    Rails.logger.info "[BookingConfirmationWorker] Confirmation sent to #{order.user.email}"
  rescue => e
    Rails.logger.error "[BookingConfirmationWorker] Failed to send confirmation for order #{order_id}: #{e.message}"
    Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
    raise e
  end
end
