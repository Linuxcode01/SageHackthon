# 🎯 Quick Reference Card

## ⚡ One-Minute Setup

```bash
# Terminal 1: MongoDB
brew services start mongodb-community

# Terminal 2: Backend (cd to backend/)
npm install && npm run seed && npm run dev

# Terminal 3: Frontend
npm run dev
```

**Then visit**: http://localhost:5173

---

## 📍 Important Ports
- **Frontend**: 5173
- **Backend**: 5000
- **MongoDB**: 27017

---

## 🧪 Test Student Data
| Roll No | Name | GPA | Attendance |
|---------|------|-----|-----------|
| CS2021045 | Rahul Verma | 8.2 | 88% |
| CS2021046 | Divya Kapoor | 9.1 | 97% ⭐ |
| CS2021047 | Rohan Das | 6.8 | 55% ⚠️ |
| CS2021048 | Ananya Singh | 8.8 | 95% |

---

## 🔗 API Quick Test
```bash
# Check backend is running
curl http://localhost:5000/api/health

# List all students
curl http://localhost:5000/api/students | jq

# Get student by roll number
curl http://localhost:5000/api/students/roll/CS2021045 | jq

# Get results for student (replace ID)
curl http://localhost:5000/api/results/student/{studentId} | jq
```

---

## 📁 Key Files
- **Frontend Config**: `.env.local`
- **Backend Config**: `backend/.env`
- **Backend Entry**: `backend/server.js`
- **Seed Script**: `backend/seeds/seedData.js`
- **Dashboard**: `src/screens/student/StudentDashboard.jsx`
- **API Service**: `src/services/backendApi.js`

---

## ✅ Verification Checklist
- [ ] MongoDB running: `brew services list`
- [ ] Backend started: Terminal shows "🚀 Server running on http://localhost:5000"
- [ ] Data seeded: Check `npm run seed` output
- [ ] Frontend running: Terminal shows "VITE v8.0.10... ready in..."
- [ ] Dashboard loads: See StudentDashboard in browser
- [ ] Real data showing: Check stat cards have real values

---

## 🐛 Troubleshooting Quick Fixes

**MongoDB not starting?**
```bash
brew services list  # Check status
brew services restart mongodb-community
```

**Port 5000 in use?**
```bash
lsof -i :5000  # Find process
kill -9 <PID>  # Kill it
```

**Build failed?**
```bash
npm run build  # Test build
npm run dev    # Run dev server instead
```

**Backend not connecting from frontend?**
- Check `.env.local` has `VITE_BACKEND_URL=http://localhost:5000/api`
- Check console for CORS errors
- Verify backend is running: `curl http://localhost:5000/api/health`

---

## 📊 What You'll See

### StudentDashboard Now Shows:
✅ Real marks (calculated from MongoDB results)
✅ Actual subject performance with grades
✅ Real assignments with status badges
✅ Stats from database (GPA, attendance, rank)
✅ AI Insights generated from real data

### Example Values (from seed data):
- **Rahul Verma** (CS2021045)
  - Marks: 68 (average of 6 subjects)
  - Attendance: 88%
  - GPA: 8.2
  - Assignments: 5 (4 graded, 1 submitted)

---

## 🚀 Next Steps After Testing
1. Verify StudentDashboard loads real data ✅
2. Check all stat cards show database values ✅
3. Confirm assignments display correctly ✅
4. Test Ollama insights generation
5. Try logging in as different students
6. Check network tab for API calls

---

## 📞 Documentation Links
- Full Setup: `backend/README.md`
- Step-by-step: `BACKEND_SETUP.md`
- Architecture: `BACKEND_SUMMARY.md`
- Complete Overview: `COMPLETION_SUMMARY.md`

---

**You're all set! Start MongoDB → Backend → Frontend → See real data 🎉**
