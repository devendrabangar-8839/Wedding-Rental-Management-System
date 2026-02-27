class BookingService
  def self.available?(product_id, start_date, end_date, size)
    product = Product.find(product_id)
    return false unless product.active

    # Check if size is available for this product
    return false unless product.sizes.include?(size)

    # Core double booking prevention logic:
    # A booking is blocked if: (start_date <= existing_end_date) AND (end_date >= existing_start_date)
    overlapping_bookings = RentalBooking.where(product_id: product_id, size: size)
                                        .where('start_date <= ? AND end_date >= ?', end_date, start_date)
                                        .count

    # For MVP Phase 1: We assume each size-item is unique or total_quantity is 1 per size configuration if not specified otherwise.
    # However, if total_quantity > 1, we can have multiple bookings for the same range.
    # Let's assume total_quantity is the total stock across all sizes for simplicity,
    # OR we can treat it as stock per size if we want to be more granular.
    # PRD says "Set total quantity", so we'll compare overlapping bookings with total_quantity.

    overlapping_bookings < product.total_quantity
  end

  def self.get_booked_dates(product_id, size)
    product = Product.find_by(id: product_id)
    return [] unless product

    # Get all non-cancelled bookings (active, confirmed, delivered, etc.)
    bookings = RentalBooking.where(product_id: product_id, size: size)
                            .where.not(status: 'CANCELLED')
                            .select(:start_date, :end_date)

    booked_dates = []
    bookings.each do |booking|
      current_date = booking.start_date.to_date
      end_date = booking.end_date.to_date
      while current_date <= end_date
        booked_dates << current_date.to_s
        current_date = current_date + 1
      end
    end

    booked_dates.uniq.sort
  end

  def self.create_booking(user:, product_id:, start_date:, end_date:, size:, address:)
    product = Product.find(product_id)

    unless available?(product_id, start_date, end_date, size)
      return { success: false, message: 'Product not available for selected dates/size' }
    end

    order = nil
    
    ActiveRecord::Base.transaction do
      # Pessimistic locking to prevent race conditions
      product.lock!

      unless available?(product_id, start_date, end_date, size)
        return { success: false, message: 'Product not available for selected dates/size' }
      end

      days = (end_date.to_date - start_date.to_date).to_i + 1
      rent_total = product.rent_price * days
      deposit = product.security_deposit

      order = Order.create!(
        user: user,
        status: :pending,
        total_price: rent_total,
        deposit_total: deposit,
        address: address
      )

      order_item = OrderItem.create!(
        order: order,
        product: product,
        quantity: 1,
        price: product.rent_price,
        size: size
      )

      RentalBooking.create!(
        order_item: order_item,
        product: product,
        start_date: start_date,
        end_date: end_date,
        size: size,
        status: 'active'
      )

      # Queue booking confirmation email (non-blocking)
      BookingConfirmationWorker.perform_async(order.id)
    end

    { success: true, order: order }
  rescue => e
    Rails.logger.error "[BookingService] Error creating booking: #{e.message}"
    Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
    { success: false, message: e.message }
  end
end
