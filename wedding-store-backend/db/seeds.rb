# Seed data for Wedding Rental MVP

# Create Admin User
admin = User.create!(
  email: 'admin@wedding.com',
  password: 'password123',
  password_confirmation: 'password123',
  role: :admin
)

# Create Customer User
customer = User.create!(
  email: 'customer@test.com',
  password: 'password123',
  password_confirmation: 'password123',
  role: :customer
)

# Create Products
Product.create!(
  name: 'Velvet Royal Sherwani',
  description: 'A premium velvet sherwani with intricate gold embroidery. Perfect for wedding receptions.',
  product_type: 'both',
  rent_price: 5000,
  sale_price: 25000,
  security_deposit: 10000,
  total_quantity: 5,
  sizes: %w[S M L XL],
  active: true
)

Product.create!(
  name: 'Midnight Blue Lehenga',
  description: 'Stunning midnight blue lehenga with silver mirror work. Includes dupatta and blouse.',
  product_type: 'rent',
  rent_price: 7000,
  security_deposit: 15000,
  total_quantity: 3,
  sizes: %w[M L],
  active: true
)

Product.create!(
  name: 'Classic White Tuxedo',
  description: 'Modern fit white tuxedo with black lapels. Includes jacket and trousers.',
  product_type: 'both',
  rent_price: 3500,
  sale_price: 15000,
  security_deposit: 5000,
  total_quantity: 10,
  sizes: %w[S M L XL XXL],
  active: true
)

Product.create!(
  name: 'Pink Floral Saree',
  description: 'Elegant pink floral saree in georgette. Comes with stitched blouse.',
  product_type: 'sell',
  sale_price: 8000,
  total_quantity: 20,
  sizes: %w[Free],
  active: true
)

puts "Seeded #{User.count} users and #{Product.count} products."
