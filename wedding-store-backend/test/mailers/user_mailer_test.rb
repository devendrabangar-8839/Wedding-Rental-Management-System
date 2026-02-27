require "test_helper"

class UserMailerTest < ActionMailer::TestCase
  test "booking_confirmation" do
    mail = UserMailer.booking_confirmation
    assert_equal "Booking confirmation", mail.subject
    assert_equal [ "to@example.org" ], mail.to
    assert_equal [ "from@example.com" ], mail.from
    assert_match "Hi", mail.body.encoded
  end

  test "delivery_reminder" do
    mail = UserMailer.delivery_reminder
    assert_equal "Delivery reminder", mail.subject
    assert_equal [ "to@example.org" ], mail.to
    assert_equal [ "from@example.com" ], mail.from
    assert_match "Hi", mail.body.encoded
  end

  test "return_reminder" do
    mail = UserMailer.return_reminder
    assert_equal "Return reminder", mail.subject
    assert_equal [ "to@example.org" ], mail.to
    assert_equal [ "from@example.com" ], mail.from
    assert_match "Hi", mail.body.encoded
  end

  test "late_notice" do
    mail = UserMailer.late_notice
    assert_equal "Late notice", mail.subject
    assert_equal [ "to@example.org" ], mail.to
    assert_equal [ "from@example.com" ], mail.from
    assert_match "Hi", mail.body.encoded
  end
end
