import express from "express";
import { Result } from "../models/Result.js";

const router = express.Router();

// Get all results
router.get("/", async (req, res) => {
  try {
    const results = await Result.find().populate("studentId", "name rollNumber");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get results by student ID
router.get("/student/:studentId", async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.params.studentId }).populate(
      "studentId",
      "name rollNumber"
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get result by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate("studentId", "name rollNumber");
    if (!result) return res.status(404).json({ error: "Result not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create result
router.post("/", async (req, res) => {
  try {
    const result = new Result(req.body);
    await result.save();
    await result.populate("studentId", "name rollNumber");
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update result
router.put("/:id", async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate(
      "studentId",
      "name rollNumber"
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
