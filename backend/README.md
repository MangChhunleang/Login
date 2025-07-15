# Backend API Documentation

## Overview
This is the backend API for the Login application with Google OAuth integration, JWT authentication, and MySQL database.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation
```bash
cd backend
npm install
```

### Environment Setup
Create a `.env` file in the backend directory:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=login_app

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_make_it_long_and_random_12345

# Session Configuration
SESSION_SECRET=your_session_secret_key_here_12345

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Server Configuration
PORT=5000
```

### Database Setup
1. Start MySQL server
2. Run the setup script:
```bash
mysql -u root -p < setup.sql
```

### Start the Server
```bash
npm start
# or for development
npm run dev
```

The server will run on `http://localhost:5000`

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔐 Authentication Flow

### Regular Login Flow
1. User submits email/password
2. Backend validates credentials
3. JWT token generated and returned
4. Frontend stores token in localStorage

### Google OAuth Flow
1. User clicks "Continue with Google"
2. Redirected to Google OAuth consent screen
3. Google redirects back with authorization code
4. Backend exchanges code for user info
5. User created/updated in database
6. JWT token generated and redirects to frontend

## 📡 API Endpoints

### Public Routes (No Authentication Required)

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "User created successfully"
}
```

#### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET `/api/auth/google`
Initiate Google OAuth login.
- Redirects to Google OAuth consent screen

#### GET `/api/auth/google/callback`
Google OAuth callback endpoint.
- Processes Google OAuth response
- Creates/updates user in database
- Generates JWT token
- Redirects to frontend with token

### Protected Routes (Authentication Required)

#### GET `/api/auth/profile`
Get user profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "google_id": "123456789",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

#### PUT `/api/auth/profile`
Update user profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "username": "new_username",
  "email": "newemail@example.com"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully"
}
```

#### DELETE `/api/auth/logout`
Logout user (clears token on frontend).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## 🔧 Project Structure

```
backend/
├── app.js                 # Main server file
├── package.json           # Dependencies and scripts
├── setup.sql             # Database setup script
├── .env                  # Environment variables (create this)
├── config/
│   ├── db.js            # Database connection
│   └── passport.js      # Google OAuth configuration
├── controllers/
│   └── authController.js # Authentication logic
├── models/
│   └── userModel.js     # Database operations
└── routes/
    ├── auth.js          # Regular auth routes
    └── googleAuth.js    # Google OAuth routes
```

## 🛠️ Dependencies

### Core Dependencies
- **express**: Web framework
- **mysql2**: MySQL database driver
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT token generation
- **passport**: Authentication middleware
- **passport-google-oauth20**: Google OAuth strategy
- **express-session**: Session management
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Development Dependencies
- **nodemon**: Auto-restart server during development

## 🔒 Security Features

### Password Security
- Passwords hashed using bcrypt with salt rounds of 10
- Secure password comparison

### JWT Security
- Tokens expire after 1 hour
- Secure secret key required
- Token verification middleware

### Google OAuth Security
- Secure callback URL validation
- User data validation
- Automatic account linking

### Database Security
- Parameterized queries to prevent SQL injection
- Input validation and sanitization
- Unique constraints on email and username

## 🚨 Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "message": "All fields are required"
}
```

**401 Unauthorized:**
```json
{
  "message": "Access token required"
}
```

**404 Not Found:**
```json
{
  "message": "User not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Internal server error"
}
```

## 🔍 Debugging

### Enable Debug Logging
The application includes console logs for debugging:
- User registration attempts
- Login attempts
- Google OAuth flow
- Database operations
- Error details

### Common Issues

1. **Database Connection Error**
   - Check MySQL is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Google OAuth Error**
   - Verify Google credentials in `.env`
   - Check redirect URIs in Google Cloud Console
   - Ensure Google APIs are enabled

3. **JWT Token Error**
   - Verify JWT_SECRET is set in `.env`
   - Check token expiration
   - Ensure proper Authorization header format

## 🚀 Deployment

### Production Considerations
1. Use HTTPS in production
2. Set secure environment variables
3. Configure proper CORS settings
4. Use production database
5. Set up proper logging
6. Configure Google OAuth for production domain

### Environment Variables for Production
```env
NODE_ENV=production
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
JWT_SECRET=your_production_jwt_secret
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret
```

## 📝 API Testing

### Using Postman or curl

**Test Registration:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

**Test Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Test Protected Route:**
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Last Updated:** January 2024
**Version:** 1.0.0 