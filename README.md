# Courier & Parcel Management System (MERN)

A full-stack courier tracking and parcel management system built with **MERN** that supports **Customer**, **Delivery Agent**, and **Admin** roles.  
Customers can book parcels, admins assign agents, agents update delivery statuses, and customers can track parcels in real-time using **Google Maps** and **Socket.IO**.

##  Key Features

- **Customer**: 
    - Book parcels
    - Track parcel status
    - View parcel history

- **Delivery Agent**: 
    - Accept assigned parcels
    - Update parcel status
        - **Picked Up**
        - **In Transit**
        - **Delivered**
        - **Failed**
    - Share location updates (coordinates)
    - Optimized delivery route (Google Maps Directions)
    - View parcel history

- **Admin**: 
    - Dashboard analytics:
        - Daily bookings
        - Failed deliveries
        - COD totals
    - View all users & all bookings
    - Assign agents to parcels
    - Export reports:
        - **CSV** (XLSX supported)
        - **PDF** (jsPDF + AutoTable)
    - Swagger API documentation (Swagger UI)

-   Parcel Status Workflow
    - **Assigned**
    - **Picked Up**
    - **In Transit**
    - **Delivered**
    - **Failed**


##  Tech Stack
- **React 19** + **Vite**
- **TailwindCSS v4**
- **React Router DOM v7**
- **Axios**
- **Socket.IO Client**
- Google Maps:
  - `@react-google-maps/api`
- Export tools:
  - **jsPDF** + **AutoTable** (PDF)
  - **xlsx** (CSV/Excel export)
- Forms:
  - `react-hook-form`

### Backend
- **Node.js + Express 5**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **bcryptjs** password hashing
- **Socket.IO** real-time updates
- **Swagger UI** (`swagger-jsdoc`, `swagger-ui-express`)

### Security
Security is implemented using:
- JWT-based authentication
- Role-based access control middleware

### Rules:
- **Customer** can manage/view only their own bookings
- **Agent** can update only parcels assigned to them
- **Admin** has full system access (assignments, analytics, reports, users)

### Requirements
- Node.js (LTS recommended)
- MongoDB (local or Atlas)
- Google Maps API key (Maps + Places + Directions)

## 1) Clone the repo
```bash
$ git clone https://github.com/your-username/parcel-pro.git
$ cd parcel-pro
```

## 2) Install dependencies
```bash
$ npm install
```

## 3) Configure environment variables
```bash
$ cp .env.example .env
$ nano .env
```

## 4) Run the app
```bash
$ npm run dev
```

## 5) Open http://localhost:5173 in your browser

## Backend Setup

cd backend
npm install
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SUPER_SECRET_KEY

# Optional but recommended
CLIENT_URL=http://localhost:5173

# If you used Google Maps on backend side
GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_KEY

### Run backend:
- npm run dev

## Frontend Setup
### Install dependencies
- cd frontend
- npm install
Create frontend/.env
 -VITE_API_BASE_URL=http://localhost:5000
 -VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_KEY

### Run frontend:
- npm run dev

## API Modules Overview

### Auth

Register

Login

Role-based JWT token issuance

Parcel Management

Create parcel booking (customer)

View bookings (customer/admin)

Assign agent (admin)

Status update (agent)

Location tracking (agent → customer map)

Analytics & Reports (Admin)

Daily bookings

Failed delivery counts

COD totals

Export: CSV / PDF
