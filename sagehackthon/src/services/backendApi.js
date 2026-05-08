/**
 * backendApi.js
 * Service to communicate with the backend API
 */

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

// Students
export async function getStudentByRoll(rollNumber) {
  try {
    const res = await fetch(`${API_BASE_URL}/students/roll/${rollNumber}`);
    if (!res.ok) throw new Error(`Failed to fetch student: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("[API] getStudentByRoll error:", err);
    throw err;
  }
}

export async function getStudent(studentId) {
  try {
    const res = await fetch(`${API_BASE_URL}/students/${studentId}`);
    if (!res.ok) throw new Error(`Failed to fetch student: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("[API] getStudent error:", err);
    throw err;
  }
}

// Get all students
export async function getAllStudents() {
  try {
    const res = await fetch(`${API_BASE_URL}/students`);
    if (!res.ok) throw new Error(`Failed to fetch students: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("[API] getAllStudents error:", err);
    throw err;
  }
}

// Create a new student
export async function createStudent(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to create student: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("[API] createStudent error:", err);
    throw err;
  }
}

// Results
export async function getResultsByStudent(studentId) {
  try {
    const res = await fetch(`${API_BASE_URL}/results/student/${studentId}`);
    if (!res.ok) throw new Error(`Failed to fetch results: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("[API] getResultsByStudent error:", err);
    throw err;
  }
}

// Assignments
export async function getAssignmentsByStudent(studentId) {
  try {
    const res = await fetch(`${API_BASE_URL}/assignments/student/${studentId}`);
    if (!res.ok) throw new Error(`Failed to fetch assignments: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("[API] getAssignmentsByStudent error:", err);
    throw err;
  }
}

export async function updateAssignment(assignmentId, data) {
  try {
    const res = await fetch(`${API_BASE_URL}/assignments/${assignmentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to update assignment: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("[API] updateAssignment error:", err);
    throw err;
  }
}
