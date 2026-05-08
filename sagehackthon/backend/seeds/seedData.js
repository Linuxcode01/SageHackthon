import mongoose from "mongoose";
import dotenv from "dotenv";
import { Student } from "../models/Student.js";
import { Result } from "../models/Result.js";
import { Assignment } from "../models/Assignment.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/sagehackthon";

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Student.deleteMany({});
    await Result.deleteMany({});
    await Assignment.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create dummy students
    const students = await Student.insertMany([
      {
        rollNumber: "CS2021045",
        name: "Rahul Verma",
        email: "rahul@nit.ac.in",
        phone: "9876543210",
        semester: 5,
        course: "B.Tech CSE",
        department: "Computer Science",
        gpa: 8.2,
        attendance: 88,
        totalMarks: 410,
        status: "Active",
      },
      {
        rollNumber: "CS2021046",
        name: "Divya Kapoor",
        email: "divya@nit.ac.in",
        phone: "9876543211",
        semester: 5,
        course: "B.Tech CSE",
        department: "Computer Science",
        gpa: 9.1,
        attendance: 97,
        totalMarks: 455,
        status: "Active",
      },
      {
        rollNumber: "CS2021047",
        name: "Rohan Das",
        email: "rohan@nit.ac.in",
        phone: "9876543212",
        semester: 5,
        course: "B.Tech CSE",
        department: "Computer Science",
        gpa: 6.8,
        attendance: 55,
        totalMarks: 210,
        status: "Active",
      },
      {
        rollNumber: "CS2021048",
        name: "Ananya Singh",
        email: "ananya@nit.ac.in",
        phone: "9876543213",
        semester: 5,
        course: "B.Tech CSE",
        department: "Computer Science",
        gpa: 8.8,
        attendance: 95,
        totalMarks: 440,
        status: "Active",
      },
    ]);
    console.log(`✅ Created ${students.length} students`);

    // Create dummy results
    const subjects = ["Math", "DSA", "DBMS", "OS", "CN", "AI/ML"];
    const grades = ["A+", "A", "B+", "B", "C+"];
    const results = [];

    for (const student of students) {
      for (let i = 0; i < 6; i++) {
        const marksObtained = 60 + Math.random() * 40;
        results.push({
          studentId: student._id,
          semester: 5,
          subject: subjects[i],
          marksObtained: Math.round(marksObtained),
          maxMarks: 100,
          grade: grades[Math.floor(marksObtained / 20)],
          examType: i % 2 === 0 ? "Endterm" : "Midterm",
        });
      }
    }

    await Result.insertMany(results);
    console.log(`✅ Created ${results.length} results`);

    // Create dummy assignments
    const assignments = [];
    const assignmentTitles = [
      "Linear Regression Implementation",
      "Database Design Project",
      "Operating Systems Simulation",
      "Network Protocol Analysis",
      "Machine Learning Model",
    ];

    for (const student of students) {
      for (let i = 0; i < 5; i++) {
        const dueDate = new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000);
        const isSubmitted = Math.random() > 0.3;
        assignments.push({
          studentId: student._id,
          subject: subjects[i],
          title: assignmentTitles[i],
          description: `Complete the ${assignmentTitles[i]} and submit by due date.`,
          dueDate,
          submittedDate: isSubmitted ? new Date(dueDate.getTime() - Math.random() * 5 * 24 * 60 * 60 * 1000) : null,
          marksObtained: isSubmitted ? Math.round(7 + Math.random() * 3) : null,
          maxMarks: 10,
          status: isSubmitted ? "Graded" : "Pending",
          feedback: isSubmitted ? "Good work! Keep improving." : null,
        });
      }
    }

    await Assignment.insertMany(assignments);
    console.log(`✅ Created ${assignments.length} assignments`);

    console.log("\n✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seedData();
