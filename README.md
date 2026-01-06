# Taka Bora - Waste Management Platform 🌍♻️

A comprehensive waste management platform connecting waste producers with collectors to facilitate recycling and promote environmental sustainability in Kenya.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Project Description

**Taka Bora** (meaning "Good Waste" in Swahili) is a full-stack MERN application that bridges the gap between individuals/businesses with recyclable waste and collectors who process these materials. The platform addresses the real-world problem of inefficient waste management in urban areas by providing a marketplace for recyclable materials, featuring real-time messaging, waste listing management, interactive maps, and gamification through a points-based system.

### Problem Statement

Many households and businesses struggle to connect with waste collectors, leading to recyclable materials ending up in landfills. Taka Bora solves this by creating a seamless connection between waste producers and collectors, promoting sustainability while creating economic opportunities.

## ✨ Key Features

### For Waste Producers
- **📝 Easy Waste Listing**: Create detailed listings with 6 waste categories (Organic, Plastic, Paper, Glass, E-Waste, Textiles)
- **💰 Flexible Pricing**: Set fixed prices or mark as negotiable
- **📍 Location Tracking**: Specify city and area for accurate pickup coordination
- **✏️ Listing Management**: Edit or delete your listings anytime
- **💬 Direct Communication**: Chat with collectors about specific transactions
- **📊 Dashboard Analytics**: Track total, available, pending, and completed listings

### For Waste Collectors (Consumers)
- **🗺️ Interactive Map View**: Browse available waste listings on Google Maps
- **🔍 Advanced Filtering**: Search by category, price, and keywords
- **📦 Claim Listings**: Start transactions with producers
- **💬 Transaction Chat**: Coordinate pickup times and pricing
- **📈 Activity Tracking**: Monitor claimed, pending, and completed pickups

### Universal Features
- **🔐 Secure Authentication**: Powered by Clerk for seamless sign-up/login
- **💬 Real-time Messaging**: Transaction-based chat system with quick actions
- **🦜 Hummingbird Helper**: Interactive FAQ assistant with detailed answers
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **🎨 Modern UI/UX**: Clean interface with smooth animations and gradients

## 🎥 Video Demonstration

[🎬 Watch the 7-Minute Demo Video](https://your-video-link-here.com)

*The video covers:*
- Platform overview and user roles
- Creating and managing waste listings
- Browsing and claiming listings
- Real-time chat system
- Dashboard features and analytics

## 📸 Screenshots

### Producer Dashboard
![Producer Dashboard](https://via.placeholder.com/800x400?text=Producer+Dashboard+Screenshot)
*Waste producers can create listings, track status, and communicate with collectors*

### Consumer Dashboard - Map View
![Consumer Dashboard](https://via.placeholder.com/800x400?text=Consumer+Dashboard+Screenshot)
*Interactive map showing all available waste listings in the area*

### Real-time Chat System
![Chat System](https://via.placeholder.com/800x400?text=Chat+System+Screenshot)
*Transaction-based messaging with quick action buttons*

### Listing Creation Modal
![Listing Modal](https://via.placeholder.com/800x400?text=Listing+Modal+Screenshot)
*Intuitive form for creating waste listings with categories and pricing*

## 🌐 Live Deployment

- **Frontend**: [https://taka-bora-frontend.vercel.app](https://your-frontend-url.vercel.app)
- **Backend API**: [https://taka-bora-api.vercel.app](https://your-backend-url.vercel.app)
- **Status**: ✅ Live and Operational

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.2
- **Routing**: React Router DOM 7.9.5
- **Authentication**: Clerk (@clerk/clerk-react)
- **HTTP Client**: Axios
- **Icons**: Font Awesome 7.1.0
- **Maps**: Google Maps Embed API
- **Styling**: Custom CSS with animations

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.1.0
- **Database**: MongoDB with Mongoose 8.19.3
- **Authentication**: Clerk (user ID passing)
- **CORS**: Enabled for cross-origin requests
- **Environment**: dotenv for configuration

## 📦 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- Clerk account for authentication
- Google Maps API key (optional, for maps)

### Backend Setup

1. **Navigate to server directory**:
```bash
cd "waste to wonder/server"
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
   Create a `.env` file in the `server` directory:
```env
MONGODB_URI=mongodb+srv://your-connection-string
PORT=5000
CLERK_SECRET_KEY=your-clerk-secret-key
```

4. **Start the server**:
```bash
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**:
```bash
cd "waste to wonder/client"
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
   Create a `.env` file in the `client` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
VITE_API_URL=http://localhost:5000/api
```

4. **Start the development server**:
```bash
npm run dev
```

Client will run on `http://localhost:5173`

### Running the Complete Application

1. Open two terminal windows
2. In the first terminal, start the backend server from the `server` directory
3. In the second terminal, start the frontend from the `client` directory
4. Access the application at `http://localhost:5173`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All requests include `x-user-id` header from Clerk session.

### Endpoints

#### Listings
- `GET /listings/all` - Get all available listings (public)
- `GET /listings` - Get user's listings
- `GET /listings/:id` - Get single listing
- `POST /listings` - Create new listing
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing

#### Transactions
- `GET /transactions` - Get user's transactions
- `POST /transactions` - Create transaction (claim listing)
- `GET /transactions/:id/messages` - Get conversation messages
- `POST /transactions/:id/messages` - Send message
- `PATCH /transactions/:id/status` - Update transaction status

#### Users
- `POST /api/signup` - Register new user
- `POST /api/login` - User login

## 🏗️ Technical Architecture

### Monorepo Structure
```
waste to wonder/
├── client/              # React + Vite frontend
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/  # Reusable React components
│       ├── lib/         # Utility functions
│       ├── pages/       # Route pages
│       ├── services/    # API integration
│       └── styles/      # Component-specific CSS
├── server/              # Express + MongoDB backend
│   ├── config/          # Database configuration
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   └── uploads/         # File storage
└── README.md
```

### Database Design

#### Collections
1. **Users**: Authentication and profile information
2. **Listings**: Waste material listings with categorization
3. **Transactions**: Connections between producers and consumers
4. **Messages**: Real-time chat messages for coordination

### Key Design Decisions

- **Clerk Authentication**: Chosen for secure, production-ready auth without managing tokens
- **Monorepo Structure**: Keeps frontend and backend together for easier development
- **Transaction-Based Chat**: Messages linked to specific transactions for context
- **Category System**: Pre-defined waste categories for standardization
- **Status Tracking**: Multiple status levels for listing and transaction lifecycle

## 🧪 Testing

### Backend Tests
- API endpoint testing with Jest/Mocha
- Database model validation
- Error handling verification

### Frontend Tests
- Component unit tests with React Testing Library
- Integration tests for user flows
- Form validation testing

### Running Tests
```bash
# Backend tests
cd "waste to wonder/server"
npm test

# Frontend tests
cd "waste to wonder/client"
npm test
```

## 🚀 Deployment Guide

### Vercel Deployment (Recommended)

#### Frontend Deployment
1. Create a new project on Vercel
2. Connect your GitHub repository
3. **Select `waste to wonder/client` as the root directory**
4. Framework Preset: Vite
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add environment variables:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_API_URL` (your backend URL)

#### Backend Deployment
1. Create a separate Vercel project
2. Select `waste to wonder/server` as the root directory
3. Add environment variables:
   - `MONGODB_URI`
   - `CLERK_SECRET_KEY`
   - `PORT`

## 🔐 Security Features

- **Authentication**: Clerk handles all user authentication
- **Authorization**: User ID verification on all protected routes
- **Data Validation**: Backend validates all inputs
- **CORS**: Configured to allow frontend origin only
- **Environment Variables**: Sensitive data stored in .env files

## 🚧 Future Enhancements

- Mobile app (React Native)
- Payment integration (M-Pesa)
- Rating and review system
- Push notifications
- Analytics dashboard
- Route optimization for collectors
- Carbon footprint calculator
- Leaderboard system with gamification

## 👥 Contributors

- **Bochaberii** - [GitHub Profile](https://github.com/Bochaberii)

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Power Learn Project for the comprehensive MERN stack training
- Clerk for authentication services
- MongoDB Atlas for database hosting
- Vercel for hosting services
- The open-source community

## 📞 Support

For support or questions, please open an issue in the GitHub repository.

---

**Built with ♻️ for a greener future | MERN Stack Capstone Project** 