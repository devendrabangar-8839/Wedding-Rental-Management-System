Rails.application.routes.draw do
  post 'login', to: 'auth#login'
  post 'register', to: 'auth#register'

  # Active Storage Direct Upload
  mount ActiveStorage::Engine => '/rails/active_storage'

  resources :products
  resources :rental_bookings, only: [:create] do
    get 'availability', on: :collection
  end
  resources :orders, only: [:index, :show, :create, :update] do
    get 'my_orders', on: :collection
  end

  get 'admin/dashboard_metrics', to: 'admin#dashboard_metrics'
  get 'admin/calendar', to: 'admin#calendar'

  # Letter Opener for previewing emails in development
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?

  get "up" => "rails/health#show", as: :rails_health_check
end
