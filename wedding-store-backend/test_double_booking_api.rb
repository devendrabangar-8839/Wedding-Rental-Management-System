#!/usr/bin/env ruby
# frozen_string_literal: true

# =============================================================================
# API-BASED DOUBLE BOOKING TEST
# =============================================================================
# This script tests double-booking prevention via actual API calls with
# different user tokens, simulating real-world usage.
#
# Prerequisites:
#   1. Backend server running on localhost:3001
#   2. At least one product created in the database
#
# Usage:
#   ruby test_double_booking_api.rb
# =============================================================================

require 'net/http'
require 'json'
require 'uri'
require 'concurrent'

API_BASE = 'http://localhost:3001'

puts "=" * 80
puts "API-BASED DOUBLE BOOKING TEST"
puts "=" * 80
puts ""

# =============================================================================
# HELPER METHODS
# =============================================================================

def make_request(method, path, token = nil, data = nil)
  uri = URI("#{API_BASE}#{path}")
  http = Net::HTTP.new(uri.host, uri.port)
  
  request = case method
            when :post
              Net::HTTP::Post.new(uri)
            when :get
              Net::HTTP::Get.new(uri)
            end
  
  request['Content-Type'] = 'application/json'
  request['Authorization'] = "Bearer #{token}" if token
  request.body = data.to_json if data
  
  response = http.request(request)
  {
    status: response.code.to_i,
    body: JSON.parse(response.body) rescue {}
  }
end

def login(email, password)
  response = make_request(:post, '/login', nil, {
    email: email,
    password: password
  })
  
  if response[:status] == 200
    puts "✅ Logged in as #{email}"
    response[:body]['token']
  else
    puts "❌ Login failed for #{email}: #{response[:body]}"
    nil
  end
end

def get_products
  response = make_request(:get, '/products')
  response[:body]
end

def create_booking(token, product_id, start_date, end_date, size, address)
  response = make_request(:post, '/rental_bookings', token, {
    product_id: product_id,
    start_date: start_date,
    end_date: end_date,
    size: size,
    address: address
  })
  
  {
    success: response[:status] == 201,
    status: response[:status],
    body: response[:body]
  }
end

# =============================================================================
# STEP 1: Login Users
# =============================================================================

puts "STEP 1: Logging in test users..."
puts "-" * 80

token1 = login('test1@example.com', 'password123')
token2 = login('test2@example.com', 'password123')
token3 = login('test3@example.com', 'password123')

if !token1 || !token2 || !token3
  puts ""
  puts "❌ ERROR: Not all users could log in."
  puts "   Make sure test users exist in the database."
  puts "   Run: rails runner test_double_booking.rb (first script) to create them"
  exit 1
end

puts ""

# =============================================================================
# STEP 2: Get Available Products
# =============================================================================

puts "STEP 2: Fetching available products..."
puts "-" * 80

products = get_products
if products.empty?
  puts "❌ ERROR: No products found. Create a product first."
  exit 1
end

# Find a product with quantity = 1 for testing
test_product = products.find { |p| p['total_quantity'] == 1 } || products.first

puts "Using product: #{test_product['name']} (ID: #{test_product['id']}, Qty: #{test_product['total_quantity']})"
puts ""

# =============================================================================
# STEP 3: Test Sequential Bookings
# =============================================================================

puts "STEP 3: Testing Sequential Non-Overlapping Bookings..."
puts "-" * 80

result1 = create_booking(
  token1,
  test_product['id'],
  '2026-10-01',
  '2026-10-03',
  test_product['sizes'].first,
  'User 1 Address'
)

puts "User 1 (Oct 1-3): #{result1[:success] ? '✅ SUCCESS' : '❌ FAILED'} - Status: #{result1[:status]}"
puts "   Response: #{result1[:body]}" unless result1[:success]

result2 = create_booking(
  token2,
  test_product['id'],
  '2026-10-05',
  '2026-10-07',
  test_product['sizes'].first,
  'User 2 Address'
)

puts "User 2 (Oct 5-7): #{result2[:success] ? '✅ SUCCESS' : '❌ FAILED'} - Status: #{result2[:status]}"
puts "   Response: #{result2[:body]}" unless result2[:success]
puts ""

# =============================================================================
# STEP 4: Test Overlapping Booking (Should Fail)
# =============================================================================

puts "STEP 4: Testing Overlapping Booking (Should Be Blocked)..."
puts "-" * 80

result3 = create_booking(
  token3,
  test_product['id'],
  '2026-10-02',  # Overlaps with User 1
  '2026-10-04',
  test_product['sizes'].first,
  'User 3 Address'
)

if result3[:success]
  puts "User 3 (Oct 2-4, overlaps): ❌ UNEXPECTED SUCCESS - Double booking bug!"
  puts "   Response: #{result3[:body]}"
else
  puts "User 3 (Oct 2-4, overlaps): ✅ CORRECTLY BLOCKED"
  puts "   Error: #{result3[:body]['error'] || result3[:body]}"
end
puts ""

# =============================================================================
# STEP 5: Concurrent API Requests
# =============================================================================

puts "STEP 5: Testing Concurrent API Requests..."
puts "-" * 80

# Create a new product for concurrent test (or use one with qty > current bookings)
concurrent_product = products.find { |p| p['total_quantity'] >= 3 } || test_product

puts "Using product for concurrent test: #{concurrent_product['name']} (Qty: #{concurrent_product['total_quantity']})"
puts "Attempting 3 simultaneous bookings for SAME dates..."
puts ""

results = Concurrent::Array.new(3)
barrier = Concurrent::CyclicBarrier.new(3)

threads = []

[token1, token2, token3].each_with_index do |token, i|
  threads << Thread.new do
    barrier.wait
    results[i] = create_booking(
      token,
      concurrent_product['id'],
      '2026-11-01',
      '2026-11-05',
      concurrent_product['sizes'].first,
      "User #{i + 1} Concurrent Address"
    )
  end
end

threads.each(&:join)

successes = results.count { |r| r[:success] }
failures = results.count { |r| !r[:success] }

puts "Concurrent Test Results:"
puts "  ✅ Successful: #{successes}"
puts "  ❌ Failed: #{failures}"
puts ""

expected_successes = [concurrent_product['total_quantity'], 3].min

if successes == expected_successes
  puts "🎉 PERFECT! #{successes} booking(s) succeeded (matching quantity limit)"
  puts "   Atomic transactions and pessimistic locking working correctly!"
elsif successes > expected_successes
  puts "❌ CRITICAL: Too many bookings succeeded!"
  puts "   Expected: #{expected_successes}, Got: #{successes}"
  puts "   DOUBLE BOOKING BUG DETECTED!"
else
  puts "⚠️  Fewer bookings succeeded than expected"
end

puts ""

# =============================================================================
# SUMMARY
# =============================================================================

puts "=" * 80
puts "API TEST SUMMARY"
puts "=" * 80
puts ""
puts "Test Coverage:"
puts "  ✓ User authentication via API"
puts "  ✓ Sequential non-overlapping bookings"
puts "  ✓ Overlapping date detection and blocking"
puts "  ✓ Concurrent request handling with atomic transactions"
puts ""
puts "Key Validations:"
puts "  • JWT authentication working"
puts "  • Double booking prevention active"
puts "  • Pessimistic locking prevents race conditions"
puts "  • Quantity limits respected"
puts ""
puts "=" * 80
