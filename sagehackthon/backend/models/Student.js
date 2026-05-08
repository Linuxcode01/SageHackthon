import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    rollNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    semester: { type: Number, default: 5 },
    course: { type: String, default: "B.Tech CSE" },
    department: { type: String, default: "Computer Science" },
    gpa: { type: Number, default: 8.0 },
    attendance: { type: Number, default: 85, min: 0, max: 100 },
    totalMarks: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Inactive", "Suspended"], default: "Active" },
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);
