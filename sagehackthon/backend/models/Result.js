import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    semester: { type: Number, required: true },
    subject: { type: String, required: true },
    marksObtained: { type: Number, required: true },
    maxMarks: { type: Number, default: 100 },
    grade: { type: String, enum: ["A+", "A", "B+", "B", "C+", "C", "D", "F"], required: true },
    examType: { type: String, enum: ["Midterm", "Endterm", "Quiz", "Assignment"], default: "Endterm" },
  },
  { timestamps: true }
);

export const Result = mongoose.model("Result", resultSchema);
