/**
 * TeacherUpload.jsx
 * Upload marks and attendance data (UI only — backend-ready).
 */
import { useState } from "react";
import { Upload, FileText, CheckCircle, X } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";

function UploadZone({ label, accept, icon, onFile, file, onClear }) {
  const [drag, setDrag] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer
        ${drag ? "border-primary-400 bg-primary-50 dark:bg-primary-900/20" : "border-slate-200 dark:border-slate-700 hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-900/10"}`}
      onClick={() => !file && document.getElementById(`file-${label}`).click()}
    >
      <input id={`file-${label}`} type="file" accept={accept} className="hidden" onChange={(e) => onFile(e.target.files[0])} />
      {file ? (
        <div className="flex items-center justify-center gap-3">
          <CheckCircle size={24} className="text-emerald-500" />
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{file.name}</p>
            <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onClear(); }} className="ml-2 text-slate-400 hover:text-red-500">
            <X size={16} />
          </button>
        </div>
      ) : (
        <>
          <div className="text-4xl mb-3">{icon}</div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</p>
          <p className="text-xs text-slate-400 mt-1">Drag & drop or click to browse</p>
          <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Supports: {accept}</p>
        </>
      )}
    </div>
  );
}

export default function TeacherUpload() {
  const [marksFile, setMarksFile]           = useState(null);
  const [attendanceFile, setAttendanceFile] = useState(null);
  const [uploading, setUploading]           = useState(false);
  const [success, setSuccess]               = useState("");

  const handleUpload = async () => {
    if (!marksFile && !attendanceFile) return;
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setUploading(false);
    setSuccess("Files uploaded successfully! AI analysis will begin shortly.");
    setMarksFile(null);
    setAttendanceFile(null);
    setTimeout(() => setSuccess(""), 4000);
  };

  return (
    <DashboardLayout title="Upload Data" subtitle="Upload student marks and attendance">
      <div className="max-w-2xl space-y-6">

        {/* Instructions */}
        <div className="card p-5 border-l-4 border-l-primary-400 bg-primary-50 dark:bg-primary-900/20">
          <h3 className="font-semibold text-primary-700 dark:text-primary-400 mb-2">📋 Upload Instructions</h3>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
            <li>Upload CSV or Excel files with student marks</li>
            <li>Attendance file should include roll number and percentage</li>
            <li>AI will automatically analyze and generate insights</li>
            <li>Maximum file size: 10 MB per file</li>
          </ul>
        </div>

        {/* Upload zones */}
        <div className="card p-5 space-y-4">
          <h3 className="font-semibold text-slate-800 dark:text-white">📊 Upload Marks</h3>
          <UploadZone
            label="Student Marks File"
            accept=".csv,.xlsx,.xls"
            icon="📊"
            file={marksFile}
            onFile={setMarksFile}
            onClear={() => setMarksFile(null)}
          />
        </div>

        <div className="card p-5 space-y-4">
          <h3 className="font-semibold text-slate-800 dark:text-white">📅 Upload Attendance</h3>
          <UploadZone
            label="Attendance File"
            accept=".csv,.xlsx,.xls"
            icon="📅"
            file={attendanceFile}
            onFile={setAttendanceFile}
            onClear={() => setAttendanceFile(null)}
          />
        </div>

        {/* Success message */}
        {success && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle size={18} className="text-emerald-500" />
            <p className="text-sm text-emerald-700 dark:text-emerald-400">{success}</p>
          </div>
        )}

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={(!marksFile && !attendanceFile) || uploading}
          className="btn-primary w-full py-4 text-base disabled:opacity-50"
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Uploading & Analyzing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Upload size={18} /> Upload & Analyze with AI
            </span>
          )}
        </button>

        {/* Template download */}
        <div className="card p-4 flex items-center gap-3">
          <FileText size={20} className="text-primary-500" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Download Template</p>
            <p className="text-xs text-slate-400">Use our CSV template for correct format</p>
          </div>
          <button className="btn-outline text-xs px-4 py-2">Download</button>
        </div>

      </div>
    </DashboardLayout>
  );
}
