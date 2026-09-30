# Salon Appointment Booking Website (MERN Stack)

A complete, full-stack college project for booking salon services, managing stylists' working hours, and handling salon operations. Built with the **MERN** stack (MongoDB, Express.js, React, Node.js), featuring separate applications for customers and salon administrators.

---

## 📁 Project Architecture & Folder Structure

```
salon-appointment-booking/
├── user-frontend/       # Customer-facing React application (Vite, Port 3000)
├── admin-frontend/      # Admin-facing React application (Vite, Port 3001)
├── backend/             # Node.js and Express REST API (Port 5000)
├── database/            # MongoDB connection, Mongoose schemas/models, and seed data
└── README.md            # Project overview and setup instructions
```

---

## 🌟 Key Features

### 1. Customer User Frontend (`user-frontend/`)
- **Service Browsing**: Browse hair, beard, skincare, and spa treatments categorized with descriptions, duration, and prices.
- **Multi-Service Selection**: Select multiple services for a single visit (e.g. Haircut + Beard Grooming); automatically computes combined duration and pricing.
- **Stylist Selection**: Choose a specific stylist or select **"Any available stylist"** for optimal scheduling.
- **Real-Time Slot Availability**: Automatically generates open slots dynamically based on working hours, days off, and existing reservations.
- **Guest Information & Confirmation**: Collects customer contact details and generates a unique booking reference code (`SLN-XXXXXX`).
- **Booking Self-Service Lookup**: Customers can search by their booking code to check live status (Confirmed, Cancelled, Completed) or cancel their appointment.

### 2. Admin Portal Frontend (`admin-frontend/`)
- **Secure Authentication**: Protected routes with JWT token authentication and role verification.
- **Overview Dashboard**: KPI metrics including today's bookings, total revenue estimates, status breakdown, and active stylists.
- **Service Management (CRUD)**: Add new treatments, update pricing/durations, toggle active status, and remove services.
- **Stylist & Shift Management**: Manage staff profiles, set specific daily working hours (start/end), and mark designated weekly days off (e.g. Sunday/Monday).
- **Appointment Management**: Filter by date, status, or stylist; search by guest name or reference code.
- **Rescheduling & Cancellation**: Change booking dates and time slots with server-side overlap prevention, or cancel appointments.

### 3. Backend REST API (`backend/`)
- Express.js REST API with clean MVC architecture (Controllers, Routes, Middleware, Utils).
- Conflict prevention engine: Validates that appointments fit within stylist hours and prevents double-booking.
- Intelligently assigns an available stylist when the customer chooses "Any available stylist".
- Protected admin routes with Bearer token middleware (`/api/services`, `/api/stylists`, `/api/appointments`, `/api/stats`).

### 4. Database Module (`database/`)
- Mongoose schemas for `Service`, `Stylist`, `Admin`, and `Appointment`.
- Automatic In-Memory MongoDB fallback (`mongodb-memory-server`) so evaluators and students can test the project immediately even if a local MongoDB server is not pre-installed!
- Complete seed script (`seed.js`) providing 8 sample treatments, 4 master stylists with realistic hours and days off, 1 default admin, and demo appointments.

---

## ⚙️ Prerequisites

Before running the project, ensure you have:
- **Node.js** (v18.x, v20.x, or v22+)
- **npm** (v9+ or v10+)
- **MongoDB** (Optional: Local MongoDB or MongoDB Atlas URI; if not running, an in-memory database will automatically activate for evaluation!)

---

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

Open a terminal and install dependencies for each module:

```bash
# 1. Database dependencies
cd salon-appointment-booking/database
npm install

# 2. Backend dependencies
cd ../backend
npm install

# 3. User Frontend dependencies
cd ../user-frontend
npm install

# 4. Admin Frontend dependencies
cd ../admin-frontend
npm install
```

---

### Step 2: Environment Setup

Create `.env` files from the provided `.env.example` templates:

#### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/salon_appointment_db
JWT_SECRET=salon_super_secure_jwt_dev_secret_2026
```

#### User Frontend (`user-frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

#### Admin Frontend (`admin-frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

### Step 3: Run the Applications

Open 3 separate terminal tabs:

#### Terminal 1 — Start Backend Server:
```bash
cd salon-appointment-booking/backend
npm start
# Runs on: http://localhost:5000
```
*(On first startup, the backend automatically seeds initial services, stylists, default admin, and demo bookings if the database is empty).*

#### Terminal 2 — Start Customer Website (User Frontend):
```bash
cd salon-appointment-booking/user-frontend
npm run dev
# Open in browser: http://localhost:3000
```

#### Terminal 3 — Start Salon Staff Portal (Admin Frontend):
```bash
cd salon-appointment-booking/admin-frontend
npm run dev
# Open in browser: http://localhost:3001
```

---

## 🔑 Default Admin Credentials

To log in to the Admin Portal (`http://localhost:3001`):

- **Email**: `admin@salon.com`
- **Password**: `admin123`

---

## 📋 Pre-Seeded Sample Data

### Stylists:
| Name | Specializations | Working Hours | Days Off |
| :--- | :--- | :--- | :--- |
| **Sophia Martinez** | Haircut & Styling, Hair Coloring | 09:00 – 18:00 | Sunday |
| **David Chen** | Beard & Grooming, Haircut & Styling | 10:00 – 19:00 | Monday |
| **Emma Watson** | Skin & Facial, Hair Coloring | 09:00 – 17:00 | Saturday, Sunday |
| **Marcus Vance** | Spa & Massage, Haircut & Styling | 10:00 – 18:00 | Tuesday |

### Sample Services:
- Classic Haircut & Blowdry ($35, 45 mins)
- Deluxe Beard Grooming & Hot Towel ($25, 30 mins)
- Balayage & Gloss Finish ($110, 90 mins)
- Hydra-Glow Facial Treatment ($65, 50 mins)
- Aromatherapy Scalp & Shoulder Spa ($45, 40 mins)
- Keratin Smoothing Therapy ($130, 90 mins)
- Signature Haircut & Beard Combo ($55, 60 mins)
- Activated Charcoal Deep Detox Facial ($50, 45 mins)

---

## 📡 API Reference Overview

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/services` | List all active services | Public |
| `POST` | `/api/services` | Add new service | Admin |
| `PUT` | `/api/services/:id` | Update service details | Admin |
| `DELETE` | `/api/services/:id` | Delete service | Admin |
| `GET` | `/api/stylists` | List all stylists | Public |
| `POST` | `/api/stylists` | Add new stylist with hours/days off | Admin |
| `PUT` | `/api/stylists/:id` | Update stylist shift & days off | Admin |
| `DELETE` | `/api/stylists/:id` | Delete stylist | Admin |
| `GET` | `/api/availability` | Calculate open time slots | Public |
| `POST` | `/api/appointments` | Book new appointment | Public |
| `GET` | `/api/appointments` | List all appointments with filters | Admin |
| `GET` | `/api/appointments/:idOrRef` | Get booking receipt by reference | Public |
| `PUT` | `/api/appointments/:id/reschedule` | Reschedule appointment | Admin |
| `PUT` | `/api/appointments/:id/cancel` | Cancel appointment | Public/Admin |
| `PUT` | `/api/appointments/:id/status` | Update booking status | Admin |
| `POST` | `/api/auth/login` | Admin login | Public |
| `GET` | `/api/stats` | Dashboard statistics & metrics | Admin |

---

## 🎓 Academic Compliance & Notes

- **MERN Stack**: Clean separation of MongoDB (Mongoose), Express.js backend, React user frontend, React admin frontend, and Node.js runtime.
- **Zero Notifications / Payments**: Strictly compliant with the requirement to omit external third-party payment gateways and SMS/email services.
- **Server-Side Validation**: All overlapping checks and availability validations are performed server-side before persisting records.
