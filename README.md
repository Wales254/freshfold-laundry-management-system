# FreshFold Laundry Management System

A modern web-based laundry management system designed to streamline laundry operations, customer management, order processing, payments, inventory, receipts, and reporting from a centralized dashboard.

## Overview

FreshFold helps laundry businesses manage their daily operations through a centralized and easy-to-use management platform.

The system provides role-based access, order tracking, customer management, payment processing, inventory management, receipts, and business insights through a modern dashboard.

## Features

* 🔐 Secure authentication and role-based access
* 📊 Management dashboard with business insights
* 🧺 Laundry order management
* 👥 Customer management
* 💳 Payment recording and tracking
* 📦 Inventory management
* 💰 Service pricing management
* 🧾 Receipt generation
* 📈 Revenue and order analytics
* 👤 User management
* 🔔 Notifications and operational updates
* 📋 Recent orders and upcoming deliveries
* 📱 Responsive user interface

## User Roles

FreshFold supports role-based access to ensure users only access the functionality relevant to their responsibilities.

* **Admin** — Full system access and user management
* **Manager** — Operational and reporting access
* **Cashier** — Payments, receipts, and customer transactions
* **Attendant** — Order and laundry processing operations

## Technology Stack

### Frontend

* React
* Vite
* JavaScript
* Material UI (MUI)
* React Router
* Redux
* Redux Toolkit

### Supporting Technologies

* HTML5
* CSS3
* Git
* GitHub
* Vercel

## Main Modules

### Dashboard

Provides an overview of:

* Total orders
* Revenue
* Order status
* Services
* Notifications
* Top customers
* Upcoming deliveries
* Recent orders

### Orders

Manage laundry orders throughout the processing workflow:

**Received → Washing → Drying → Ironing → Ready → Delivered**

### Customers

Manage customer records and monitor their laundry activity.

### Payments

Record and manage customer payments, payment history, balances, and transaction information.

### Inventory

Track laundry supplies and inventory levels.

### Pricing

Manage available laundry services and their pricing.

### Receipts

Generate customer receipts with FreshFold transaction details.

### User Management

Administrators can manage system users and their assigned roles.

## Installation

Clone the repository:

```bash
git clone https://github.com/Wales254/freshfold-laundry-management-system.git
```

Navigate into the project:

```bash
cd freshfold-laundry-management-system
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

## Production Build

To create a production build:

```bash
npm run build
```

The production files are generated in the:

```text
dist/
```

directory.

## Project Structure

```text
freshfold-laundry-management-system/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── orders/
│   │   ├── payment/
│   │   ├── receipt/
│   │   └── users/
│   │
│   ├── pages/
│   ├── redux/
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Deployment

The application is designed to be deployed as a Vite/React application.

Recommended production configuration:

```text
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

## Project Status

🚧 **Active Development**

The system is continuously being improved with additional features, UI enhancements, security improvements, and performance optimizations.

## Future Improvements

Planned improvements include:

* Backend API integration
* Database integration
* Online customer portal
* SMS/email notifications
* Advanced reporting
* Automated inventory alerts
* Online payment integration
* Multi-branch laundry management
* Enhanced security and audit logging

LIVE AT: https://freshfold-laundry-management-system.vercel.app/

## Developer

**Sydeny Wesonga**

Full Stack Developer focused on building scalable web applications, APIs, and modern digital solutions.

### Technologies

React • Node.js • PHP • Python • JavaScript • Databases • REST APIs

## License

This project is developed for educational and demonstration purposes.
