# frozen_string_literal: true

# Email-specific notification service
# Handles all email delivery logic
#
# Responsibilities:
# - Select appropriate mailer method based on notification type
# - Handle email delivery errors
# - Update notification status
#
# Future:
# - WhatsAppNotificationService will follow same interface
class EmailNotificationService
  # Deliver email notification
  # @param notification [Notification] notification record
  # @param metadata [Hash] template variables
  # @return [Boolean] success status
  def deliver(notification, metadata = {})
    mailer_method = mailer_method_for(notification.notification_type)
    
    return false unless mailer_method

    # Deliver email
    email_result = UserMailer.send(mailer_method, notification.user, notification.order, metadata).deliver_now

    # Mark as sent on success
    notification.mark_as_sent!
    
    Rails.logger.info "[EmailNotificationService] Sent #{notification.notification_type} to #{notification.user.email}"
    
    true
  rescue => e
    Rails.logger.error "[EmailNotificationService] Failed to send email: #{e.message}"
    notification.mark_as_failed!(e.message)
    false
  end

  private

  # Map notification types to mailer methods
  def mailer_method_for(notification_type)
    case notification_type.to_s
    when 'booking_confirmation'
      :booking_confirmation
    when 'delivery_reminder'
      :delivery_reminder
    when 'return_reminder'
      :return_reminder
    when 'late_notice'
      :late_notice
    else
      Rails.logger.warn "[EmailNotificationService] Unknown notification type: #{notification_type}"
      nil
    end
  end
end
