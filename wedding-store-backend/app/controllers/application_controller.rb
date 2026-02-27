class ApplicationController < ActionController::API
  before_action :authenticate_user

  def current_user
    @current_user
  end

  private

  def authenticate_user
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    decoded = JsonWebToken.decode(header)
    @current_user = User.find(decoded[:user_id]) if decoded

    render json: { errors: 'Unauthorized' }, status: :unauthorized unless @current_user
  end

  def authorize_admin
    render json: { errors: 'Forbidden' }, status: :forbidden unless @current_user&.admin?
  end
end
