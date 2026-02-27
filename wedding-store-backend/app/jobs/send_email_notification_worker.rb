# frozen_string_literal: true

# Generic worker for sending email notifications
# Used by NotificationService for async email delivery
#
# Usage:
#   SendEmailNotificationWorker.perform_async(notification_id, metadata)
#
# Idempotency:
#   - Checks if notification was already sent
#   - Skips processing if already completed
class SendEmailNotificationWorker
  include Sidekiq::Worker

  sidekiq_options queue: :mailers, retry: 3, backtrace: true

  def perform(notification_id, metadata = {})
    notification = Notification.find_by(id: notification_id)
    
    return unless notification
    return if notification.status == 'sent'
    return if notification.status == 'failed'

    Rails.logger.info "[SendEmailNotificationWorker] Processing notification #{notification_id} for #{notification.user.email}"

    service = EmailNotificationService.new
    service.deliver(notification, metadata)
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "[SendEmailNotificationWorker] Notification #{notification_id} not found: #{e.message}"
  rescue => e
    Rails.logger.error "[SendEmailNotificationWorker] Error processing notification #{notification_id}: #{e.message}"
    Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
    
    notification&.mark_as_failed!(e.message)
    raise e
  end
end
