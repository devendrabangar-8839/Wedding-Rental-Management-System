class CreateRentalBookings < ActiveRecord::Migration[8.0]
  def change
    create_table :rental_bookings do |t|
      t.references :order_item, null: false, foreign_key: true
      t.references :product, null: false, foreign_key: true
      t.date :start_date
      t.date :end_date
      t.string :size
      t.string :status

      t.timestamps
    end
    add_index :rental_bookings, :start_date
    add_index :rental_bookings, :end_date
  end
end
