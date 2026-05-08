# EduInsight Backend

Backend server for EduInsight AI with MongoDB database for student results and assignments.

## 📋 Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. MongoDB Setup

Make sure MongoDB is running on your system:

```bash
# On Linux/Mac
brew services start mongodb-community

# On Windows (if installed via installer)
mongod
```

Or use MongoDB Atlas (cloud):
```bash
# Update .env with:
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/sagehackthon
```

### 3. Configure Environment

Create/update `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sagehackthon
NODE_ENV=development
```

### 4. Seed Dummy Data

```bash
npm run seed
```

This will:
- Clear existing data
- Create 4 students (Rahul, Divya, Rohan, Ananya)
- Create results for 6 subjects per student
- Create 5 assignments per student

### 5. Start the Server

```bash
npm run dev   # Development with auto-reload
# OR
npm start     # Production mode
```

Server runs on: `http://localhost:5000`

## 🔌 API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `GET /api/students/roll/:rollNumber` - Get student by roll number
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student

### Results
- `GET /api/results` - Get all results
- `GET /api/results/student/:studentId` - Get results by student
- `GET /api/results/:id` - Get result by ID
- `POST /api/results` - Create result
- `PUT /api/results/:id` - Update result

### Assignments
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/student/:studentId` - Get assignments by student
- `GET /api/assignments/:id` - Get assignment by ID
- `POST /api/assignments` - Create assignment
- `PUT /api/assignments/:id` - Update assignment

## 🗄️ Database Schema

### Student
```javascript
{
  rollNumber: String (unique),
  name: String,
  email: String,
  phone: String,
  semester: Number,
  course: String,
  department: String,
  gpa: Number (0-10),
  attendance: Number (0-100),
  totalMarks: Number,
  status: String (Active|Inactive|Suspended)
}
```

### Result
```javascript
{
  studentId: ObjectId (ref: Student),
  semester: Number,
  subject: String,
  marksObtained: Number,
  maxMarks: Number,
  grade: String (A+|A|B+|B|C+|C|D|F),
  examType: String (Midterm|Endterm|Quiz|Assignment)
}
```

### Assignment
```javascript
{
  studentId: ObjectId (ref: Student),
  subject: String,
  title: String,
  description: String,
  dueDate: Date,
  submittedDate: Date,
  marksObtained: Number,
  maxMarks: Number,
  status: String (Pending|Submitted|Graded),
  feedback: String
}
```

## 🧪 Test the API

```bash
# Check health
curl http://localhost:5000/api/health

# Get all students
curl http://localhost:5000/api/students

# Get results for a student (replace with actual student ID)
curl http://localhost:5000/api/results/student/{studentId}

# Get assignments for a student
curl http://localhost:5000/api/assignments/student/{studentId}
```

## 🔌 Frontend Configuration

Update `.env.local` in frontend:
```env
VITE_BACKEND_URL=http://localhost:5000/api
```

## 📱 Using with Frontend

The StudentDashboard now fetches real data from the backend:
- Results are displayed in the subject-wise performance section
- Assignments are shown in the assignments panel
- Stats are calculated from real data

## 🛠️ Troubleshooting

### MongoDB Connection Error
```
MongooseError: Cannot connect to MongoDB
```
- Ensure MongoDB is running: `mongod`
- Check connection URI in `.env`

### Port Already in Use
```
EADDRINUSE: address already in use :::5000
```
- Change PORT in `.env` or kill the process using port 5000

### CORS Errors
- Frontend and backend should be on different ports (3000 vs 5000)
- CORS is enabled in `server.js`

## 📚 Resources

- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [MongoDB](https://www.mongodb.com/)
