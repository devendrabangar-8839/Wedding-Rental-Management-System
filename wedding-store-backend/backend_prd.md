# Backend PRD
## Wedding Rental Management System (Rails API)

---

## 1. Purpose

The backend serves as the core rental engine and business logic layer.

Responsibilities:
- Prevent double booking
- Manage rental lifecycle
- Handle order state transitions
- Trigger WhatsApp reminders
- Expose secure REST APIs

Tech Stack:
- Ruby on Rails (API mode)
- PostgreSQL
- JWT Authentication
- Sidekiq (background jobs)

---

## 2. User Roles

### Admin
- Manage products
- Manage orders
- Update order status
- View bookings calendar

### Customer
- View products
- Create rental booking
- View own orders

---

## 3. Core Modules

### 3.1 Authentication
- Email/password login
- JWT token generation
- Role-based authorization

---

### 3.2 Product Management

Endpoints:
- POST /products
- PATCH /products/:id
- DELETE /products/:id
- GET /products

Fields:
- name
- description
- product_type (RENT / SELL / BOTH)
- rent_price_per_day
- sale_price
- security_deposit
- total_quantity
- sizes
- active

---

### 3.3 Rental Booking Engine

Endpoint:
- POST /rental_bookings

Input:
- product_id
- start_date
- end_date
- size
- address

Validation Rule (Prevent Double Booking):
Booking is blocked if:
(start_date <= existing_end_date)
AND
(end_date >= existing_start_date)

System Must:
- Validate date range
- Check availability
- Calculate total rent
- Create order + booking

---

### 3.4 Order Lifecycle

Status Flow:
- Pending
- Confirmed
- Packed
- Out for Delivery
- Delivered
- Pickup Scheduled
- Picked
- Completed
- Cancelled
- Late

Admins can update status.

---

### 3.5 Late Return Logic

If:
current_date > rental_end_date
AND status != Picked

Then:
- Mark as Late
- Calculate late fee
- Trigger reminder

---

### 3.6 Notifications

Triggers:
- Booking confirmation
- 1 day before delivery
- 1 day before return
- Late reminder

Use Sidekiq scheduled jobs.

---

## 4. Database Tables

- users
- products
- orders
- order_items
- rental_bookings
- addresses
- payments
- notifications

---

## 5. Definition of Done

✔ No double booking possible
✔ Secure JWT authentication
✔ Orders created successfully
✔ Status updates working
✔ Late detection working
✔ Reminder jobs functional
