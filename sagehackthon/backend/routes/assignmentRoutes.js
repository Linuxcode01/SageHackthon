import express from "express";
import { Assignment } from "../models/Assignment.js";

const router = express.Router();

// Get all assignments
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("studentId", "name rollNumber");
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get assignments by student ID
router.get("/student/:studentId", async (req, res) => {
  try {
    const assignments = await Assignment.find({ studentId: req.params.studentId }).populate(
      "studentId",
      "name rollNumber"
    );
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get assignment by ID
router.get("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate("studentId", "name rollNumber");
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create assignment
router.post("/", async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    await assignment.populate("studentId", "name rollNumber");
    res.status(201).json(assignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update assignment
router.put("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("studentId", "name rollNumber");
    res.json(assignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
