<div align="center">

# 🧭 CashCompass

**A full-stack, feature-rich financial management portal for students, employees, and administrators.**

[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)

</div>

---

## 📌 Overview

**CashCompass** is a robust, full-stack web application designed to streamline personal budgeting, allowance management, corporate expense claims, and administrative approvals. 

Built with a modular frontend architecture and a scalable Node/Express RESTful backend, the platform features role-based workflows, dynamic analytical dashboards, automated schema validation, and secure authentication methods.

---


## 🛠️ Tech Stack & Architecture

### **Frontend**
* **Core:** React 18, Vite, HTML5, CSS3, JavaScript (ES6+)
* **UI & Components:** Tailwind CSS, Shadcn UI, Lucide Icons
* **State Management:** Zustand
* **Form Handling & Validation:** React Hook Form, Zod Schema Validation
* **Data Visualization:** Chart.js (with React-Chartjs-2)
* **Media Management:** Cloudinary API (Receipt & Profile Asset Uploads)

### **Backend**
* **Environment & Server:** Node.js, Express.js
* **Routing & Architecture:** Express Router (RESTful API structure)
* **Database:** MongoDB (Managed locally via MongoDB Compass)
* **Authentication & Auth Security:** JWT (JSON Web Tokens), Session Storage, Google OAuth 2.0

---

## 📸 Interface Previews

###  Landing & Public Overview
<p align="center">
  <img src="./assets/home-overview1.png" alt="Home Overview - Hero Section" width="98%" />
</p>
<p align="center">
  <img src="./assets/home-overview2.png" alt="Home Overview - Features & Info" width="98%" />
</p>

---

###  Student Portal
  * **Health Score & Balances:** Live calculation of spending health scores and remaining allowance.
  * **Expense Categorization:** Instant breakdown across Education, Food, Transport, and Entertainment.
  * **Upcoming Payments:** Reminders for future expenses like tuition fees, dorm rent, and books.
<p align="center">
  <img src="./assets/std-dashboard.png" alt="Student Dashboard - Overview" width="32%" />
  <img src="./assets/std-dashboard2.png" alt="Student Dashboard - Analytics" width="32%" />
  <img src="./assets/std-dashboard3.png" alt="Student Dashboard - Claims View" width="32%" />
</p>

---

###  Employee Portal
  * **Expense Requests:** Submit, track, and review corporate expense claims and reimbursements.
  * **Transaction History:** Detailed logging of past expenditures and status checks
<p align="center">
  <img src="./assets/emp-dashboard.png" alt="Employee Dashboard - Expense Requests" width="48%" />
  <img src="./assets/emp-dashboard2.png" alt="Employee Dashboard - History" width="48%" />
</p>

---

###  Administration Management
  * **Centralized Dashboard:** High-level overview of system usage, balances, and system settings.
  * **Approval Workflows:** Manage and approve incoming student and employee requests.
<p align="center">
  <img src="./assets/admin-dashboard.png" alt="Admin Master Dashboard" width="98%" />
</p>