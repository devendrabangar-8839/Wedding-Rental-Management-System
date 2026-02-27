class Order < ApplicationRecord
  belongs_to :user
  has_many :order_items, dependent: :destroy
  has_many :rental_bookings, through: :order_items

  enum :status, {
    pending: 'PENDING',
    confirmed: 'CONFIRMED',
    packed: 'PACKED',
    out_for_delivery: 'OUT_FOR_DELIVERY',
    delivered: 'DELIVERED',
    pickup_scheduled: 'PICKUP_SCHEDULED',
    picked: 'PICKED',
    completed: 'COMPLETED',
    cancelled: 'CANCELLED',
    late: 'LATE'
  }

  validates :status, presence: true
  validates :total_price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :deposit_total, presence: true, numericality: { greater_than_or_equal_to: 0 }

  after_initialize :set_defaults, if: :new_record?

  private

  def set_defaults
    self.status ||= :pending
  end
end
