# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/booking_confirmation
  def booking_confirmation
    UserMailer.booking_confirmation
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/delivery_reminder
  def delivery_reminder
    UserMailer.delivery_reminder
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/return_reminder
  def return_reminder
    UserMailer.return_reminder
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/late_notice
  def late_notice
    UserMailer.late_notice
  end
end
