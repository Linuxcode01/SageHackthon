import express from "express";
import fs from "fs";
import path from "path";
import { Chat } from "../models/Chat.js";

const router = express.Router();
const LOG_DIR = path.resolve(process.cwd(), "backend", "logs");
const LOG_FILE = path.join(LOG_DIR, "chatlogs.txt");

// ensure log dir exists
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

// Create chat log entry
router.post("/", async (req, res) => {
  try {
    const { studentId, role = "user", message, meta = {} } = req.body;
    if (!studentId || !message) return res.status(400).json({ error: "studentId and message are required" });

    const chat = new Chat({ studentId, role, message, meta });
    await chat.save();

    // Append to file (simple newline JSON)
    const line = JSON.stringify({ studentId, role, message, meta, createdAt: chat.createdAt });
    fs.appendFileSync(LOG_FILE, line + "\n");

    res.status(201).json(chat);
  } catch (err) {
    console.error("[chatRoutes] failed to save chat", err);
    res.status(500).json({ error: err.message });
  }
});

// Get chats for a student
router.get("/student/:studentId", async (req, res) => {
  try {
    const chats = await Chat.find({ studentId: req.params.studentId }).sort({ createdAt: 1 }).limit(200);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
