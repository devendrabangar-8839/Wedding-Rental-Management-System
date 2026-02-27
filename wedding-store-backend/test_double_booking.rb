#!/usr/bin/env ruby
# frozen_string_literal: true

# =============================================================================
# DOUBLE BOOKING PREVENTION TEST SCRIPT
# =============================================================================
# This script verifies that the atomic transaction and pessimistic locking
# correctly prevent double bookings when multiple users try to book the same
# product for overlapping dates.
#
# Usage:
#   rails runner test_double_booking.rb
# =============================================================================

require 'active_record'
require 'concurrent'

puts "=" * 80
puts "DOUBLE BOOKING PREVENTION TEST"
puts "=" * 80
puts ""

# =============================================================================
# SETUP: Create test users and product
# =============================================================================

puts "📦 Setting up test data..."

# Clean up any existing test data
User.where(email: ['test1@example.com', 'test2@example.com', 'test3@example.com']).destroy_all
Product.where(name: 'Test Double Booking Product').destroy_all

# Create test users
user1 = User.create!(
  email: 'test1@example.com',
  password: 'password123',
  password_confirmation: 'password123',
  role: :customer
)

user2 = User.create!(
  email: 'test2@example.com',
  password: 'password123',
  password_confirmation: 'password123',
  role: :customer
)

user3 = User.create!(
  email: 'test3@example.com',
  password: 'password123',
  password_confirmation: 'password123',
  role: :customer
)

# Create test product with quantity = 1 (only one can be booked at a time)
product = Product.create!(
  name: 'Test Double Booking Product',
  description: 'Product for testing double booking prevention',
  product_type: 'rent',
  rent_price: 1000,
  security_deposit: 5000,
  total_quantity: 1,  # CRITICAL: Only 1 unit available
  sizes: ['S', 'M', 'L'],
  active: true
)

puts "✅ Created 3 test users"
puts "✅ Created test product with quantity = 1"
puts ""

# =============================================================================
# TEST 1: Sequential Bookings (Should Work)
# =============================================================================

puts "=" * 80
puts "TEST 1: Sequential Bookings (Non-overlapping dates)"
puts "=" * 80

result1 = BookingService.create_booking(
  user: user1,
  product_id: product.id,
  start_date: Date.new(2026, 6, 1),
  end_date: Date.new(2026, 6, 3),
  size: 'M',
  address: '123 Test Street, User 1'
)

puts "User 1 booking (June 1-3): #{result1[:success] ? '✅ SUCCESS' : '❌ FAILED'}"
puts "   Message: #{result1[:message]}" if result1[:message]

result2 = BookingService.create_booking(
  user: user2,
  product_id: product.id,
  start_date: Date.new(2026, 6, 5),
  end_date: Date.new(2026, 6, 7),
  size: 'M',
  address: '456 Test Avenue, User 2'
)

puts "User 2 booking (June 5-7): #{result2[:success] ? '✅ SUCCESS' : '❌ FAILED'}"
puts "   Message: #{result2[:message]}" if result2[:message]
puts ""

# =============================================================================
# TEST 2: Overlapping Dates (Should Fail - Double Booking)
# =============================================================================

puts "=" * 80
puts "TEST 2: Overlapping Dates (Should be prevented)"
puts "=" * 80

result3 = BookingService.create_booking(
  user: user3,
  product_id: product.id,
  start_date: Date.new(2026, 6, 2),  # Overlaps with User 1's booking
  end_date: Date.new(2026, 6, 4),
  size: 'M',
  address: '789 Test Lane, User 3'
)

puts "User 3 booking (June 2-4, overlaps with User 1): #{result3[:success] ? '❌ UNEXPECTED SUCCESS' : '✅ CORRECTLY BLOCKED'}"
puts "   Message: #{result3[:message]}" if result3[:message]
puts ""

# =============================================================================
# TEST 3: Concurrent Bookings (Race Condition Test)
# =============================================================================

puts "=" * 80
puts "TEST 3: Concurrent Bookings (Race Condition Simulation)"
puts "=" * 80
puts "Creating new product for concurrent test..."

# Create another product for concurrent test
product2 = Product.create!(
  name: 'Test Concurrent Booking Product',
  description: 'Product for testing concurrent bookings',
  product_type: 'rent',
  rent_price: 1000,
  security_deposit: 5000,
  total_quantity: 1,  # Only 1 unit - only one should succeed
  sizes: ['M'],
  active: true
)

# Create more test users for concurrent test
user4 = User.create!(
  email: 'test4@example.com',
  password: 'password123',
  password_confirmation: 'password123',
  role: :customer
)

user5 = User.create!(
  email: 'test5@example.com',
  password: 'password123',
  password_confirmation: 'password123',
  role: :customer
)

user6 = User.create!(
  email: 'test6@example.com',
  password: 'password123',
  password_confirmation: 'password123',
  role: :customer
)

puts "Attempting 3 concurrent bookings for the SAME product, SAME dates, SAME size..."
puts ""

# Use a thread-safe array to collect results
results = Concurrent::Array.new(3)

# Create a barrier to ensure all threads start at the same time
barrier = Concurrent::CyclicBarrier.new(3)

threads = []

# Thread 1
threads << Thread.new do
  barrier.wait
  results[0] = BookingService.create_booking(
    user: user4,
    product_id: product2.id,
    start_date: Date.new(2026, 7, 1),
    end_date: Date.new(2026, 7, 5),
    size: 'M',
    address: 'User 4 Address'
  )
end

# Thread 2
threads << Thread.new do
  barrier.wait
  results[1] = BookingService.create_booking(
    user: user5,
    product_id: product2.id,
    start_date: Date.new(2026, 7, 1),
    end_date: Date.new(2026, 7, 5),
    size: 'M',
    address: 'User 5 Address'
  )
end

# Thread 3
threads << Thread.new do
  barrier.wait
  results[2] = BookingService.create_booking(
    user: user6,
    product_id: product2.id,
    start_date: Date.new(2026, 7, 1),
    end_date: Date.new(2026, 7, 5),
    size: 'M',
    address: 'User 6 Address'
  )
end

# Wait for all threads to complete
threads.each(&:join)

# Count successes and failures
successes = results.count { |r| r[:success] }
failures = results.count { |r| !r[:success] }

puts "Results:"
puts "  ✅ Successful bookings: #{successes}"
puts "  ❌ Failed bookings: #{failures}"
puts ""

if successes == 1 && failures == 2
  puts "🎉 PERFECT! Only 1 booking succeeded (as expected with quantity=1)"
  puts "   Double booking prevention is working correctly!"
elsif successes == 0
  puts "⚠️  All bookings failed - possible race condition issue"
elsif successes > 1
  puts "❌ CRITICAL: #{successes} bookings succeeded for quantity=1"
  puts "   DOUBLE BOOKING BUG DETECTED!"
else
  puts "⚠️  Unexpected result"
end

puts ""

# =============================================================================
# TEST 4: Different Sizes (Should Both Work)
# =============================================================================

puts "=" * 80
puts "TEST 4: Different Sizes (Should Both Work)"
puts "=" * 80

product3 = Product.create!(
  name: 'Test Multi-Size Product',
  description: 'Product for testing different sizes',
  product_type: 'rent',
  rent_price: 1000,
  security_deposit: 5000,
  total_quantity: 1,
  sizes: ['S', 'M', 'L'],
  active: true
)

user7 = User.create!(
  email: 'test7@example.com',
  password: 'password123',
  password_confirmation: 'password123',
  role: :customer
)

user8 = User.create!(
  email: 'test8@example.com',
  password: 'password123',
  password_confirmation: 'password123',
  role: :customer
)

result7 = BookingService.create_booking(
  user: user7,
  product_id: product3.id,
  start_date: Date.new(2026, 8, 1),
  end_date: Date.new(2026, 8, 5),
  size: 'S',  # Size S
  address: 'User 7 Address'
)

puts "User 7 booking (Size S): #{result7[:success] ? '✅ SUCCESS' : '❌ FAILED'}"
puts "   Message: #{result7[:message]}" if result7[:message]

result8 = BookingService.create_booking(
  user: user8,
  product_id: product3.id,
  start_date: Date.new(2026, 8, 1),
  end_date: Date.new(2026, 8, 5),
  size: 'M',  # Size M (different)
  address: 'User 8 Address'
)

puts "User 8 booking (Size M): #{result8[:success] ? '✅ SUCCESS' : '❌ FAILED'}"
puts "   Message: #{result8[:message]}" if result8[:message]

if result7[:success] && result8[:success]
  puts "✅ CORRECT: Different sizes can be booked for same dates"
end
puts ""

# =============================================================================
# TEST 5: Multiple Quantity (Should Allow Multiple Bookings)
# =============================================================================

puts "=" * 80
puts "TEST 5: Multiple Quantity (Should Allow 2 Bookings)"
puts "=" * 80

product4 = Product.create!(
  name: 'Test Multi-Quantity Product',
  description: 'Product with quantity = 2',
  product_type: 'rent',
  rent_price: 1000,
  security_deposit: 5000,
  total_quantity: 2,  # 2 units available
  sizes: ['M'],
  active: true
)

user9 = User.create!(
  email: 'test9@example.com',
  password: 'password123',
  password_confirmation: 'password123',
  role: :customer
)

user10 = User.create!(
  email: 'test10@example.com',
  password: 'password123',
  password_confirmation: 'password123',
  role: :customer
)

result9 = BookingService.create_booking(
  user: user9,
  product_id: product4.id,
  start_date: Date.new(2026, 9, 1),
  end_date: Date.new(2026, 9, 5),
  size: 'M',
  address: 'User 9 Address'
)

puts "User 9 booking (quantity=2 product): #{result9[:success] ? '✅ SUCCESS' : '❌ FAILED'}"

result10 = BookingService.create_booking(
  user: user10,
  product_id: product4.id,
  start_date: Date.new(2026, 9, 1),
  end_date: Date.new(2026, 9, 5),
  size: 'M',
  address: 'User 10 Address'
)

puts "User 10 booking (same dates): #{result10[:success] ? '✅ SUCCESS' : '❌ FAILED'}"

if result9[:success] && result10[:success]
  puts "✅ CORRECT: Both bookings succeeded for quantity=2"
end
puts ""

# =============================================================================
# SUMMARY
# =============================================================================

puts "=" * 80
puts "TEST SUMMARY"
puts "=" * 80
puts ""
puts "All tests completed. Check results above for:"
puts "  ✓ Sequential non-overlapping bookings work"
puts "  ✓ Overlapping date bookings are blocked"
puts "  ✓ Concurrent bookings respect quantity limits"
puts "  ✓ Different sizes can be booked simultaneously"
puts "  ✓ Multiple quantity allows multiple bookings"
puts ""
puts "Cleanup: Test users and products remain in database for inspection"
puts "         Run manually: User.where(email: /test\\d+@example.com/).destroy_all"
puts "                       Product.where(name: /Test/).destroy_all"
puts ""
puts "=" * 80
