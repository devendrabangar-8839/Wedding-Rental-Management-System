class Product < ApplicationRecord
  enum :product_type, { rent: 'RENT', sell: 'SELL', both: 'BOTH' }

  has_many :order_items, dependent: :destroy
  has_many :rental_bookings, dependent: :destroy

  scope :search_by_name, ->(query) { where('name ILIKE ?', "%#{query}%") if query.present? }
  scope :by_type, ->(type) { where(product_type: type) if type.present? }

  validates :name, presence: true
  validates :product_type, presence: true
  validates :rent_price, numericality: { greater_than_or_equal_to: 0 }, if: -> { rent? || both? }
  validates :sale_price, numericality: { greater_than_or_equal_to: 0 }, if: -> { sell? || both? }
  validates :total_quantity, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  after_initialize :set_defaults, if: :new_record?

  private

  def set_defaults
    self.active ||= true
    self.sizes ||= []
  end
end
