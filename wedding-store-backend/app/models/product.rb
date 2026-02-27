class Product < ApplicationRecord
  enum :product_type, { rent: 'RENT', sell: 'SELL', both: 'BOTH' }

  has_one_attached :image
  has_many :order_items, dependent: :destroy
  has_many :rental_bookings, dependent: :destroy

  scope :search_by_name, ->(query) { query.present? ? where('name ILIKE ?', "%#{query}%") : all }
  scope :by_type, ->(type) { type.present? ? where(product_type: type) : all }

  validates :name, presence: true
  validates :product_type, presence: true
  validates :rent_price, numericality: { greater_than_or_equal_to: 0 }, if: -> { rent? || both? }
  validates :sale_price, numericality: { greater_than_or_equal_to: 0 }, if: -> { sell? || both? }
  validates :total_quantity, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  after_initialize :set_defaults, if: :new_record?

  def image_url
    return nil unless image.attached?
    Rails.application.routes.url_helpers.rails_blob_url(image, only_path: true)
  rescue => e
    Rails.logger.error("Error generating image URL: #{e.message}")
    nil
  end

  def as_json(options = {})
    opts = options.dup
    opts[:methods] = Array(opts[:methods]) + [:image_url]
    super(opts)
  end

  private

  def set_defaults
    self.active ||= true
    self.sizes ||= []
  end
end
