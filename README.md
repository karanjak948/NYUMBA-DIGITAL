# 🏡 Nyumba Digital

A full-stack rental management system connecting landlords and tenants with real-time property availability, booking, and payments.

---

## 🚀 Features

### 👤 Authentication
- User registration & login (JWT)
- Role-based access (Tenant / Landlord / Admin)

### 🏠 Property Management
- Landlords can list properties
- Upload images
- Set availability status

### 🔍 Property Search
- Browse available houses
- Filter by location, price, etc.

### 📅 Booking System
- Tenants can book properties
- Prevents double booking
- Booking approval by landlord

### 💬 Inquiry System
- Tenants can send messages to landlords

### 📊 Reporting & Computation
- Total income
- Occupancy rate
- Property statistics

### 💳 Payments
- M-Pesa integration (planned / partial)

---

## 🛠️ Tech Stack

### Backend
- Django
- Django REST Framework
- JWT Authentication
- MySQL

### Frontend
- React (Vite)
- Bootstrap CSS
- Axios
```Bash
cd nyumba-frontend
npm install
npm run dev
```

---

## ⚙️ Setup Instructions
### 🔹 Backend

```bash
cd nyumba_backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
