class ProductsController < ApplicationController
  skip_before_action :authenticate_user, only: [:index, :show]
  before_action :authorize_admin, only: [:create, :update, :destroy]
  before_action :set_product, only: [:show, :update, :destroy]

  def index
    @products = Product.all
    @products = @products.search_by_name(params[:search])
    @products = @products.by_type(params[:type])
    render json: @products.as_json(methods: [:image_url])
  end

  def show
    render json: @product.as_json(methods: [:image_url])
  end

  def create
    @product = Product.new(product_params)
    image_blob = params.dig(:product, :image)
    
    if @product.save
      if image_blob
        @product.image.attach(image_blob)
        @product.reload
      end
      render json: @product, status: :created
    else
      render json: { error: @product.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  def update
    image_blob = params.dig(:product, :image)
    remove_image = params.dig(:product, :remove_image) == 'true'
    
    if @product.update(product_params)
      if image_blob
        @product.image.attach(image_blob)
        @product.reload
      elsif remove_image
        @product.image.purge if @product.image.attached?
      end
      render json: @product
    else
      render json: { error: @product.errors.full_messages.join(', ') }, status: :unprocessable_entity
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
    params.require(:product).permit(:name, :description, :product_type, :rent_price, :sale_price, :security_deposit, :total_quantity, :active, sizes: [], image: [])
  end
end
