class User < ApplicationRecord
  has_secure_password

  enum :role, { customer: 0, admin: 1 }

  has_many :orders, dependent: :destroy

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :role, presence: true
end
