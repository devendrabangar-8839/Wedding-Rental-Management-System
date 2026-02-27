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
end
