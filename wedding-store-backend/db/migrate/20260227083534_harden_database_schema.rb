class HardenDatabaseSchema < ActiveRecord::Migration[8.0]
  def change
    # Users
    change_column_null :users, :email, false
    change_column_null :users, :password_digest, false
    add_index :users, :email, unique: true, if_not_exists: true

    # Products
    change_column_null :products, :name, false
    change_column_null :products, :product_type, false
    change_column_null :products, :total_quantity, false
    change_column_default :products, :active, from: nil, to: true

    # Orders
    change_column_null :orders, :status, false
    change_column_null :orders, :total_price, false

    # Rental Bookings - High performance & Integrity
    change_column_null :rental_bookings, :start_date, false
    change_column_null :rental_bookings, :end_date, false
    change_column_null :rental_bookings, :size, false
    add_index :rental_bookings, [:product_id, :size, :start_date, :end_date], name: 'idx_rental_integrity'

    # Payments
    change_column_null :payments, :amount, false
    change_column_null :payments, :status, false
  end
end
