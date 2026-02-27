class UserMailer < ApplicationMailer
  default from: '"Vows & Veils" <noreply@vowsandveils.com>'

  # Booking confirmation email
  # Sent immediately after successful booking
  def booking_confirmation(user, order, metadata = {})
    @user = user
    @order = order
    @metadata = metadata
    @booking = order&.rental_bookings&.first

    mail(
      to: user.email,
      subject: "Booking Confirmed - Order ##{order&.id} | Vows & Veils"
    )
  end

  # Delivery reminder email
  # Sent 1 day before rental start date
  def delivery_reminder(user, order, metadata = {})
    @user = user
    @order = order
    @metadata = metadata
    @booking = order&.rental_bookings&.first

    mail(
      to: user.email,
      subject: "Delivery Tomorrow - Order ##{order&.id} | Vows & Veils"
    )
  end

  # Return reminder email
  # Sent 1 day before rental end date
  def return_reminder(user, order, metadata = {})
    @user = user
    @order = order
    @metadata = metadata
    @booking = order&.rental_bookings&.first

    mail(
      to: user.email,
      subject: "Return Reminder - Order ##{order&.id} | Vows & Veils"
    )
  end

  # Late notice email
  # Sent when rental is overdue
  def late_notice(user, order, metadata = {})
    @user = user
    @order = order
    @metadata = metadata
    @booking = order&.rental_bookings&.first

    mail(
      to: user.email,
      subject: "Urgent: Overdue Return - Order ##{order&.id} | Vows & Veils"
    )
  end
end
