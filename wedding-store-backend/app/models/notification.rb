class Notification < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :order, optional: true

  # Enums
  enum :channel, { email: 'email', whatsapp: 'whatsapp' }
  enum :notification_type, {
    booking_confirmation: 'booking_confirmation',
    delivery_reminder: 'delivery_reminder',
    return_reminder: 'return_reminder',
    late_notice: 'late_notice'
  }
  enum :status, { pending: 'pending', sent: 'sent', failed: 'failed' }

  # Validations
  validates :channel, presence: true
  validates :notification_type, presence: true
  validates :status, presence: true

  # Scopes for efficient querying
  scope :pending_email, -> { where(channel: :email, status: :pending) }
  scope :pending_whatsapp, -> { where(channel: :whatsapp, status: :pending) }
  scope :sent, -> { where(status: :sent) }
  scope :failed, -> { where(status: :failed) }
  scope :recent, -> { order(created_at: :desc) }

  # Scope to check if notification was already sent for a specific order and type
  scope :for_order_and_type, ->(order_id, type) { where(order_id: order_id, notification_type: type) }

  # Instance methods
  def mark_as_sent!
    update!(status: :sent, sent_at: Time.current)
  end

  def mark_as_failed!(error_message)
    update!(status: :failed, error_message: error_message)
  end

  # Class methods for idempotency checks
  def self.already_sent?(user_id, order_id, notification_type)
    exists?(user_id: user_id, order_id: order_id, notification_type: notification_type, status: :sent)
  end

  def self.pending_for_order_and_type?(order_id, notification_type)
    exists?(order_id: order_id, notification_type: notification_type, status: :pending)
  end
end
