# Login App Frontend

A React application with Tailwind CSS for user authentication and profile management.

## Features

- User registration and login
- Protected routes with authentication
- Profile management (view and edit)
- Modern UI with Tailwind CSS
- Responsive design
- Form validation
- Loading states and error handling

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Backend server running on http://localhost:5000

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Make sure your backend server is running on port 5000
2. Start the frontend development server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not recommended)

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   ├── Navbar.js
│   │   └── Register.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## API Endpoints

The frontend connects to the following backend endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `DELETE /api/auth/logout` - User logout

## Authentication Flow

1. Users can register with username, email, and password
2. After registration, users are redirected to login
3. Login provides a JWT token that's stored in localStorage
4. Protected routes check for valid authentication
5. Users can view and edit their profile in the dashboard
6. Logout clears the token and redirects to login

## Technologies Used

- React 18
- React Router DOM
- Tailwind CSS
- Axios for API calls
- Context API for state management 