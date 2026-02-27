class AuthController < ApplicationController
  skip_before_action :authenticate_user, only: [:login, :register]

  def login
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: user.id)
      render json: { token: token, user: { id: user.id, email: user.email, role: user.role } }, status: :ok
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  def register
    user = User.new(
      email: params[:email],
      password: params[:password],
      password_confirmation: params[:password_confirmation],
      role: params[:role] || :customer
    )

    if user.save
      token = JsonWebToken.encode(user_id: user.id)
      render json: { 
        token: token, 
        user: { id: user.id, email: user.email, role: user.role },
        message: 'Account created successfully'
      }, status: :created
    else
      render json: { 
        error: 'Registration failed',
        details: user.errors.full_messages.join(', ')
      }, status: :unprocessable_entity
    end
  end
end
