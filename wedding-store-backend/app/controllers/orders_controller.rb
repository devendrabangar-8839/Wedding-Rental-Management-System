class OrdersController < ApplicationController
  before_action :set_order, only: [:show, :update]
  before_action :authorize_admin, only: [:update]

  def index
    if @current_user.admin?
      @orders = Order.preload(:user, order_items: [:product, :rental_booking]).all.order(created_at: :desc)
    else
      @orders = @current_user.orders.preload(order_items: [:product, :rental_booking]).order(created_at: :desc)
    end
    render json: @orders.as_json(include: {
      user: { only: [:email] },
      order_items: { include: [:product, :rental_booking] }
    })
  end

  def create
    @order = @current_user.orders.build(order_params)
    if @order.save
      render json: @order, status: :created
    else
      puts "ORDER VALIDATION FAILED: #{@order.errors.full_messages}"
      render json: { error: @order.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  def show
    if @current_user.admin? || @order.user_id == @current_user.id
      render json: @order.as_json(include: { order_items: { include: [:product, :rental_booking] } })
    else
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def update
    if @order.update(order_params)
      render json: @order
    else
      render json: @order.errors, status: :unprocessable_entity
    end
  end

  private

  def set_order
    @order = Order.find(params[:id])
  end

  def order_params
    params.require(:order).permit(
      :status, :total_price, :deposit_total, :address,
      order_items_attributes: [
        :product_id, :quantity, :price, :size,
        rental_booking_attributes: [:start_date, :end_date, :product_id, :size, :status]
      ]
    )
  end
end
