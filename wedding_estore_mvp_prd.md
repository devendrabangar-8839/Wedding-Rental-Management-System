# PRD.md

# Wedding Rental Management System
## Phase 1 MVP (Foundational Release)

---

# 1. Vision for Phase 1

Build a minimal but production-usable rental management system for a single wedding shop owner that:

- Prevents double booking
- Tracks rental lifecycle
- Sends basic automated reminders
- Digitizes manual rental operations

This phase focuses ONLY on solving the operational rental problem.

---

# 2. Target User

Primary User:
- Single wedding shop owner (Sherwani / Lehenga / Accessories rental shop)

Secondary User:
- End customer renting an outfit

This is NOT a marketplace in Phase 1.

---

# 3. Core Problem Being Solved

Current Offline Problems:

- Double booking of same outfit
- Manual diary-based tracking
- Late returns
- Manual WhatsApp reminder calls
- No structured delivery tracking

Phase 1 solves these digitally.

---

# 4. Phase 1 Scope (Must-Have Features)

## 4.1 Authentication

- Admin login
- Customer basic registration/login
- Role-based access (admin / customer)

---

## 4.2 Product Management (Admin)

Admin can:

- Create product
- Edit product
- Set product type (RENT / SELL / BOTH)
- Set rent price per day
- Set security deposit
- Set total quantity
- Set available sizes
- Activate / deactivate product

Fields Required:

- name
- description
- product_type
- rent_price_per_day
- sale_price (optional)
- security_deposit
- total_quantity
- sizes

---

## 4.3 Product Listing (Customer Side)

Customer can:

- View product list
- Filter by rent/sale
- View product detail

---

## 4.4 Rental Booking Engine (Core Feature)

Customer must:

- Select start date
- Select end date
- Select size
- Enter delivery address

System must:

- Check availability
- Prevent overlapping bookings
- Calculate rent = rent_price_per_day × days
- Add security deposit
- Create order record

Critical Business Rule:

A booking is blocked if:

(start_date <= existing_end_date)
AND
(end_date >= existing_start_date)

This is the heart of Phase 1.

---

## 4.5 Order Lifecycle Tracking

Order Status Flow:

- Pending
- Confirmed
- Packed
- Out for Delivery
- Delivered
- Pickup Scheduled
- Picked
- Completed
- Cancelled

Admin updates status manually.

---

## 4.6 Basic WhatsApp Reminder Automation

System sends automated WhatsApp messages for:

1. Booking confirmation
2. 1 day before delivery
3. 1 day before return
4. Late return reminder

Implementation:
- Background jobs (Sidekiq)
- Scheduled cron checks
- WhatsApp API integration

---

## 4.7 Late Return Handling

If current_date > end_date AND order not picked:

- Mark as Late
- Calculate late fee per day
- Send reminder

Deposit refund handled manually in Phase 1.

---

# 5. Out of Scope (Phase 2 Features)

- Multi-vendor marketplace
- Delivery partner API integration
- AI size recommendation
- Mobile app
- Wallet system
- Ratings and reviews
- Advanced analytics dashboard

---

# 6. Technical Architecture

Frontend:
- Next.js (App Router)
- Tailwind CSS
- shadcn/ui

Backend:
- Rails API mode
- PostgreSQL
- JWT authentication
- Sidekiq for background jobs

---

# 7. Database Tables (Phase 1)

- users
- products
- rental_bookings
- orders
- order_items
- addresses
- payments
- notifications

---

# 8. Definition of Done (Phase 1 Complete When)

✔ No double booking possible
✔ Admin can manage products
✔ Customer can successfully rent item
✔ Order lifecycle is trackable
✔ WhatsApp reminders are sent automatically
✔ Late return detection works

If these are working, Phase 1 MVP is successful.

---

# 9. Estimated Timeline

Week 1–2: Backend core models + booking logic  
Week 3: Frontend integration + UI  
Week 4: WhatsApp + reminders + testing  

Total: ~4 weeks for Phase 1 MVP

---

END OF PHASE 1 MVP PRD

