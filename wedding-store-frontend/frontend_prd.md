# Frontend PRD
## Wedding Rental Management System (Next.js + Tailwind + shadcn)

---

## 1. Purpose

The frontend provides:
- Clean UI for customers
- Operational dashboard for admin
- Smooth rental booking experience
- Visual order lifecycle tracking

Tech Stack:
- Next.js (App Router)
- Tailwind CSS
- shadcn/ui

---

## 2. Customer-Side Features

### 2.1 Landing Page
- Hero section
- Browse Collection CTA
- Featured products grid
- 3-step process section (Select → Book → Delivered)

---

### 2.2 Product Listing Page
- Responsive grid
- Filter sidebar (Rent/Sale/Price/Size)
- ProductCard component

ProductCard Includes:
- Image
- Name
- Rent price per day
- Badge (RENT / BOTH)
- Primary CTA button

---

### 2.3 Product Detail Page

Layout:
- Left: Image gallery
- Right: Booking panel

Booking Panel Includes:
- Size selector
- Date range picker
- Price summary
- Security deposit info
- Primary CTA button

Mobile:
- Sticky bottom CTA

---

### 2.4 Booking Modal
- Start date
- End date
- Address field
- Order summary
- Confirm button
- Error state for unavailable dates

---

## 3. Admin Dashboard

### 3.1 Layout
- Sidebar navigation
- Header
- Main content area

Sidebar Items:
- Dashboard
- Products
- Orders
- Calendar

---

### 3.2 Dashboard Screen
- Metrics cards (Active rentals, Upcoming returns, Late returns)
- Recent bookings table

---

### 3.3 Orders Page
- Table layout
- Status badges
- Quick action dropdown

Status Colors:
- Confirmed (blue)
- Delivered (green)
- Pickup Scheduled (amber)
- Late (red)

---

### 3.4 Calendar Page
- Monthly calendar view
- Highlight booked dates
- Click date → show bookings

---

## 4. UX Requirements

- Mobile-first
- Consistent 8px spacing system
- Clear hierarchy
- Minimal visual clutter
- Strong error states
- Clear empty states
- Accessible contrast

---

## 5. Reusable Components

- ProductCard
- StatusBadge
- PriceSummaryBox
- BookingPanel
- OrderTable
- SidebarNavigation

---

## 6. Definition of Done

✔ Products display correctly
✔ Booking flow works end-to-end
✔ Admin can manage orders visually
✔ Status changes reflect properly
✔ Fully responsive (mobile + desktop)

