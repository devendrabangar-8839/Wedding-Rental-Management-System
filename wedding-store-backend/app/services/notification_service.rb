# frozen_string_literal: true

# Main entry point for all notification operations
# Routes notifications to appropriate channel service
#
# Usage:
#   NotificationService.call(
#     user: current_user,
#     order: @order,
#     type: :booking_confirmation,
#     channel: :email
#   )
#
# Idempotency:
#   - Checks if notification already sent for order+type combination
#   - Prevents duplicate notifications
#
# Future-ready:
#   - Add WhatsAppNotificationService without changing this class
#   - Channel routing is abstracted
class NotificationService
  class InvalidChannelError < StandardError; end
  class NotificationError < StandardError; end

  # Main entry point
  # @param user [User] recipient
  # @param order [Order] associated order (optional for some notifications)
  # @param type [Symbol] notification type
  # @param channel [Symbol] delivery channel (:email, :whatsapp)
  # @param metadata [Hash] additional data for template
  # @param skip_idempotency [Boolean] bypass duplicate check (for retries)
  # @return [Notification, nil] created notification or nil if skipped
  def self.call(user:, order: nil, type:, channel: :email, metadata: {}, skip_idempotency: false)
    validate_channel!(channel)

    # Idempotency check - skip if already sent
    unless skip_idempotency
      return nil if Notification.already_sent?(user.id, order&.id, type.to_s)
    end

    # Create notification record
    notification = create_notification(user, order, type, channel, metadata)

    # Route to appropriate service
    service = service_for_channel(channel)
    service.deliver(notification, metadata)

    notification
  rescue => e
    Rails.logger.error "[NotificationService] Failed to send #{type} via #{channel}: #{e.message}"
    Rails.logger.error e.backtrace.join("\n") if Rails.env.development?

    # Mark notification as failed
    notification&.mark_as_failed!(e.message)
    raise NotificationError, "Failed to send notification: #{e.message}"
  end

  # Send booking confirmation notification
  def self.send_booking_confirmation(order:)
    call(
      user: order.user,
      order: order,
      type: :booking_confirmation,
      channel: :email,
      metadata: {
        order_number: order.id,
        booking_dates: "#{order.rental_bookings.first&.start_date} to #{order.rental_bookings.first&.end_date}",
        total_amount: order.total_price,
        deposit_amount: order.deposit_total
      }
    )
  end

  # Send delivery reminder (1 day before start_date)
  def self.send_delivery_reminder(order:)
    call(
      user: order.user,
      order: order,
      type: :delivery_reminder,
      channel: :email,
      metadata: {
        order_number: order.id,
        delivery_date: order.rental_bookings.first&.start_date,
        product_name: order.order_items.first&.product&.name
      }
    )
  end

  # Send return reminder (1 day before end_date)
  def self.send_return_reminder(order:)
    call(
      user: order.user,
      order: order,
      type: :return_reminder,
      channel: :email,
      metadata: {
        order_number: order.id,
        return_date: order.rental_bookings.first&.end_date,
        product_name: order.order_items.first&.product&.name
      }
    )
  end

  # Send late notice
  def self.send_late_notice(order:, late_fee:, days_late:)
    call(
      user: order.user,
      order: order,
      type: :late_notice,
      channel: :email,
      metadata: {
        order_number: order.id,
        late_fee: late_fee,
        days_late: days_late,
        original_return_date: order.rental_bookings.first&.end_date
      }
    )
  end

  class << self
    private

    def validate_channel!(channel)
      raise InvalidChannelError, "Invalid channel: #{channel}" unless [:email, :whatsapp].include?(channel.to_sym)
    end

    def service_for_channel(channel)
      case channel.to_sym
      when :email
        EmailNotificationService.new
      when :whatsapp
        # Future: WhatsAppNotificationService.new
        raise InvalidChannelError, "WhatsApp channel not yet implemented"
      else
        raise InvalidChannelError, "Unknown channel: #{channel}"
      end
    end

    def create_notification(user, order, type, channel, metadata)
      Notification.create!(
        user: user,
        order: order,
        channel: channel.to_s,
        notification_type: type.to_s,
        status: 'pending',
        metadata: metadata
      )
    end
  end
end
