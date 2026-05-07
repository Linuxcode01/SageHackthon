/**
 * mockData.js
 * Realistic mock data for all dashboards.
 * In production: all this data comes from your backend API.
 * Structure mirrors what the API would return.
 */

// ── STUDENTS ──────────────────────────────────────────────
export const STUDENTS = [
  { id:"s1",  name:"Rahul Verma",    roll:"CS2021045", marks:82, attendance:88, gpa:8.2, status:"Good",      dept:"CSE", sem:5, email:"rahul@college.edu"   },
  { id:"s2",  name:"Ananya Singh",   roll:"CS2021032", marks:91, attendance:95, gpa:9.1, status:"Excellent",  dept:"CSE", sem:5, email:"ananya@college.edu"  },
  { id:"s3",  name:"Karan Mehta",    roll:"CS2021018", marks:55, attendance:62, gpa:5.5, status:"At Risk",    dept:"CSE", sem:5, email:"karan@college.edu"   },
  { id:"s4",  name:"Pooja Patel",    roll:"CS2021067", marks:74, attendance:79, gpa:7.4, status:"Average",    dept:"CSE", sem:5, email:"pooja@college.edu"   },
  { id:"s5",  name:"Amit Joshi",     roll:"CS2021089", marks:48, attendance:58, gpa:4.8, status:"Weak",       dept:"CSE", sem:5, email:"amit@college.edu"    },
  { id:"s6",  name:"Sneha Reddy",    roll:"CS2021023", marks:88, attendance:92, gpa:8.8, status:"Good",       dept:"CSE", sem:5, email:"sneha@college.edu"   },
  { id:"s7",  name:"Vikram Nair",    roll:"CS2021056", marks:63, attendance:71, gpa:6.3, status:"Average",    dept:"CSE", sem:5, email:"vikram@college.edu"  },
  { id:"s8",  name:"Divya Kapoor",   roll:"CS2021041", marks:95, attendance:97, gpa:9.5, status:"Excellent",  dept:"CSE", sem:5, email:"divya@college.edu"   },
  { id:"s9",  name:"Rohan Das",      roll:"CS2021078", marks:42, attendance:55, gpa:4.2, status:"At Risk",    dept:"CSE", sem:5, email:"rohan@college.edu"   },
  { id:"s10", name:"Meera Iyer",     roll:"CS2021012", marks:77, attendance:83, gpa:7.7, status:"Good",       dept:"CSE", sem:5, email:"meera@college.edu"   },
  { id:"s11", name:"Arjun Tiwari",   roll:"CS2021034", marks:69, attendance:76, gpa:6.9, status:"Average",    dept:"CSE", sem:5, email:"arjun@college.edu"   },
  { id:"s12", name:"Priya Gupta",    roll:"CS2021058", marks:85, attendance:90, gpa:8.5, status:"Good",       dept:"CSE", sem:5, email:"priya@college.edu"   },
];

// ── SUBJECT MARKS (for bar chart) ─────────────────────────
export const SUBJECT_MARKS = [
  { subject:"Math",   marks:72, fullMark:100 },
  { subject:"DSA",    marks:85, fullMark:100 },
  { subject:"DBMS",   marks:68, fullMark:100 },
  { subject:"OS",     marks:78, fullMark:100 },
  { subject:"CN",     marks:81, fullMark:100 },
  { subject:"AI/ML",  marks:90, fullMark:100 },
];

// ── MARKS TREND (for line chart) ──────────────────────────
export const MARKS_TREND = [
  { month:"Aug",  avg:68, predicted:68 },
  { month:"Sep",  avg:71, predicted:70 },
  { month:"Oct",  avg:69, predicted:72 },
  { month:"Nov",  avg:75, predicted:74 },
  { month:"Dec",  avg:78, predicted:76 },
  { month:"Jan",  avg:82, predicted:79 },
  { month:"Feb",  avg:null, predicted:82 },
  { month:"Mar",  avg:null, predicted:85 },
];

// ── STUDENT PERSONAL TREND ────────────────────────────────
export const STUDENT_TREND = [
  { month:"Aug", marks:65, predicted:65 },
  { month:"Sep", marks:70, predicted:68 },
  { month:"Oct", marks:68, predicted:71 },
  { month:"Nov", marks:75, predicted:74 },
  { month:"Dec", marks:80, predicted:77 },
  { month:"Jan", marks:82, predicted:80 },
  { month:"Feb", marks:null, predicted:84 },
  { month:"Mar", marks:null, predicted:87 },
];

// ── STUDENT SUBJECTS ──────────────────────────────────────
export const STUDENT_SUBJECTS = [
  { subject:"Math",  marks:75, max:100, grade:"B+" },
  { subject:"DSA",   marks:88, max:100, grade:"A"  },
  { subject:"DBMS",  marks:62, max:100, grade:"B"  },
  { subject:"OS",    marks:79, max:100, grade:"B+" },
  { subject:"CN",    marks:83, max:100, grade:"A-" },
  { subject:"AI/ML", marks:91, max:100, grade:"A+" },
];

// ── DEPARTMENTS ───────────────────────────────────────────
export const DEPARTMENTS = [
  { id:"d1", name:"CSE",   students:320, teachers:18, avgMarks:78, passRate:92, attendance:85, trend:"+8%" },
  { id:"d2", name:"ECE",   students:280, teachers:15, avgMarks:74, passRate:88, attendance:82, trend:"+3%" },
  { id:"d3", name:"MECH",  students:240, teachers:14, avgMarks:70, passRate:85, attendance:79, trend:"-2%" },
  { id:"d4", name:"CIVIL", students:200, teachers:12, avgMarks:72, passRate:87, attendance:81, trend:"+1%" },
  { id:"d5", name:"IT",    students:260, teachers:16, avgMarks:76, passRate:90, attendance:84, trend:"+5%" },
];

// ── STUDENT GROWTH (admin chart) ──────────────────────────
export const STUDENT_GROWTH = [
  { year:"2020", students:980  },
  { year:"2021", students:1100 },
  { year:"2022", students:1250 },
  { year:"2023", students:1380 },
  { year:"2024", students:1500 },
];

// ── PASS/FAIL DATA ────────────────────────────────────────
export const PASS_FAIL = [
  { name:"Pass", value:89, fill:"#6366f1" },
  { name:"Fail", value:11, fill:"#fca5a5" },
];

// ── ATTENDANCE PIE ────────────────────────────────────────
export const ATTENDANCE_PIE = [
  { name:"Present", value:78, fill:"#6366f1" },
  { name:"Absent",  value:22, fill:"#e0e7ff" },
];

// ── TEACHERS ──────────────────────────────────────────────
export const TEACHERS = [
  { id:"t1", name:"Dr. Priya Sharma",  dept:"CSE",   subject:"DSA",    exp:"8 yrs",  rating:4.8, students:120 },
  { id:"t2", name:"Prof. Ravi Kumar",  dept:"CSE",   subject:"DBMS",   exp:"12 yrs", rating:4.5, students:115 },
  { id:"t3", name:"Dr. Sunita Rao",    dept:"ECE",   subject:"Signals", exp:"10 yrs", rating:4.6, students:110 },
  { id:"t4", name:"Mr. Ajay Verma",    dept:"MECH",  subject:"Thermo",  exp:"6 yrs",  rating:4.2, students:95  },
  { id:"t5", name:"Dr. Kavita Singh",  dept:"IT",    subject:"AI/ML",   exp:"9 yrs",  rating:4.9, students:130 },
];

// ── NOTIFICATIONS ─────────────────────────────────────────
export const NOTIFICATIONS = [
  { id:1, type:"warning", title:"Low Attendance Alert",    msg:"3 students have attendance below 65%.",         time:"2 min ago",  read:false },
  { id:2, type:"info",    title:"New Assignment Submitted", msg:"12 students submitted the DSA assignment.",     time:"1 hr ago",   read:false },
  { id:3, type:"success", title:"Exam Results Published",  msg:"Semester 5 results are now available.",         time:"3 hrs ago",  read:true  },
  { id:4, type:"danger",  title:"At-Risk Student",         msg:"Rohan Das needs immediate academic support.",   time:"1 day ago",  read:true  },
  { id:5, type:"info",    title:"Department Meeting",      msg:"CSE faculty meeting scheduled for tomorrow.",   time:"2 days ago", read:true  },
];

// ── ACTIVITY LOGS (admin) ─────────────────────────────────
export const ACTIVITY_LOGS = [
  { id:1, action:"Student marks uploaded",       user:"Dr. Priya Sharma",  time:"Today, 10:30 AM",  type:"upload"  },
  { id:2, action:"New student registered",       user:"Admin Panel",       time:"Today, 09:15 AM",  type:"create"  },
  { id:3, action:"Attendance report exported",   user:"Prof. Ravi Kumar",  time:"Yesterday, 4:00 PM",type:"export" },
  { id:4, action:"AI insights generated",        user:"System",            time:"Yesterday, 2:30 PM",type:"ai"     },
  { id:5, action:"Teacher profile updated",      user:"Dr. Sunita Rao",    time:"2 days ago",        type:"update" },
];
