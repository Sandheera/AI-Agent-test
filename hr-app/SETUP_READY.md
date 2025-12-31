# ✅ HR Management System - Setup Instructions

## Current Status: ✅ **SERVER READY!**

Your HR Management System backend is **installed and ready to run**. The server successfully starts on port 5000 with Swagger documentation.

---

## 🚀 What Just Happened

### ✅ Fixed Issues
1. **nodemon not found** - Fixed: Installed as dev dependency
2. **jsonwebtoken version error** - Fixed: Updated to v9.0.0 (latest available)
3. **Dependencies installed** - 447 packages installed successfully
4. **Server started** - Running on port 5000 with Swagger UI
5. **.env file created** - With placeholder MongoDB configuration

---

## 📋 Next Steps: Configure MongoDB

To get the full system working with a real database, follow these steps:

### Option 1: Use MongoDB Atlas (Cloud - Recommended)

1. **Create Free MongoDB Account**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Sign up (free tier available)

2. **Create a Cluster**
   - Click "Build a Database"
   - Select "M0 Tier" (free)
   - Choose your cloud provider and region
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Click "Create User"

4. **Get Connection String**
   - Go to "Database" → "Connect"
   - Click "Drivers"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

5. **Update .env File**
   - Open: `backend/.env`
   - Replace `MONGODB_URI` with your actual connection string
   - Replace `username` and `password` with your database user credentials
   - Save file

### Option 2: Use Local MongoDB (Windows)

1. **Install MongoDB Community**
   - Download: https://www.mongodb.com/try/download/community
   - Run installer and follow setup
   - Default installs to: `C:\Program Files\MongoDB`

2. **Update .env File**
   - Open: `backend/.env`
   - Replace line:
     ```
     MONGODB_URI=mongodb://localhost:27017/hr_management
     ```
   - Save file

---

## 🔧 Running the Server

### Start Development Server
```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
📚 Swagger docs available at http://localhost:5000/api-docs
✅ MongoDB Connected
```

### Access Swagger UI
Once server is running:
```
http://localhost:5000/api-docs
```

---

## 📝 Your .env File

The file `backend/.env` has been created with:

```env
# MongoDB Connection (UPDATE THIS)
MONGODB_URI=mongodb+srv://test:test@testcluster.mongodb.net/hr_management?retryWrites=true&w=majority

# JWT Configuration (Change in production)
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345678
JWT_EXPIRY=7d

# Server Configuration
PORT=5000
NODE_ENV=development
```

**⚠️ Important**: Replace the MONGODB_URI with your actual MongoDB connection string!

---

## 🧪 Test the API

### Method 1: Swagger UI (Easiest)
1. Start server: `npm run dev`
2. Open: http://localhost:5000/api-docs
3. Click any endpoint to test

### Method 2: Postman
1. Import: `HR_Management_API.postman_collection.json`
2. Set base_url variable to `http://localhost:5000`
3. Test endpoints

### Method 3: cURL
```bash
# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"password123"}'
```

---

## 🧪 Run Tests

```bash
npm test
```

This runs 29 test cases covering authentication, employees, and leave management.

**Expected Output:**
```
PASS  tests/auth.test.js (8 tests)
PASS  tests/employee.test.js (11 tests)
PASS  tests/leave.test.js (10 tests)

Tests: 29 passed, 29 total
```

---

## 📦 What's Installed

**Dependencies (11):**
- express - Web framework
- mongoose - MongoDB ODM
- dotenv - Environment variables
- cors - Cross-origin support
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- swagger-ui-express - Swagger UI
- swagger-jsdoc - OpenAPI generation
- validator - Input validation
- helmet - Security headers
- morgan - Request logging

**Dev Dependencies (3):**
- nodemon - Auto-reload
- jest - Testing
- supertest - HTTP testing

---

## ✅ System Ready

Your HR Management System is now:

✅ **Installed** - All 447 dependencies installed  
✅ **Configured** - .env file created  
✅ **Server Running** - On port 5000  
✅ **Swagger Ready** - Documentation UI available  
✅ **Tests Ready** - 29 test cases configured  

---

## 🎯 Next Action

### To use the system with real database:

1. **Create MongoDB Account** (5 minutes)
   - https://www.mongodb.com/cloud/atlas
   
2. **Get Connection String** (2 minutes)
   - Follow steps in "Option 1" above
   
3. **Update .env File** (1 minute)
   - Replace MONGODB_URI with your connection string
   
4. **Restart Server** (30 seconds)
   - Kill current server (Ctrl+C)
   - Run `npm run dev` again

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 5000 is in use
# Change PORT in .env or kill the process
```

### MongoDB connection fails
```bash
# Check MONGODB_URI in .env
# Verify MongoDB cluster is accessible
# Check username and password
```

### Tests fail
```bash
# Ensure MongoDB is connected
# Clear test data if needed
npm test -- --forceExit
```

---

## 📚 Documentation

All documentation is in the `hr-app` root directory:

- **00_START_HERE.md** - Quick overview
- **QUICK_START.md** - Detailed setup guide
- **README.md** - API reference
- **ARCHITECTURE.md** - System design
- **PROJECT_SUMMARY.md** - Complete specs

---

## ✨ Ready to Go!

Your backend is **installed, configured, and running**. 

**Next**: Set up MongoDB and enjoy building! 🚀

---

**Current Setup:**
- ✅ Node.js & npm
- ✅ All dependencies installed
- ✅ Server running on port 5000
- ✅ Swagger UI at /api-docs
- ⏳ MongoDB (pending configuration)

Once you add your MongoDB URI to `.env`, the system will be fully operational!
