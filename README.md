# 🏡 Airbnb Clone

A full-stack, production-ready clone of Airbnb featuring property listings, reviews, user authentication, and image uploads. The application is built with a modern Next.js frontend and a robust Node.js/Express backend.

## 🚀 Features

- **User Authentication:** Secure signup and login using Passport.js (Local Strategy & Session-based authentication).
- **Property Listings:** Users can view, create, edit, and delete accommodation listings.
- **Reviews & Ratings:** Authenticated users can leave reviews and ratings on properties.
- **Image Uploads:** Cloud storage integration via Cloudinary for seamless property image uploads.
- **Modern UI:** Built with Next.js (App Router) and styled beautifully with Tailwind CSS.
- **Form Validation:** Server-side validation using Joi to ensure data integrity.
- **Database:** MongoDB integration using Mongoose models.

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4
- **API Requests:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose)
- **Authentication:** Passport.js (`passport-local`, `passport-local-mongoose`)
- **Validation:** Joi
- **File Uploads:** Multer & Cloudinary (`multer-storage-cloudinary`)

## 📂 Project Structure

```bash
AirBnb/
├── backend/                  # Express.js REST API
│   ├── controllers/          # Route logic
│   ├── models/               # Mongoose schemas (Listing, Review, User)
│   ├── routes/               # API endpoints
│   ├── init/                 # Database initialization scripts
│   ├── utils/                # Error handling and utilities
│   ├── cloudConfig.js        # Cloudinary configuration
│   └── app.js                # Entry point
│
└── frontend/                 # Next.js Application
    ├── src/
    │   ├── app/              # Next.js App Router pages (login, signup, listings)
    │   ├── components/       # Reusable UI components
    │   └── lib/              # API configurations (Axios)
    ├── package.json          # Frontend dependencies
    └── next.config.mjs       # Next.js config
```

## ⚙️ Getting Started

Follow these steps to run the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local installation or Atlas URI)
- [Cloudinary Account](https://cloudinary.com/)

### 1. Clone the repository
```bash
git clone <repository_url>
cd AirBnb
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder and configure the following variables:
```env
ATLASDB_URL=<your_mongodb_connection_string>
SECRET=<your_session_secret_key>
CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUD_API_KEY=<your_cloudinary_api_key>
CLOUD_API_SECRET=<your_cloudinary_api_secret>
NODE_DEV=development
```

Start the backend server:
```bash
npm run dev
# The backend will typically run on http://localhost:8080
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the Next.js development server:
```bash
npm run dev
# The frontend will run on http://localhost:3000
```

## 📝 API Integration & Data Models

- **Listings:** Stores property details, price, location, image URL (from Cloudinary), and the owner.
- **Reviews:** Users can give ratings (1-5 stars) and comments on listings.
- **Users:** Managed with passport-local-mongoose for secure password hashing and salting.

## 👨‍💻 Author

**Satyam Singh**
- This project highlights modern web development practices, focusing heavily on separating the frontend from the backend (MERN stack evolution) and utilizing best-in-class tools for styling and routing.
