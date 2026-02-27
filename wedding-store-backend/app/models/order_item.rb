class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :product
  has_one :rental_booking, dependent: :destroy

  validates :quantity, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :size, presence: true
end
