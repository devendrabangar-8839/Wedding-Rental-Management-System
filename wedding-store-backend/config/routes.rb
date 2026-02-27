Rails.application.routes.draw do
  post 'login', to: 'auth#login'

  # Active Storage Direct Upload
  mount ActiveStorage::Engine => '/rails/active_storage'

  resources :products
  resources :rental_bookings, only: [:create]
  resources :orders, only: [:index, :show, :create, :update] do
    get 'my_orders', on: :collection
  end

  get 'admin/dashboard_metrics', to: 'admin#dashboard_metrics'

  get "up" => "rails/health#show", as: :rails_health_check
end
