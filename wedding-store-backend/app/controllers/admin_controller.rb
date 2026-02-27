class AdminController < ApplicationController
  before_action :authorize_admin

  def dashboard_metrics
    active_rentals = Order.where(status: ['CONFIRMED', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED']).count
    upcoming_returns = RentalBooking.where(end_date: Date.today..1.week.from_now).count
    late_returns = Order.where(status: 'LATE').count

    recent_bookings = Order.order(created_at: :desc).limit(10).as_json(include: :user)

    render json: {
      metrics: {
        active_rentals: active_rentals,
        upcoming_returns: upcoming_returns,
        late_returns: late_returns
      },
      recent_bookings: recent_bookings
    }
  end

  def calendar
    # Fetch all rental bookings with associated order and product data
    bookings = RentalBooking.includes(order_item: { order: :user }, product: [])
                            .order(start_date: :asc)

    calendar_data = bookings.map do |booking|
      {
        id: booking.id,
        product_id: booking.product_id,
        product_name: booking.product.name,
        size: booking.size,
        start_date: booking.start_date,
        end_date: booking.end_date,
        status: booking.status,
        order_id: booking.order_item.order_id,
        customer_email: booking.order_item.order.user&.email,
        order_status: booking.order_item.order.status,
        total_price: booking.order_item.order.total_price,
        deposit_total: booking.order_item.order.deposit_total,
        created_at: booking.created_at
      }
    end

    render json: { bookings: calendar_data }
  end
end
