# Employee Management System

A full-stack Employee Management System built using React.js, Node.js, Express.js, and PostgreSQL.

This application helps manage employee records efficiently with a structured database and a user-friendly interface.

## Features

- View Employee Records
- Add New Employees
- Edit Employee Details
- Delete Employee Records
- PostgreSQL Database Integration
- RESTful API Architecture
- Frontend and Backend Separation

## Tech Stack

### Frontend
- React.js
- JavaScript
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- PostgreSQL
- pg (Node.js PostgreSQL Client)

## Project Structure

```text
employee-management-system/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone Repository

```bash
git clone YOUR_REPOSITORY_URL
cd employee-management-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder.

Configure your environment variables:

```env
PORT=3000
DATABASE_URL=your_postgresql_connection_string
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_BASE_URL=your_backend_api_url
```

Start the frontend:

```bash
npm run dev
```

## Database

This project uses PostgreSQL as its relational database.

The application connects to PostgreSQL using the Node.js `pg` package.

## Environment Variables

Configure all required environment variables before running the application.

Never upload database credentials or other sensitive information to GitHub.

## Author

**Pardeep Sharma**

Full Stack Developer