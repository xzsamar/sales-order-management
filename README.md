# Sales Order Management System

A full-stack MERN application designed for pharmaceutical distributors to manage customers, products, inventory, and sales orders efficiently.

## Live Demo

https://sales-order-management-rho.vercel.app/

## GitHub Repository

https://github.com/xzsamar/sales-order-management/

---

## Overview

The Sales Order Management System streamlines the order management process for pharmaceutical businesses by providing customer management, inventory tracking, order processing, PDF generation, email notifications, and credit control mechanisms.

---

## Features

### Dashboard

* Business overview dashboard
* Total customers, products, orders, and revenue statistics
* Low stock alerts
* Recent orders tracking

### Customer Management

* Customer registration and management
* Credit limit tracking
* Outstanding amount tracking
* Purchase history

### Product Management

* Product catalog management
* Stock quantity tracking
* Product search functionality
* Product alternatives suggestions
* Product variations support

### Sales Order Management

* Create sales orders
* Order validation
* Stock validation
* Credit limit validation
* Delivery scheduling
* Order remarks

### Product Intelligence

* Alternative product recommendations
* Product comparison
* Product variations lookup

### Inventory Control

* Real-time stock management
* Automatic stock deduction after order creation
* Stock restoration on order deletion
* Low stock monitoring

### PDF Generation

* Professional sales order PDF
* Customer information
* Order summary
* Product details table
* Financial breakdown
* Signature section
* QR code support

### Email Notifications

* Automatic email notifications
* PDF attachment support
* Background email processing

---

## Technology Stack

### Frontend

* React.js
* React Router
* Axios
* React Icons

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Additional Libraries

* PDFKit
* Nodemailer / Resend
* dotenv
* CORS

---

## Business Rules Implemented

### Credit Limit Validation

Orders cannot be created when:

Outstanding Amount + Order Amount > Customer Credit Limit

### Stock Validation

Orders cannot be created when:

Requested Quantity > Available Quantity

### Product Alternatives

When stock is unavailable:

* Same generic products are suggested
* Similar category products are suggested

### Product Variations

Variations are identified as:

* Same medicine
* Different strengths

Example:

* Paracetamol 500mg
* Paracetamol 650mg
* Paracetamol 1000mg

---

## Installation

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Environment Variables

Create a `.env` file inside backend:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000

EMAIL_USER=your_email
EMAIL_PASS=your_password
OWNER_EMAIL=recipient_email

RESEND_API_KEY=your_resend_api_key
```

### Run Backend

```bash
npm run dev
```

### Run Frontend

```bash
npm start
```

---

## Project Structure

```text
backend/
├── controllers/
├── models/
├── routes/
├── services/
├── utils/
├── seed/
└── server.js

frontend/
├── components/
├── pages/
├── services/
├── layouts/
└── App.jsx
```

---

## Future Enhancements

* Payment Management
* Invoice Management
* Customer Portal
* Sales Analytics Charts
* Multi-user Authentication
* Role-Based Access Control
* Mobile Application

---

## Author

Samar Ahmed

Computer Engineering Graduate

Portfolio:

https://samar-portfolio-two.vercel.app/

GitHub:
https://github.com/xzsamar
