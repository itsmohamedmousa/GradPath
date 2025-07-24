# GradPath

A Smart Academic Planner for University Students

## 🚀 Features

- GPA and course tracking
- Grade visualization with charts
- Study calendar and reminders
- Note-taking for each course

---

## 📋 Requirements

- **Git** – for cloning the repository
- **PHP >= 8.0** – backend runtime
- **Composer** – PHP package manager
- **Node.js >= 18** – required for React
- **MySQL Server** – for database management

---

## 🛠️ Installation

```bash
# 1. Clone the repository
git clone https://github.com/itsmohamedmousa/GradPath.git

# 2. Navigate into the project directory
cd GradPath
```

## 📂 Backend Setup (PHP + MySQL)

```bash
# 3. Install PHP dependencies
composer install

# 4. Create the database in your mysql server
sudo mysql -u root
```

Then run this inside the MySQL shell:

```bash
CREATE DATABASE GradPath;
EXIT;
```

```bash
# 5. Import the sql dump file
sudo mysql -u root GradPath < GradPath.sql
```

## 🔐 Create Environment File

Create a .env file in the root directory (GradPath/.env) and add the following:

```bash
DB_HOST=127.0.0.1
DB_NAME=GradPath
# Use your database's username and password
DB_USER=root
DB_PASSWORD=

JWT_SECRET=YourSecretKey
# Edit to change login session's expiry date
JWT_EXPIRES_IN=3600

# Server Configuration
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:8000/src/backend/api
```

## 💻 Frontend Setup (React)

```bash
# 6. Install frontend dependencies
npm install

# 7. Start the REACT development server
npm run dev
```

## 🔙 Run the Backend Server

In a separate terminal:

```bash
php -S localhost:8000
```
