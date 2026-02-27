class ProductsController < ApplicationController
  skip_before_action :authenticate_user, only: [:index, :show]
  before_action :authorize_admin, only: [:create, :update, :destroy]
  before_action :set_product, only: [:show, :update, :destroy]

  def index
    @products = Product.all
    @products = @products.search_by_name(params[:search])
    @products = @products.by_type(params[:type])
    render json: @products
  end

  def show
    render json: @product
  end

  def create
    @product = Product.new(product_params)
    if @product.save
      render json: @product, status: :created
    else
      render json: @product.errors, status: :unprocessable_entity
    end
  end

  def update
    if @product.update(product_params)
      render json: @product
    else
      render json: @product.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @product.destroy
    head :no_content
  end

  private

  def set_product
    @product = Product.find(params[:id])
  end

  def product_params
    params.require(:product).permit(:name, :description, :product_type, :rent_price, :sale_price, :security_deposit, :total_quantity, :active, sizes: [])
  end
end
