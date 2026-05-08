# 🚀 Backend Setup Quick Start

## Prerequisites
- Node.js installed
- MongoDB installed locally OR MongoDB Atlas account

## Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

## Step 2: Start MongoDB
**If using local MongoDB:**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo service mongod start

# Windows - Run MongoDB server (usually installed as service)
```

**If using MongoDB Atlas (Cloud):**
- Create account at https://www.mongodb.com/cloud/atlas
- Create cluster
- Get connection string
- Update `.env`: `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sagehackthon`

## Step 3: Configure Backend .env
```bash
# File: backend/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sagehackthon
NODE_ENV=development
```

## Step 4: Seed Database with Dummy Data
```bash
npm run seed
```

✅ Creates 4 students, 24 results, and 20 assignments

## Step 5: Start Backend Server
```bash
npm run dev
```

Expected output:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
```

## Step 6: Update Frontend .env
```bash
# File: .env.local (in root folder)
VITE_BACKEND_URL=http://localhost:5000/api
```

## Step 7: Test Backend is Working
```bash
# In another terminal
curl http://localhost:5000/api/health
# Should return: {"status":"Backend is running ✅"}

# Get all students
curl http://localhost:5000/api/students | jq
```

## Step 8: Run Frontend
```bash
npm run dev
```

## 📊 Dummy Data Created
- **Students**: Rahul (8.2 GPA), Divya (9.1), Rohan (6.8), Ananya (8.8)
- **Results**: 6 subjects × 4 students = 24 results
- **Assignments**: 5 assignments × 4 students = 20 assignments

## ✨ StudentDashboard now shows:
✅ Real student data from MongoDB
✅ Actual subject marks and grades
✅ Pending/Submitted/Graded assignments
✅ Real stats calculated from DB

## 🐛 Troubleshooting

### MongoDB not connecting?
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Or restart it
brew services restart mongodb-community
```

### Port 5000 already in use?
```bash
# Change in backend/.env to:
PORT=5001

# Then update frontend .env to:
VITE_BACKEND_URL=http://localhost:5001/api
```

### CORS Error?
- Make sure CORS is enabled in server.js (it is by default)
- Make sure frontend is on different port (default 5173)

## 🎯 Next Steps
- [ ] Add more students to database
- [ ] Create more results/assignments
- [ ] Build admin panel to manage data
- [ ] Add student authentication
- [ ] Deploy backend to production (Railway, Render, Vercel)

---
**Backend is now running with real data! 🎉**
