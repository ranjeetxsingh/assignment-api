
# 🚆 **Railway Management System API**

---

## 📜 **Project Overview**

This project is a backend service for a **Railway Management System**, inspired by platforms like IRCTC. The system allows users to:

- Check train availability between two stations  
- Book seats on a train  
- Login with distinct roles (**Admin** and **User**)  
- Allow admins to manage trains (add/update train information)

This backend is built using **Node.js/Express**, **PostgreSQL**, and **JWT authentication**.

---

## 🔹 **Table of Contents**
- [Project Setup](#project-setup)
- [Technologies Used](#technologies-used)
- [Environment Configuration](#environment-configuration)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Acknowledgements](#acknowledgements)

---

## 🔹 **Project Setup**

### Prerequisites
- Node.js installed: [Download](https://nodejs.org/)
- PostgreSQL installed: [Documentation](https://www.postgresql.org/download/)
- Git installed: [Install Guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

---

### 📥 Clone the Repository

```bash
git clone https://github.com/your-username/railway-management.git
```

---

### 📝 Install Dependencies

Navigate to the project folder and run:

```bash
npm install
```

---

### 🔧 Setup Environment Variables

Create a `.env` file in the root of your project and populate it with the following environment variables:

```env
PORT=5000
DB_USER=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASSWORD
DB_HOST=localhost
DB_NAME=railway_management
DB_PORT=5432
JWT_SECRET=YOUR_SECRET
ADMIN_API_KEY=YOUR_ADMIN_API_KEY
```

---

### 🚀 Run the Server

Start the development server:

```bash
npm run dev
```

By default, the server will run on `http://localhost:5000`.

---

## 🔹 **Technologies Used**

- **Node.js** and **Express** (Backend)
- **PostgreSQL** (Database)
- **JWT (JSON Web Tokens)** for Authentication
- **Bcrypt** for Password Hashing
- **dotenv** for Environment Management

---

## 🔹 **API Endpoints**

### **Authentication**

1. **Register a New User**

- **Endpoint**: `POST /api/auth/register`  
- **Request Body**:

```json
{
    "username": "exampleUser",
    "password": "password123",
    "role": "user"  // Roles: 'admin' or 'user'
}
```

- **Response**:

```json
{
    "message": "User registered",
    "user": { ... }
}
```

---

2. **Login**

- **Endpoint**: `POST /api/auth/login`  
- **Request Body**:

```json
{
    "username": "exampleUser",
    "password": "password123"
}
```

- **Response**:

```json
{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

---

### **Admin Operations**

3. **Add a New Train**  

- **Endpoint**: `POST /api/admin/addTrain`  
- **Request Body**:

```json
{
    "train_name": "Express 123",
    "source": "Station A",
    "destination": "Station B",
    "total_seats": 200
}
```
- **Headers**:
```
    admin-api-key: YOUR_ADMIN_API_KEY
```

- **Response**:

```json
{
    "message": "Train added",
    "train": { ... }
}
```

4. **Update Train Seats**  

- **Endpoint**: `PUT /api/admin/updateTrain/:train_id`  
- **Request Body**:

```json
{
    "total_seats": 300
}

```

- **Headers**:
```
    admin-api-key: YOUR_ADMIN_API_KEY
```

- **Response**:

```json
{
    "message": "Train seats updated"
}
```

---

### **User Operations**

5. **Get Train Availability**

- **Endpoint**: `GET /api/user/trains`  
- **Query Parameters**:

```
?source=StationA&destination=StationB
```

- **Response**:

```json
[
    {
        "train_name": "Express 123",
        "available_seats": 150,
        "source": "Station A",
        "destination": "Station B"
    }
]
```

6. **Book a Seat**

- **Endpoint**: `POST /api/user/book`  
- **Request Body**:

```json
{
    "train_id": 123
}
```

- **Response**:

```json
{
    "message": "Seat booked",
    "booking": { ... }
}
```

7. **Get Booking Details**

- **Endpoint**: `GET /api/user/bookings/:id`  
- **Response**:

```json
{
    "bookings": [
        {
            "train_id": 123,
            "train_name": "Express 123",
            "source": "Station A",
            "destination": "Station B"
        }
    ]
}
```

---

## 🔹 **Database Schema**

### 📊 **Tables**

1. **Users**

| Column     | Type     |
|-------------|----------|
| id          | SERIAL   |
| username   | TEXT     |
| password   | TEXT     |
| role        | TEXT     |

2. **Trains**

| Column         | Type     |
|----------------|----------|
| id             | SERIAL   |
| train_name     | TEXT     |
| source        | TEXT     |
| destination   | TEXT     |
| total_seats   | INTEGER  |
| available_seats | INTEGER |

3. **Bookings**

| Column       | Type     |
|--------------|----------|
| id           | SERIAL   |
| user_id      | INTEGER  |
| train_id     | INTEGER  |
| booking_date | TIMESTAMP |

---

## 🔹 **Testing**

### **Manual Testing**

- Use **Postman** or **cURL** to test each API endpoint.
- Send sample requests for login, booking a train, and adding a train.

---


## 🙏 **Acknowledgements**

- PostgreSQL documentation
- Node.js and Express Official Documentation
- [Postman](https://www.getpostman.com) for API Testing
- [StackOverFlow](stackoverflow.com)

