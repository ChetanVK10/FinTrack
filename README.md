# 💰 FinTrack – Finance Dashboard UI

## 📌 Overview

FinTrack is a modern financial dashboard that helps users track, analyze, and understand their financial activity through a clean and interactive interface.

The application focuses on intuitive UI design, modular component structure, and efficient state management, simulating a real-world fintech dashboard experience.

---

## 🎯 Objective

The goal of this project is to build a user-friendly dashboard where users can:

* View financial summaries
* Explore and manage transactions
* Understand spending patterns through visual insights
* Experience role-based UI behavior

---

## ✨ Features

### 📊 Dashboard Overview

* Summary cards:

  * Total Balance
  * Total Income
  * Total Expenses
* Balance trend visualization (time-based)
* Spending breakdown (category-based)

---

### 💳 Transactions Management

* Displays transactions with:

  * Date
  * Description
  * Category
  * Type (Income / Expense)
  * Amount

* Functionalities:

  * 🔍 Search transactions
  * 📂 Filter by type and category
  * 🔽 Sort by amount

---

### 🔐 Role-Based UI (Frontend Simulation)

* Role switcher: **Viewer / Admin**

**Viewer:**

* Read-only access
* Can view dashboard and transactions

**Admin:**

* Can add new transactions
* Can edit and delete transactions

---

### 📈 Insights Section

* Displays useful financial observations:

  * Highest spending category
  * Income vs Expenses comparison
  * Spending patterns

---

### ⚙️ Additional Enhancements

* 🌙 Dark mode support
* 💾 LocalStorage persistence
* 📱 Responsive design
* ✨ Smooth UI interactions and animations
* 📭 Graceful handling of empty states

---

## 🧠 State Management

State is managed using React Context API, including:

* Transactions data
* Filters and search
* Selected role (Viewer/Admin)
* UI state (theme, etc.)

---

## 🏗️ Tech Stack

* React (Vite)
* TypeScript
* Tailwind CSS
* Recharts
* Framer Motion
* React Context API
* LocalStorage

---

## 📁 Project Structure

```bash
src/
│── assets/
│
│── components/
│   ├── Charts.tsx
│   ├── Insights.tsx
│   ├── Layout.tsx
│   ├── MetricCard.tsx
│   ├── TimeRangeSelector.tsx
│   ├── TransactionList.tsx
│
│── context/
│   └── AppContext.tsx
│
│── pages/
│   ├── Dashboard.tsx
│   ├── InsightsPage.tsx
│   ├── Transactions.tsx
│
│── types/
│
│── App.tsx
│── main.tsx
│── index.css
│── App.css

---

## 🚀 Getting Started

### 1. Clone the repository

git clone https://github.com/your-username/fintrack.git

### 2. Navigate to project folder

cd fintrack

### 3. Install dependencies

npm install

### 4. Run the development server

npm run dev

---

## 🧪 Assumptions

* Uses mock/static data for transactions
* Role-based access is simulated on frontend only
* No backend or authentication

---

## 🎯 Key Highlights

* Clean and modern UI design
* Clear data visualization
* Role-based UI behavior
* Modular component architecture
* Focus on usability and responsiveness

---

## 🙌 Conclusion

This project demonstrates the ability to design and build a structured, responsive, and user-friendly financial dashboard with practical features and a clean user experience.

---
