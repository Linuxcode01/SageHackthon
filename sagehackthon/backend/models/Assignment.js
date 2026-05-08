import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    subject: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    submittedDate: { type: Date },
    marksObtained: { type: Number },
    maxMarks: { type: Number, default: 10 },
    status: { type: String, enum: ["Pending", "Submitted", "Graded"], default: "Pending" },
    feedback: { type: String },
  },
  { timestamps: true }
);

export const Assignment = mongoose.model("Assignment", assignmentSchema);
