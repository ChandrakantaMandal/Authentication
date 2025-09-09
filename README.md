# 🔐 Authentication System - MERN Stack  

A secure and scalable authentication system built with **MongoDB, Express.js, React, and Node.js (MERN)**.  
This application provides **user registration, login, JWT authentication, and protected routes**, serving as a foundation for any full-stack web app.  

---

## 🚀 Features  

### 👤 User Authentication  
- **User Registration & Login** with JWT  
- **Password Hashing** using bcrypt  
- **Email Verification** workflow  
- **Password Reset** with secure tokens  
- **Persistent Sessions** with refresh tokens  

### 🔒 Security Features  
- **Protected Routes** with JWT middleware  
- **Token Expiry & Refresh Mechanism**  
- **CORS-enabled API** for secure frontend-backend communication  
- **Environment Variables** for sensitive configuration  

### 📱 UI/UX Features  
- **Modern UI** built with React & TailwindCSS  
- **Form Validation** with helpful error messages  
- **Responsive Design** (Desktop, Tablet, Mobile)  
- **Toast Notifications** for feedback  

---

## 🛠️ Tech Stack  

### Frontend  
- **React.js** - UI Framework  
- **TailwindCSS** - Styling framework  
- **React Router DOM** - Client-side routing  
- **Axios** - API requests  

### Backend  
- **Node.js** - Runtime environment  
- **Express.js** - Web framework  
- **MongoDB** - Database  
- **Mongoose** - ODM for MongoDB  
- **JWT** - Authentication  
- **bcrypt.js** - Password hashing  
- **dotenv** - Environment configuration  
- **CORS** - Cross-origin resource sharing  


## 🚦 Getting Started  

### Prerequisites  
- **Node.js** (v16 or higher)  
- **MongoDB** (local or cloud instance, e.g. MongoDB Atlas)  
- **npm** package manager  

### Installation  

1. **Clone the repository**  
   ```bash
   git clone https://github.com/ChandrakantaMandal/Authentication.git
   cd Authentication
   ```
2. **Install Backend Dependencies**  
   ```bash
    cd backend
    npm install

3. **Install Frontend Dependencies**  
   ```bash
    cd backend
    npm install
4.**Setup Environment Variables**
    -In the backend folder, .env.example as the .env file  

### 🏃 Running the Application
1.**Start the Backend Server**

 ```bash
cd backend
npm run dev
```

Runs on http://localhost:8080

1.*Start the Frontend Development Server**


 ```bash
cd frontend
npm run dev
```
Runs on http://localhost:5173

## 🔐 Authentication Flow

  1.User registers or logs in → receives a JWT token
  
  2.Token stored in localStorage (frontend)
  
  3.Requests to protected routes include the token in Authorization headers
  
  4.Server verifies token via middleware → grants access

  ## 🚀 Deployment  
  ### Backend Deployment (Heroku/Railway/Verce
- Set environment variables in deployment platform
- Connect MongoDB Atlas  
- Update CORS configuration
- 
  ### Frontend Deployment (Netlify/Vercel):
- Run npm run build in frontend
- Deploy dist folder to hosting service
- Update API URL in Axios config
  
 ## Contributing
- Fork the project
- Create a new branch (git checkout -b feature/myFeature)
- Update API URL in Axios config
- Commit your changes (git commit -m "Added new feature")
- Push to branch (git push origin feature/myFeature)
- Open a Pull Request
    
  ## 📝 License
- This project is licensed under the MIT License – see the LICENSE
 file for details.
  ## 👨‍💻 Author
  ### Chandrakanta Mandal
  - GitHub: @ChandrakantaMandal
 



  
  

