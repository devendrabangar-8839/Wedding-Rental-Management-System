# Seed products from Stitch UI
Product.destroy_all

products = [
  {
    name: "Maharani Gold Lehenga",
    description: "A masterpiece of traditional craftsmanship featuring heavy zari and hand embroidery peacock motifs. Includes matching blouse and sheer net dupatta.",
    product_type: "both",
    rent_price: 6500,
    sale_price: 45000,
    security_deposit: 8000,
    total_quantity: 5,
    sizes: ["S", "M", "L", "XL"],
    active: true
  },
  {
    name: "Midnight Blue Sherwani",
    description: "Elegant midnight blue velvet sherwani with intricate silver work. Perfect for a royal evening look.",
    product_type: "both",
    rent_price: 12000,
    sale_price: 85000,
    security_deposit: 15000,
    total_quantity: 3,
    sizes: ["M", "L", "XL"],
    active: true
  },
  {
    name: "Floral Bridal Lehenga",
    description: "Exquisite floral patterns on soft silk, designed for the contemporary bride.",
    product_type: "both",
    rent_price: 25000,
    sale_price: 150000,
    security_deposit: 30000,
    total_quantity: 2,
    sizes: ["S", "M"],
    active: true
  },
  {
    name: "Royal Gold Bandhgala",
    description: "Classic royal gold bandhgala with custom buttons and a sharp tailored fit.",
    product_type: "both",
    rent_price: 15000,
    sale_price: 95000,
    security_deposit: 20000,
    total_quantity: 4,
    sizes: ["M", "L", "XL"],
    active: true
  },
  {
    name: "Pastel Silk Saree",
    description: "Graceful pastel silk saree with a traditional border and hand-woven details.",
    product_type: "both",
    rent_price: 10000,
    sale_price: 65000,
    security_deposit: 12000,
    total_quantity: 6,
    sizes: ["One Size"],
    active: true
  }
]

products.each { |p| Product.create!(p) }

puts "Seeded #{Product.count} products from Vows & Veils catalog."

# Admin User
User.find_or_create_by!(email: 'admin@vowsandveils.com') do |u|
  u.password = 'password123'
  u.role = :admin
end

# Customer User
User.find_or_create_by!(email: 'customer@test.com') do |u|
  u.password = 'password123'
  u.role = :customer
end
