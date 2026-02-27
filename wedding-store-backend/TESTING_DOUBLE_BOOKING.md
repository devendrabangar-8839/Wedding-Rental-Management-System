# Double Booking Prevention - Testing Guide

## Overview

This guide explains how to verify that the double-booking prevention system works correctly using atomic transactions and pessimistic locking.

## How Double Booking Prevention Works

### Core Logic

```ruby
# A booking is blocked if:
(start_date <= existing_end_date) AND (end_date >= existing_start_date)
```

### Protection Mechanisms

1. **Atomic Transactions** - All booking operations happen in a database transaction
2. **Pessimistic Locking** - `product.lock!` prevents concurrent modifications
3. **Double-Check** - Availability checked before AND after acquiring lock

---

## Testing Methods

### Method 1: Rails Runner Test (Recommended for First-Time Testing)

This tests the BookingService directly with multiple users.

```bash
cd wedding-store-backend

# Run the comprehensive test script
bin/rails runner test_double_booking.rb
```

**What This Tests:**
- ✅ Sequential non-overlapping bookings (should succeed)
- ✅ Overlapping date bookings (should fail)
- ✅ Concurrent bookings with threads (race condition simulation)
- ✅ Different sizes booking (should both succeed)
- ✅ Multiple quantity products

**Expected Output:**
```
TEST 1: Sequential Bookings
  User 1 booking: ✅ SUCCESS
  User 2 booking: ✅ SUCCESS

TEST 2: Overlapping Dates
  User 3 booking: ✅ CORRECTLY BLOCKED

TEST 3: Concurrent Bookings
  Successful bookings: 1
  Failed bookings: 2
  🎉 PERFECT! Only 1 booking succeeded
```

---

### Method 2: API-Based Test (Real-World Simulation)

This tests via actual HTTP requests with different user tokens.

**Prerequisites:**
```bash
# First, create test users and products
cd wedding-store-backend
bin/rails runner test_double_booking.rb
```

**Run API Test:**
```bash
# Make sure backend is running on port 3001
bin/rails s -p 3001

# In another terminal, run the API test
ruby test_double_booking_api.rb
```

**What This Tests:**
- ✅ JWT authentication flow
- ✅ API endpoint behavior
- ✅ Concurrent HTTP requests
- ✅ Real-world race conditions

---

### Method 3: Manual Frontend Testing

Test with actual user accounts through the UI.

#### Step 1: Create Test Accounts

**Option A: Via Login Page**
1. Navigate to `/login`
2. Use existing admin account or create users via Rails console:

```bash
bin/rails console

# Create two test customers
User.create!(email: 'customer1@test.com', password: 'test123', password_confirmation: 'test123', role: :customer)
User.create!(email: 'customer2@test.com', password: 'test123', password_confirmation: 'test123', role: :customer)

# Create a test product with quantity = 1
Product.create!(
  name: 'Test Booking Product',
  description: 'For testing',
  product_type: 'rent',
  rent_price: 1000,
  security_deposit: 5000,
  total_quantity: 1,
  sizes: ['M'],
  active: true
)

exit
```

#### Step 2: Test Double Booking Prevention

**User 1 Books:**
1. Login as `customer1@test.com`
2. Browse to product listing
3. Click on "Test Booking Product"
4. Click "Book Rental Now"
5. Select dates (e.g., June 1-5, 2026)
6. Select size M
7. Enter address
8. Click "Confirm Booking"
9. ✅ **Should succeed** - Note the order confirmation

**User 2 Tries Same Dates:**
1. Logout and login as `customer2@test.com`
2. Browse to same product
3. Click "Book Rental Now"
4. Select **OVERLAPPING dates** (e.g., June 3-7, 2026)
5. Select size M
6. Enter address
7. Click "Confirm Booking"
8. ❌ **Should fail** with error message

**Expected Error:**
```
Product not available for selected dates/size
```

#### Step 3: Test Non-Overlapping Dates

**User 2 Books Different Dates:**
1. Still logged in as `customer2@test.com`
2. Select **NON-overlapping dates** (e.g., June 10-15, 2026)
3. Select size M
4. Enter address
5. Click "Confirm Booking"
6. ✅ **Should succeed** - Different date range

---

## Test Scenarios

### Scenario 1: Single Quantity, Same Dates

```
Product: Quantity = 1, Size = M
User 1: Books June 1-5, Size M
User 2: Tries June 2-6, Size M
Expected: ❌ User 2 blocked
```

### Scenario 2: Single Quantity, Different Sizes

```
Product: Quantity = 1, Sizes = [S, M, L]
User 1: Books June 1-5, Size S
User 2: Books June 1-5, Size M
Expected: ✅ Both succeed (different sizes)
```

### Scenario 3: Multiple Quantity, Same Dates

```
Product: Quantity = 3, Size = M
User 1: Books June 1-5, Size M
User 2: Books June 1-5, Size M
User 3: Books June 1-5, Size M
User 4: Tries June 1-5, Size M
Expected: ✅ First 3 succeed, 4th blocked
```

### Scenario 4: Concurrent Race Condition

```
Product: Quantity = 1
Time: T=0ms - User 1 clicks "Book"
Time: T=5ms - User 2 clicks "Book" (5ms later)
Expected: Only 1 succeeds, 1 fails
```

---

## Verifying Atomic Transactions

### Check Database State

```bash
bin/rails console

# View all bookings for a product
product = Product.find(1)
product.rental_bookings.each do |booking|
  puts "User: #{booking.order_item.order.user.email}"
  puts "Dates: #{booking.start_date} to #{booking.end_date}"
  puts "Size: #{booking.size}"
  puts "Status: #{booking.status}"
  puts "---"
end

# Check for overlapping bookings (should be none)
require 'date'
bookings = product.rental_bookings.to_a
overlaps = []

bookings.combination(2) do |b1, b2|
  next unless b1.size == b2.size  # Same size
  next unless b1.status == 'active' && b2.status == 'active'
  
  if b1.start_date <= b2.end_date && b1.end_date >= b2.start_date
    overlaps << [b1, b2]
  end
end

if overlaps.empty?
  puts "✅ No overlapping bookings found - Prevention working!"
else
  puts "❌ FOUND #{overlaps.size} overlapping bookings - BUG!"
  overlaps.each { |o| puts "  #{o[0].id} overlaps with #{o[1].id}" }
end
```

---

## Understanding the Code

### BookingService (`app/services/booking_service.rb`)

```ruby
def self.create_booking(user:, product_id:, start_date:, end_date:, size:, address:)
  product = Product.find(product_id)

  # First availability check (before lock)
  unless available?(product_id, start_date, end_date, size)
    return { success: false, message: 'Product not available...' }
  end

  ActiveRecord::Base.transaction do
    # Acquire exclusive lock
    product.lock!

    # Second availability check (after lock - prevents race condition)
    unless available?(product_id, start_date, end_date, size)
      return { success: false, message: 'Product not available...' }
    end

    # Create order, order_item, and rental_booking
    # All or nothing (atomic)
  end
end
```

### Availability Check

```ruby
def self.available?(product_id, start_date, end_date, size)
  # Count overlapping bookings
  overlapping_bookings = RentalBooking
    .where(product_id: product_id, size: size)
    .where('start_date <= ? AND end_date >= ?', end_date, start_date)
    .count

  # Available if overlapping < quantity
  overlapping_bookings < product.total_quantity
end
```

---

## Troubleshooting

### Issue: Both Bookings Succeed (Double Booking Bug)

**Possible Causes:**
1. Pessimistic lock not acquired
2. Transaction not wrapping all operations
3. Different sizes being booked

**Debug:**
```bash
bin/rails console
# Enable SQL logging
ActiveRecord::Base.logger = Logger.new(STDOUT)
# Re-run booking and watch for LOCK queries
```

### Issue: All Bookings Fail

**Possible Causes:**
1. Product not active
2. Size not in product.sizes
3. Validation errors

**Debug:**
```bash
bin/rails console
product = Product.find(1)
puts product.active?
puts product.sizes
puts product.total_quantity
```

### Issue: Concurrent Test Shows All Success

**This is a CRITICAL BUG** if quantity = 1

**Immediate Actions:**
1. Check if `product.lock!` is being called
2. Verify transaction block encompasses all writes
3. Check database supports row-level locking (PostgreSQL does)

---

## Success Criteria

✅ **Test Passes When:**

1. Sequential non-overlapping bookings succeed
2. Overlapping date bookings are rejected
3. Concurrent requests respect quantity limits
4. Different sizes can be booked simultaneously
5. No overlapping bookings exist in database for same size
6. Error messages are clear and helpful

---

## Cleanup

After testing, clean up test data:

```bash
bin/rails console

# Delete test users
User.where(email: /test\d+@example\.com|customer\d+@test\.com/).destroy_all

# Delete test products
Product.where(name: /Test/).destroy_all

# Or reset entire database
bin/rails db:reset  # WARNING: Deletes ALL data
```

---

## Next Steps

Once double-booking prevention is verified:

1. ✅ Core booking logic validated
2. ➡️ Test WhatsApp reminders (Phase 2)
3. ➡️ Test payment integration
4. ➡️ Load testing with more concurrent users
5. ➡️ Deploy to staging environment

---

**Document Version:** 1.0  
**Last Updated:** 2026-02-27
