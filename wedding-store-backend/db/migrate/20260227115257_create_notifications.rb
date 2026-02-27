class CreateNotifications < ActiveRecord::Migration[8.0]
  def change
    create_table :notifications do |t|
      t.references :user, null: false, foreign_key: true
      t.references :order, null: true, foreign_key: true
      t.string :channel, null: false
      t.string :notification_type, null: false
      t.string :status, null: false, default: 'pending'
      t.datetime :sent_at
      t.text :error_message
      t.jsonb :metadata, default: {}

      t.timestamps
    end

    # Additional indexes for efficient querying (user_id and order_id already indexed by references)
    add_index :notifications, :status
    add_index :notifications, :notification_type
    add_index :notifications, :channel
    add_index :notifications, [:user_id, :status]
    add_index :notifications, [:notification_type, :status]
    add_index :notifications, [:channel, :status]
    add_index :notifications, :created_at
  end
end
