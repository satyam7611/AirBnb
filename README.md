# WanderLust - Inspired by the Airbnb

WanderLust is a full-stack, production-grade Airbnb clone that allows users to browse listings, explore details, write reviews, and host their own spaces. The application is built using a modern decoupled architecture, featuring a Next.js (App Router) frontend and an Express/Node.js REST API backend.

---

## 🏗️ Project Architecture

This project is structured as a monorepo containing two decoupled applications:

```text
AirBnb/
 ├── backend/            # Express.js REST API
 └── frontend/           # Next.js (App Router) Web Client
```

---

## 🚀 Key Features

*   **Listings Management**: Full CRUD operations for hosting properties (Create, Read, Update, Delete). Includes image uploads, location tags, and pricing.
*   **Dynamic Exploration**: Browsing properties with specific filtering tabs (Trending, Rooms, Iconic Cities, Castles, Farms, etc.) and real-time destination search.
*   **Interactive Review System**: Guests can leave star ratings and comments on properties, complete with static and interactive SVG star components.
*   **Authentication & Sessions**: Secure signup and login systems using Passport-Local-Mongoose and JSON Web Tokens (JWT) stored in HTTP-Only cookies.
*   **Vercel-Optimized Middleware**: Security is handled at the network edge using Next.js 16's standard `proxy.ts` middleware, protecting private routes (creating/editing listings, viewing profiles) while keeping listings public.
*   **Cross-Domain Cookie Syncing**: Features an automated JWT synchronization mechanism between Vercel (frontend) and Render (backend) domains to preserve session integrity across cross-origin page loads.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: Next.js 16 (Turbopack, App Router)
*   **Library**: React 19
*   **Styling**: Tailwind CSS & FontAwesome Icons
*   **API Client**: Axios (configured with cross-origin credentials)
*   **JWT Decoding**: `jose` (Web Crypto compatible for Edge runtimes)

### Backend
*   **Runtime**: Node.js & Express
*   **Database**: MongoDB (Atlas) & Mongoose ODM
*   **Authentication**: Passport.js & Passport-Local
*   **Session Management**: `express-session`, `cookie-parser`, and `connect-mongo` for persistent sessions.
*   **File Uploads**: Multer for handling multipart/form-data.

---

## 💻 Local Development Setup

### Prerequisites
*   Node.js (v20.9.0 or higher required by Next.js 16)
*   MongoDB Atlas database connection string

---

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` folder and populate it with the following:
    ```env
    ATLASDB_URL=your_mongodb_connection_string
    SECRET=your_express_session_secret
    JWT_SECRET=your_jwt_signing_secret
    NODE_DEV=development
    ```
4.  Start the backend development server:
    ```bash
    npm install -g nodemon
    nodemon app.js
    ```
    The server will start listening on [http://localhost:8081](http://localhost:8081).

---

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file in the `frontend` folder:
    ```env
    JWT_SECRET=your_jwt_signing_secret_matching_backend
    NEXT_PUBLIC_API_URL=http://localhost:8081
    ```
4.  Start the Next.js development server:
    ```bash
    npm run dev
    ```
    Open your browser to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🌐 Production Deployment Guide

### 1. Deploying the Backend to Render

1.  Connect your GitHub repository to Render and create a **Web Service**.
2.  Set the Root Directory to `backend`.
3.  Add your environment variables (`ATLASDB_URL`, `SECRET`, `JWT_SECRET`, etc.) in Render's Env Settings.
4.  Ensure backend CORS allows credentials and dynamically supports the deployed frontend origin (fully configured in `app.js`).

---

### 2. Deploying the Frontend to Vercel

1.  Import your repository into Vercel.
2.  Configure the **Project Settings**:
    *   **Root Directory**: `frontend`
    *   **Framework Preset**: `Next.js`
    *   **Build & Development Settings**: Keep Vercel defaults (Override toggles set to **OFF**).
3.  Add the **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: Your deployed Render backend URL (e.g., `https://airbnb-mi69.onrender.com`).
    *   `JWT_SECRET`: The exact same secret key used in the backend.
4.  Deploy. Vercel's Edge Router will automatically handle:
    *   Redirecting root requests (`/`) to `/listings` at the routing layer.
    *   Compiling [proxy.ts](file:///c:/Users/Satyam%20Singh/OneDrive/Documents/Desktop/React/AirBnb/frontend/src/proxy.ts) to protect auth-restricted routes on the edge.
