class ReminderWorker
  include Sidekiq::Worker

  def perform
    # 1. Check for late returns
    late_orders = Order.joins(:rental_bookings)
                       .where(status: 'DELIVERED') # Or any status indicating it's with the customer
                       .where('rental_bookings.end_date < ?', Date.today)
                       .distinct

    late_orders.each do |order|
      order.update(status: 'LATE')
      # Trigger Late Notification
      puts "Triggered LATE reminder for Order ##{order.id} to #{order.user.email}"
    end

    # 2. Upcoming delivery (1 day before)
    upcoming_delivery = RentalBooking.where(start_date: Date.tomorrow)
    upcoming_delivery.each do |booking|
      puts "Triggered UPCOMING DELIVERY reminder for Product: #{booking.product.name} to #{booking.order_item.order.user.email}"
    end

    # 3. Upcoming return (1 day before)
    upcoming_return = RentalBooking.where(end_date: Date.tomorrow)
    upcoming_return.each do |booking|
      puts "Triggered UPCOMING RETURN reminder for Product: #{booking.product.name} to #{booking.order_item.order.user.email}"
    end
  end
end
