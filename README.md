# 🏥 MediSync - Clinical Management System

MediSync is a high-fidelity, enterprise-grade clinical management platform designed to streamline interactions between doctors and patients. Built with a modern tech stack and a premium glassmorphic aesthetic, it provides real-time appointment management, automated transactional notifications, and comprehensive health tracking.

---

## 🚀 Overview: From A to Z

### 1. The Patient Portal
Patients can register, manage their medical profiles, and schedule appointments with doctors. The interface features:
- **Health Activity Tracking**: Visualized history of medical events.
- **Appointment Management**: Real-time scheduling with automatic status updates.
- **Glassmorphic Design**: A modern, clean, and responsive UI.

### 2. The Doctor Dashboard
Doctors have a powerful "Clinical Command Center" to manage their practice:
- **Patient Management**: Full view of patient history and records.
- **Smart Scheduling**: Manage availability and respond to appointment requests.
- **Analytics**: Data-driven insights into patient volume and activity trends.

### 3. Automated Communication (Brevo API)
MediSync handles all transactional communications automatically:
- **Welcome Emails**: Sent upon successful registration.
- **Appointment Notifications**: Real-time alerts for confirmations or reschedules.
- **Branding**: All emails are professionally branded with the official MediSync logo.

### 4. Advanced Administration
The system includes a customized Django Admin (Jazzmin) that serves as a backend management hub for system administrators.

---

## 🛠️ Technical Stack

- **Backend**: Python / Django / Django Rest Framework
- **Frontend**: React / Vite / Tailwind CSS
- **Database**: SQLite (Development) / PostgreSQL (Production ready)
- **Email Service**: Brevo (Sendinblue) Transactional API
- **Design**: Vanilla CSS with Glassmorphism & Modern UI patterns

---

## 🏁 How to Launch the Program

Follow these steps to get the full MediSync stack running on your local machine.

### Prerequisites
- **Python 3.10+** installed.
- **Node.js 18+** installed.

### Step 1: Backend Setup (Django)
1. Navigate to the backend directory:
   ```powershell
   cd "MediSync/backend"
   ```
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
3. Run migrations to initialize the database:
   ```powershell
   python manage.py migrate
   ```
4. **Launch the Backend Server**:
   ```powershell
   python manage.py runserver 8001
   ```
   *The backend will be available at: http://localhost:8001*

### Step 2: Frontend Setup (React)
1. Open a **new terminal** and navigate to the frontend directory:
   ```powershell
   cd "MediSync/frontend"
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. **Launch the Frontend Server**:
   ```powershell
   npm run dev -- --port 3000
   ```
   *The frontend will be available at: http://localhost:3000*

### Step 3: Accessing the Admin Panel
To manage the system from the backend:
1. Go to: **http://localhost:8001/admin/**
2. **Username**: `admin`
3. **Password**: `admin123`

---

## ⚙️ Environment Configuration
Create a `.env` file in `MediSync/backend/` with the following variables:
```env
BREVO_API_KEY=your_api_key_here
DEFAULT_FROM_EMAIL=MediSync <medisyncpy@gmail.com>
DEBUG=True
```

---

## 🛡️ Security & Privacy
MediSync is built with security best practices:
- **Token Authentication**: Secure communication between Frontend and Backend.
- **Data Sanitization**: Protected inputs and validated data structures.
- **Git Protection**: Sensitive information (API keys, .env) is automatically ignored via `.gitignore`.

---

**Developed for Excellence in Healthcare.**
*MediSync Clinical Systems © 2026*
