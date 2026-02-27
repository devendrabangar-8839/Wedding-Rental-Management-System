class OrdersController < ApplicationController
  before_action :set_order, only: [:show, :update]
  before_action :authorize_admin, only: [:update]

  def index
    if @current_user.admin?
      @orders = Order.all.order(created_at: :desc)
    else
      @orders = @current_user.orders.order(created_at: :desc)
    end
    render json: @orders
  end

  def my_orders
    @orders = @current_user.orders.order(created_at: :desc)
    render json: @orders
  end

  def show
    if @current_user.admin? || @order.user_id == @current_user.id
      render json: @order.as_json(include: { order_items: { include: :product } })
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
    params.require(:order).permit(:status)
  end
end
