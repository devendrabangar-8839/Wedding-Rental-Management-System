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
end
