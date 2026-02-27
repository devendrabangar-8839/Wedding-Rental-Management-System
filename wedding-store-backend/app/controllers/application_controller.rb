class ApplicationController < ActionController::API
  before_action :authenticate_user
  
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity
  rescue_from StandardError, with: :internal_server_error

  def current_user
    @current_user
  end

  private

  def authenticate_user
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    decoded = JsonWebToken.decode(header)
    @current_user = User.find(decoded[:user_id]) if decoded

    render_error('Unauthorized', :unauthorized, 'auth_required') unless @current_user
  end

  def authorize_admin
    render_error('Forbidden', :forbidden, 'admin_only') unless @current_user&.admin?
  end

  def render_error(message, status = :bad_request, code = 'error')
    render json: { 
      error: {
        code: code,
        message: message
      }
    }, status: status
  end

  def not_found(e)
    render_error(e.message, :not_found, 'record_not_found')
  end

  def unprocessable_entity(e)
    render_error(e.record.errors.full_messages.join(', '), :unprocessable_entity, 'validation_failed')
  end

  def internal_server_error(e)
    # In production, hide stack trace and log to error tracker
    # For now, generic message
    render_error('An internal error occurred', :internal_server_error, 'internal_error')
  end
end
