Rails.application.routes.draw do
  post 'login', to: 'auth#login'
  
  resources :products
  resources :rental_bookings, only: [:create]
  resources :orders, only: [:index, :show, :create, :update] do
    get 'my_orders', on: :collection
  end

  get 'admin/dashboard_metrics', to: 'admin#dashboard_metrics'

  get "up" => "rails/health#show", as: :rails_health_check
end
