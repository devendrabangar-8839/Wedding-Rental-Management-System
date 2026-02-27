class RentalBookingsController < ApplicationController
  def create
    result = BookingService.create_booking(
      user: @current_user,
      product_id: params[:product_id],
      start_date: params[:start_date],
      end_date: params[:end_date],
      size: params[:size],
      address: params[:address]
    )

    if result[:success]
      render json: result[:order], status: :created
    else
      render json: { error: result[:message] }, status: :unprocessable_entity
    end
  end

  def availability
    product_id = params[:product_id]
    size = params[:size]

    return render json: { error: 'Product ID and size are required' }, status: :bad_request unless product_id && size

    product = Product.find_by(id: product_id)
    return render json: { error: 'Product not found' }, status: :not_found unless product

    booked_dates = BookingService.get_booked_dates(product_id, size)

    render json: {
      product_id: product_id,
      size: size,
      booked_dates: booked_dates,
      available_sizes: product.sizes
    }
  end
end
