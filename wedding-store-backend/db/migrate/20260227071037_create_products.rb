class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.string :name
      t.text :description
      t.string :product_type
      t.decimal :rent_price
      t.decimal :sale_price
      t.decimal :security_deposit
      t.integer :total_quantity
      t.jsonb :sizes
      t.boolean :active

      t.timestamps
    end
  end
end
