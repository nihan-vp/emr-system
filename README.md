# 🏥 Suhaim Soft EMR Management System

A full-stack Electronic Medical Records (EMR) system built using Expo (React Native) and MongoDB. This application allows clinics to manage patients, appointments, medicines, and procedures efficiently.

---

## 🚀 Features

* 📋 Patient Management
* 📅 Appointment Scheduling
* 💊 Medicine Tracking
* 🧾 Procedure Templates
* 🔄 Real-time Data Sync with MongoDB
* 📱 Mobile App using Expo

---

## 🛠️ Tech Stack

* Frontend: Expo (React Native)
* Backend: Node.js + Express
* Database: MongoDB
* API: RESTful services

---

## 📂 Project Structure

```
emr-system/
│
├── app/
│   ├── pages/              # Main screens
│   ├── components/         # Reusable UI components
│   ├── navbars/            # Navigation UI
│   └── loaders/            # Loading screens
│
├── server/                 # Backend API
├── assets/                 # Images and static files
├── .env                    # Environment variables
└── package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd emr-system
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Setup environment variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/clinicppm
PORT=4000
EXPO_PUBLIC_API_BASE_URL=http://192.168.X.X:4000/api
```

> ⚠️ Replace `192.168.X.X` with your computer's local IP address

---

### 4️⃣ Start MongoDB

Make sure MongoDB is running locally:

```bash
mongod
```

---

### 5️⃣ Start backend server

```bash
npm run server
```

Expected output:

```
Server running on port 4000
MongoDB connected
```

---

### 6️⃣ Start Expo app

```bash
npx expo start --tunnel -c
```

---

### 7️⃣ Run on mobile

* Install Expo Go app
* Scan the QR code
* App will open on your device

---

## 🧪 API Endpoints

* `GET /api/health` → Check API status
* `GET /api/state` → Get all clinic data
* `PUT /api/state/:collection` → Update collection
* `POST /api/state/reset` → Reset demo data

---

## ❗ Common Issues & Fixes

### 🔴 App shows "Something went wrong"

✔ Fix:

* Run backend server
* Use correct IP instead of `localhost`
* Clear cache:

```bash
npx expo start -c
```

---

### 🔴 Network Error

✔ Fix:

* Ensure phone & PC are on same network
* Use:

```bash
npx expo start --tunnel
```

---

### 🔴 MongoDB Connection Error

✔ Fix:

* Start MongoDB
* Check `MONGODB_URI`

---

## 📌 Development Notes

* Use `app/pages` for screens
* Use `app/components` for reusable UI
* Keep code modular and clean

---

## 📄 License

This project is for educational and development purposes.

---

## 👨‍💻 Author

Developed by Suhaim Soft

---

## ⭐ Support

If you find this project helpful, consider giving it a star ⭐
