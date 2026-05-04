"use client";
import { useState, useMemo, useEffect } from "react";
const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
import ExcelJS from "exceljs";
import {
  MoreVertical,
  Eye,
  Send,
  FileSpreadsheet,
  User,
  PenTool,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
} from "lucide-react";
import AdmitCard from "./AdmitCard";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ITEMS_PER_PAGE = 10;

// ─── Image URL la base64 madhye convert karo (CORS fix) ───────────────────────
const urlToBase64 = async (url) => {
  if (!url) return null;
  // Already base64 asel tar direct return karo
  if (url.startsWith("data:")) return url;
  try {
    const res = await fetch(url);
    if (!res.ok) return url;
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(url); // fallback
      reader.readAsDataURL(blob);
    });
  } catch {
    return url; // fallback: original URL
  }
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const isSent = status?.includes("Sent");
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: 20,
        background: isSent ? "#ECFDF5" : "#FFFBEB",
        color: isSent ? "#059669" : "#D97706",
        border: `1px solid ${isSent ? "#A7F3D0" : "#FDE68A"}`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: isSent ? "#10B981" : "#F59E0B",
          display: "inline-block",
        }}
      />
      {isSent ? "Sent" : "Pending"}
    </span>
  );
};

const RollBadge = ({ value }) => (
  <span style={{ fontSize: 14, fontWeight: 500 }}>{value}</span>
);

const AvatarBox = ({ src, type }) => {
  if (src)
    return (
      <img
        src={src}
        alt=""
        style={{
          width: type === "photo" ? 34 : 64,
          height: type === "photo" ? 42 : 26,
          objectFit: type === "photo" ? "cover" : "contain",
          borderRadius: 5,
          border: "1px solid #E5E7EB",
        }}
      />
    );
  const Icon = type === "photo" ? User : PenTool;
  return (
    <div
      style={{
        width: type === "photo" ? 34 : 52,
        height: type === "photo" ? 42 : 26,
        background: "#F9FAFB",
        border: "1px dashed #D1D5DB",
        borderRadius: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon size={13} color="#9CA3AF" />
    </div>
  );
};

const AlertModal = ({ message, onClose }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15,23,42,0.6)",
      backdropFilter: "blur(4px)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    onClick={onClose}
  >
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #E5E7EB",
        padding: "32px 28px 24px",
        width: 340,
        textAlign: "center",
        boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "#FEF2F2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}
      >
        <AlertCircle size={24} color="#DC2626" />
      </div>
      <p
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#111827",
          margin: "0 0 8px",
          fontFamily: "'Bricolage Grotesque', sans-serif",
        }}
      >
        No data in file
      </p>
      <p
        style={{
          fontSize: 13,
          color: "#6B7280",
          margin: "0 0 24px",
          fontFamily: "'Bricolage Grotesque', sans-serif",
          lineHeight: 1.5,
        }}
      >
        {message}
      </p>
      <button
        onClick={onClose}
        style={{
          background: "#1E3A5F",
          color: "#fff",
          border: "none",
          borderRadius: 9,
          padding: "10px 32px",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "'Bricolage Grotesque', sans-serif",
        }}
      >
        OK
      </button>
    </div>
  </div>
);

const ConfirmModal = ({ count, onConfirm, onCancel }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15,23,42,0.6)",
      backdropFilter: "blur(4px)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    onClick={onCancel}
  >
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #E5E7EB",
        padding: "32px 28px 24px",
        width: 360,
        textAlign: "center",
        boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "#FEF2F2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}
      >
        <Trash2 size={24} color="#DC2626" />
      </div>
      <p
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#111827",
          margin: "0 0 8px",
          fontFamily: "'Bricolage Grotesque', sans-serif",
        }}
      >
        Delete {count} student{count > 1 ? "s" : ""}?
      </p>
      <p
        style={{
          fontSize: 13,
          color: "#6B7280",
          margin: "0 0 24px",
          fontFamily: "'Bricolage Grotesque', sans-serif",
          lineHeight: 1.5,
        }}
      >
        This action cannot be undone. The selected student{count > 1 ? "s" : ""}{" "}
        will be permanently removed.
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button
          onClick={onCancel}
          style={{
            background: "#fff",
            color: "#374151",
            border: "1px solid #E5E7EB",
            borderRadius: 9,
            padding: "10px 28px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Bricolage Grotesque', sans-serif",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            background: "#DC2626",
            color: "#fff",
            border: "none",
            borderRadius: 9,
            padding: "10px 28px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Bricolage Grotesque', sans-serif",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [admitCardStudent, setAdmitCardStudent] = useState(null);
  const [showAdmitCard, setShowAdmitCard] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [sendingIndex, setSendingIndex] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [alertModal, setAlertModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const formatStudents = (list) =>
    list.map((s) => ({
      id: s.id,
      Roll_No: s.roll_no,
      Reference_No: s.reference_no,
      First_Name: s.fname,
      Last_Name: s.lname,
      Name: `${s.fname} ${s.lname}`,
      Email: s.email,
      Phone: s.phone,
      Course: s.course,
      Category: s.category,
      photo: s.photo,
      signature: s.signature,
      send_admit_card: s.send_admit_card,
    }));

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/students");
        const data = await res.json();
        if (data.students) {
          setStudents(formatStudents(data.students));
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchStudents();
  }, []);

  const refreshStudents = async () => {
    const res = await fetch("/api/students");
    const fresh = await res.json();
    if (fresh.students) setStudents(formatStudents(fresh.students));
  };

  const uploadImage = async (base64, name, type) => {
    const res = await fetch("/api/student_upload_img", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64, name, type }),
    });
    const data = await res.json();
    return data.url;
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  // ─── Import Excel ────────────────────────────────────────────────────────────
  const importFromExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsImporting(true);
    const workbook = new ExcelJS.Workbook();
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        await workbook.xlsx.load(event.target.result);
        const ws = workbook.worksheets[0];
        const data = [];

        ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1) return;
          data.push({
            id: rowNumber,
            Roll_No: row.getCell(1).value?.toString() || "",
            Reference_No: row.getCell(2).value?.toString() || "",
            First_Name: row.getCell(3).value?.toString() || "",
            Last_Name: row.getCell(4).value?.toString() || "",
            Email:
              row.getCell(5).value?.text ||
              row.getCell(5).value?.toString() ||
              "",
            Phone: row.getCell(6).value?.toString() || "",
            Course: row.getCell(7).value?.toString() || "",
            Category: row.getCell(8).value?.toString() || "",
            photo: null,
            signature: null,
            send_admit_card: "Pending",
          });
        });

        if (!data.length) {
          setAlertModal({
            message:
              "The uploaded Excel file appears to be empty. Please check your file and try again.",
          });
          setIsImporting(false);
          e.target.value = "";
          return;
        }

        const images = ws.getImages();
        for (const img of images) {
          const imgData = workbook.model.media.find(
            (m) => m.index === img.imageId,
          );
          const rowIdx = img.range.tl.nativeRow;
          const colIdx = img.range.tl.nativeCol;

          if (imgData && data[rowIdx - 1]) {
            const base64 = `data:image/${imgData.extension};base64,${imgData.buffer.toString("base64")}`;
            const student = data[rowIdx - 1];
            if (colIdx === 8)
              student.photo = await uploadImage(
                base64,
                student.First_Name,
                "photo",
              );
            if (colIdx === 9)
              student.signature = await uploadImage(
                base64,
                student.First_Name,
                "sign",
              );
          }
        }

        setStudents(data);
        setCurrentPage(1);

        await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ students: data }),
        });

        showToast(`${data.length} students imported successfully`);
      } catch (err) {
        showToast("Import failed", "error");
      } finally {
        setIsImporting(false);
        e.target.value = "";
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // ─── Filter + Pagination ─────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchQ =
        !q ||
        (s.Name || "").toLowerCase().includes(q) ||
        (s.Roll_No || "").toLowerCase().includes(q) ||
        (s.Email || "").toLowerCase().includes(q);
      const matchS =
        statusFilter === "all" ||
        (statusFilter === "sent" &&
          (s.send_admit_card || "").includes("Sent")) ||
        (statusFilter === "pending" &&
          !(s.send_admit_card || "").includes("Sent"));
      return matchQ && matchS;
    });
  }, [students, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const sentCount = students.filter((s) =>
    (s.send_admit_card || "").includes("Sent"),
  ).length;
  const pendingCount = students.filter(
    (s) => !(s.send_admit_card || "").includes("Sent"),
  ).length;

  // ─── PDF Generation — FIXED ──────────────────────────────────────────────────
  const generatePdfBlob = async (studentData) => {
    // STEP 1: Photo + Signature la base64 madhye convert karo — CORS issue fix
    const processedStudent = { ...studentData };
    if (processedStudent.photo) {
      processedStudent.photo = await urlToBase64(processedStudent.photo);
    }
    if (processedStudent.signature) {
      processedStudent.signature = await urlToBase64(
        processedStudent.signature,
      );
    }

    // STEP 2: Off-screen container banav
    // IMPORTANT: position:absolute use karo, fixed nahi — html2canvas la fixed elements diste nahi
    const container = document.createElement("div");
    container.style.cssText = [
      "position:absolute",
      "left:-9999px",
      "top:0",
      "width:794px", // 210mm @ 96dpi ≈ 794px
      "background:white",
      "z-index:-1",
      "overflow:visible",
    ].join(";");
    document.body.appendChild(container);

    // STEP 3: React component render karo
    const { createRoot } = await import("react-dom/client");
    const root = createRoot(container);
    root.render(<AdmitCard student={processedStudent} />);

    // STEP 4: Fonts wait + images wait
    await document.fonts.ready;

    // Images load honyasathi wait
    await new Promise((resolve) => {
      const checkImages = () => {
        const imgs = Array.from(container.querySelectorAll("img"));
        if (imgs.length === 0) return resolve();
        const pending = imgs.filter(
          (img) => !img.complete || img.naturalWidth === 0,
        );
        if (pending.length === 0) return resolve();
        let loaded = 0;
        pending.forEach((img) => {
          const done = () => {
            loaded++;
            if (loaded === pending.length) resolve();
          };
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        });
      };
      // React render complete honyasathi thoda vel dya
      setTimeout(checkImages, 300);
    });

    // STEP 5: Extra settle time (layout, fonts render)
    await new Promise((r) => setTimeout(r, 500));

    // STEP 6: html2canvas — allowTaint:true base64 images sathi
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: container.scrollWidth,
      height: container.scrollHeight,
      windowWidth: container.scrollWidth,
      windowHeight: container.scrollHeight,
    });

    // STEP 7: Cleanup
    root.unmount();
    document.body.removeChild(container);

    // STEP 8: PDF banav
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const imgWidthPx = canvas.width;
    const imgHeightPx = canvas.height;

    // A4 dimensions in mm
    const a4W = 210;
    const a4H = 297;

    // Canvas aspect ratio pramaane height calculate karo
    const imgHeightMm = (imgHeightPx * a4W) / imgWidthPx;

    // Admit card = always single page
    // Content A4 peksha jaast asel tar shrink karun fit karo — extra page nahi
    const finalH = Math.min(imgHeightMm, a4H);

    // jsPDF — safe import (default export handle karo)
    let JsPDF;
    try {
      const mod = await import("jspdf");
      JsPDF = mod.default || mod.jsPDF;
    } catch {
      JsPDF = jsPDF; // top-level import fallback
    }

    const pdf = new JsPDF("p", "mm", "a4");
    // Single addImage call — guaranteed ek page
    pdf.addImage(imgData, "JPEG", 0, 0, a4W, finalH);

    return {
      blob: pdf.output("blob"),
      dataUrl: pdf.output("datauristring"),
    };
  };

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleViewAdmitCard = (student) => {
    setAdmitCardStudent(student);
    setShowAdmitCard(true);
    setOpenDropdown(null);
  };

  const handleDownloadPdf = async (student) => {
  setPdfLoading(student.id);
  setOpenDropdown(null);

  try {
    const { blob } = await generatePdfBlob(student);
    const base64 = await blobToBase64(blob);

    await fetch("/api/save_admit_card", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roll_no: student.Roll_No,
        fileName: `AdmitCard_${student.Roll_No}.pdf`,
        pdf_base64: base64,
      }),
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AdmitCard_${student.Roll_No}.pdf`;
    a.click();
    URL.revokeObjectURL(url);

    showToast(`PDF saved & downloaded for ${student.Roll_No}`);
  } catch (err) {
    console.error(err);
    showToast("PDF failed", "error");
  }

  setPdfLoading(null);
};

  const handleSendEmail = async (studentId) => {
    const student = students.find((s) => s.id === studentId);
    setSendingIndex(studentId);
    setOpenDropdown(null);

    try {
      const { dataUrl } = await generatePdfBlob(student);

      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to_email: student.Email,
          student_id: student.id,
          pdf_base64: dataUrl,
        }),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, send_admit_card: "Sent" } : s,
        ),
      );

      showToast(`Admit card sent to ${student.Name}`);
    } catch (err) {
      console.error(err);
      showToast("Failed to send email", "error");
    }

    setSendingIndex(null);
  };

  const handleDeleteSelected = async () => {
    setIsDeletingAll(true);
    setConfirmDelete(false);
    const ids = Array.from(selectedIds);
    let successCount = 0;
    for (const id of ids) {
      try {
        const res = await fetch("/api/delete_student", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: "0" }),
        });
        const data = await res.json();
        if (data.success) successCount++;
      } catch {}
    }
    await refreshStudents();
    setSelectedIds(new Set());
    setIsDeletingAll(false);
    showToast(
      successCount === ids.length
        ? `${successCount} student${successCount > 1 ? "s" : ""} deleted successfully`
        : `${successCount} of ${ids.length} deleted. Some failed.`,
      successCount === ids.length ? "success" : "error",
    );
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const pageIds = paginated.map((s) => s.id);
    const allSelected = pageIds.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const st = styles;

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Bricolage+Grotesque:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'Bricolage Grotesque', sans-serif; }
        input[type="checkbox"] { accent-color: #2563EB; cursor: pointer; width: 15px; height: 15px; }
        .row-hover:hover { background: #F8FAFC !important; }
        .btn-action:hover { background: #F1F5F9 !important; border-color: #CBD5E1 !important; }
        .dd-item:hover { background: #F8FAFC !important; }
        .dd-item-danger:hover { background: #FEF2F2 !important; color: #DC2626 !important; }
        .dd-item-accent:hover { background: #EFF6FF !important; color: #2563EB !important; }
        .page-btn-num:hover { background: #EFF6FF; border-color: #BFDBFE; color: #2563EB; }
        .tab-btn:hover { color: #1E3A5F !important; }
        .modal-close-btn:hover { border-color: #FCA5A5 !important; background: #FEF2F2 !important; color: #DC2626 !important; }
        .modal-dl-btn:hover { background: #F8FAFC !important; }
        .modal-send-btn:hover { opacity: 0.88; }
        .delete-all-btn:hover { background: #FEF2F2 !important; border-color: #FECACA !important; color: #DC2626 !important; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }
      `}</style>

      <div style={st.page}>
        {/* ── Header ── */}
        <div style={st.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={st.logoBox}>
              <FileSpreadsheet size={18} color="#2563EB" />
            </div>
            <div>
              <h1 style={st.title}>Student Database</h1>
              <p style={st.subtitle}>
                {students.length > 0
                  ? `${students.length} records · ${sentCount} sent · ${pendingCount} pending`
                  : "Import an Excel file to get started"}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {students.length > 0 && (
              <div style={{ display: "flex", gap: 8 }}>
                <div style={st.statChip}>
                  <CheckCircle2 size={13} color="#10B981" />
                  <span style={{ color: "#374151", fontSize: 12 }}>
                    <b>{sentCount}</b> Sent
                  </span>
                </div>
                <div style={st.statChip}>
                  <Clock size={13} color="#F59E0B" />
                  <span style={{ color: "#374151", fontSize: 12 }}>
                    <b>{pendingCount}</b> Pending
                  </span>
                </div>
              </div>
            )}
            <label style={st.importBtn}>
              {isImporting ? (
                <>
                  <Loader2
                    size={15}
                    style={{ animation: "spin 1s linear infinite" }}
                  />{" "}
                  Processing…
                </>
              ) : (
                <>
                  <FileSpreadsheet size={15} /> Import Excel
                </>
              )}
              <input
                type="file"
                accept=".xlsx"
                style={{ display: "none" }}
                onChange={importFromExcel}
                disabled={isImporting}
              />
            </label>
          </div>
        </div>

        {/* ── Toolbar ── */}
        {students.length > 0 && (
          <div style={st.toolbar}>
            <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
              <Search
                size={14}
                color="#9CA3AF"
                style={{
                  position: "absolute",
                  left: 11,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                style={st.searchInput}
                placeholder="Search name, roll no, email…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["all", "pending", "sent"].map((f) => (
                <button
                  key={f}
                  className="tab-btn"
                  onClick={() => {
                    setStatusFilter(f);
                    setCurrentPage(1);
                  }}
                  style={{
                    ...st.tabBtn,
                    ...(statusFilter === f ? st.tabActive : {}),
                  }}
                >
                  {f === "all" ? "All" : f === "pending" ? "Pending" : "Sent"}
                </button>
              ))}
            </div>
            {selectedIds.size > 0 && (
              <div style={{ display: "flex", gap: 8 }}>
                <button style={st.batchBtn}>
                  <Send size={13} /> Send {selectedIds.size} Selected
                </button>
                <button
                  className="delete-all-btn"
                  disabled={isDeletingAll}
                  onClick={() => setConfirmDelete(true)}
                  style={st.deleteAllBtn}
                >
                  {isDeletingAll ? (
                    <Loader2
                      size={13}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  ) : (
                    <Trash2 size={13} />
                  )}
                  Delete {selectedIds.size} Selected
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Table ── */}
        <div style={st.card}>
          <div style={{ overflowX: "auto" }}>
            <table style={st.table}>
              <thead>
                <tr style={st.thead}>
                  {students.length > 0 && (
                    <th style={{ ...st.th, width: 44, paddingLeft: 20 }}>
                      <input
                        type="checkbox"
                        checked={
                          paginated.length > 0 &&
                          paginated.every((s) => selectedIds.has(s.id))
                        }
                        onChange={toggleSelectAll}
                      />
                    </th>
                  )}
                  <th style={st.th}>Roll No</th>
                  <th style={st.th}>Name</th>
                  <th style={st.th}>Email</th>
                  <th style={st.th}>Course</th>
                  <th style={st.th}>Photo</th>
                  <th style={st.th}>Signature</th>
                  <th style={st.th}>Status</th>
                  <th style={{ ...st.th, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: 0, border: "none" }}>
                      <div
                        style={{ padding: "64px 24px", textAlign: "center" }}
                      >
                        <div
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: 14,
                            background: "#F9FAFB",
                            border: "1px solid #E5E7EB",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 14px",
                          }}
                        >
                          <FileSpreadsheet size={28} color="#9CA3AF" />
                        </div>
                        <p
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: "#374151",
                            margin: "0 0 5px",
                          }}
                        >
                          {students.length === 0
                            ? "No students imported yet"
                            : "No results found"}
                        </p>
                        <p
                          style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}
                        >
                          {students.length === 0
                            ? "Upload an .xlsx file using the Import button above"
                            : "Try adjusting your search or filter"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((student, idx) => (
                    <tr
                      key={student.id}
                      className="row-hover"
                      style={{
                        ...st.tr,
                        background: selectedIds.has(student.id)
                          ? "#EFF6FF"
                          : idx % 2 === 0
                            ? "#FFFFFF"
                            : "#FAFAFA",
                      }}
                    >
                      <td style={{ ...st.td, paddingLeft: 20, width: 44 }}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(student.id)}
                          onChange={() => toggleSelect(student.id)}
                        />
                      </td>
                      <td style={st.td}>
                        <RollBadge value={student.Roll_No} />
                      </td>
                      <td
                        style={{ ...st.td, fontWeight: 600, color: "#111827" }}
                      >
                        {student.First_Name} {student.Last_Name}
                      </td>
                      <td
                        style={{
                          ...st.td,
                          fontFamily: "'DM Mono',monospace",
                          fontSize: 11,
                          color: "#6B7280",
                        }}
                      >
                        {student.Email}
                      </td>
                      <td style={{ ...st.td, fontSize: 12, color: "#6B7280" }}>
                        {student.Course}
                      </td>
                      <td style={st.td}>
                        <AvatarBox src={student.photo} type="photo" />
                      </td>
                      <td style={st.td}>
                        <AvatarBox src={student.signature} type="sig" />
                      </td>
                      <td style={st.td}>
                        <StatusBadge status={student.send_admit_card} />
                      </td>
                      <td
                        style={{
                          ...st.td,
                          textAlign: "center",
                          position: "relative",
                        }}
                      >
                        <button
                          className="btn-action"
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === student.id ? null : student.id,
                            )
                          }
                          style={st.actionBtn}
                        >
                          {sendingIndex === student.id ? (
                            <Loader2
                              size={15}
                              style={{
                                animation: "spin 1s linear infinite",
                                color: "#6B7280",
                              }}
                            />
                          ) : (
                            <MoreVertical size={15} color="#6B7280" />
                          )}
                        </button>

                        {openDropdown === student.id && (
                          <div
                            style={st.dropdown}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="dd-item"
                              style={{ ...st.ddItem, color: "#111827" }}
                              onClick={() => handleViewAdmitCard(student)}
                            >
                              <Eye size={13} color="#6B7280" /> View Admit Card
                            </button>
                            {/* <button
                              className="dd-item dd-item-accent"
                              style={{ ...st.ddItem, color: "#2563EB" }}
                              onClick={() => handleSendEmail(student.id)}
                              disabled={sendingIndex === student.id}
                            >
                              <Send size={13} /> Send Email
                            </button>
                            <div style={st.ddDivider} /> */}
                            <button
                              className="dd-item"
                              style={{ ...st.ddItem, color: "#374151" }}
                              onClick={() => handleDownloadPdf(student)}
                            >
                              {pdfLoading === student.id ? (
                                <Loader2
                                  size={13}
                                  style={{
                                    animation: "spin 1s linear infinite",
                                  }}
                                />
                              ) : (
                                <Download size={13} />
                              )}
                              Download PDF
                            </button>
                            <div style={st.ddDivider} />
                            <button
                              className="dd-item dd-item-danger"
                              style={{ ...st.ddItem, color: "#EF4444" }}
                              onClick={async () => {
                                try {
                                  const res = await fetch(
                                    "/api/delete_student",
                                    {
                                      method: "PATCH",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        id: student.id,
                                        status: "0",
                                      }),
                                    },
                                  );
                                  const data = await res.json();
                                  if (data.success) {
                                    showToast(
                                      "Student removed successfully",
                                      "success",
                                    );
                                    await refreshStudents();
                                  } else {
                                    showToast(
                                      "Failed to remove student",
                                      "error",
                                    );
                                  }
                                } catch {
                                  showToast("Server error", "error");
                                }
                                setOpenDropdown(null);
                              }}
                            >
                              <X size={13} /> Remove
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filtered.length > ITEMS_PER_PAGE && (
            <div style={st.pagination}>
              <span style={st.pageInfo}>
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of{" "}
                {filtered.length}
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  style={st.pageBtn}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - currentPage) <= 1,
                  )
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && arr[i - 1] !== p - 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "…" ? (
                      <span
                        key={`e${i}`}
                        style={{
                          padding: "0 4px",
                          color: "#9CA3AF",
                          lineHeight: "30px",
                        }}
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        className={p === currentPage ? "" : "page-btn-num"}
                        onClick={() => setCurrentPage(p)}
                        style={{
                          ...st.pageBtn,
                          ...(p === currentPage ? st.pageBtnActive : {}),
                        }}
                      >
                        {p}
                      </button>
                    ),
                  )}
                <button
                  style={st.pageBtn}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dropdown overlay */}
      {openDropdown !== null && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 40 }}
          onClick={() => setOpenDropdown(null)}
        />
      )}

      {/* Admit Card Modal */}
      {showAdmitCard && admitCardStudent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 200,
            overflowY: "auto",
            padding: "24px 16px 48px",
          }}
          onClick={() => setShowAdmitCard(false)}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 210,
              display: "flex",
              justifyContent: "center",
              gap: 10,
              marginBottom: 20,
              padding: "8px 0",
            }}
          >
            <button
              className="modal-dl-btn"
              style={st.modalActionBtn}
              onClick={async (e) => {
                e.stopPropagation();
                await handleDownloadPdf(admitCardStudent);
              }}
            >
              {pdfLoading === admitCardStudent.id ? (
                <>
                  <Loader2
                    size={14}
                    style={{ animation: "spin 1s linear infinite" }}
                  />{" "}
                  Generating…
                </>
              ) : (
                <>
                  <Download size={14} /> Download PDF
                </>
              )}
            </button>
            <button
              className="modal-send-btn"
              style={{
                ...st.modalActionBtn,
                background: "#2563EB",
                border: "1px solid #2563EB",
                color: "#fff",
              }}
              onClick={async (e) => {
                e.stopPropagation();
                await handleSendEmail(admitCardStudent.id);
              }}
              disabled={sendingIndex === admitCardStudent.id}
            >
              {sendingIndex === admitCardStudent.id ? (
                <>
                  <Loader2
                    size={14}
                    style={{ animation: "spin 1s linear infinite" }}
                  />{" "}
                  Sending…
                </>
              ) : (
                <>
                  <Send size={14} /> Send Email
                </>
              )}
            </button>
            <button
              className="modal-close-btn"
              style={st.modalCloseBtn}
              onClick={(e) => {
                e.stopPropagation();
                setShowAdmitCard(false);
              }}
            >
              <X size={15} /> Close
            </button>
          </div>
          <div
            style={{
              maxWidth: "210mm",
              margin: "0 auto",
              borderRadius: 6,
              overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AdmitCard student={admitCardStudent} />
          </div>
        </div>
      )}

      {alertModal && (
        <AlertModal
          message={alertModal.message}
          onClose={() => setAlertModal(null)}
        />
      )}
      {confirmDelete && (
        <ConfirmModal
          count={selectedIds.size}
          onConfirm={handleDeleteSelected}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            zIndex: 9999,
            background: toast.type === "error" ? "#FEF2F2" : "#F0FDF4",
            border: `1px solid ${toast.type === "error" ? "#FECACA" : "#BBF7D0"}`,
            borderRadius: 10,
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: 9,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 13,
            color: toast.type === "error" ? "#991B1B" : "#14532D",
            animation: "slideUp 0.25s ease",
            pointerEvents: "none",
          }}
        >
          {toast.type === "error" ? (
            <AlertCircle size={15} color="#DC2626" />
          ) : (
            <CheckCircle2 size={15} color="#16A34A" />
          )}
          {toast.msg}
        </div>
      )}
    </>
  );
}

const styles = {
  page: {
    padding: "28px 32px",
    background: "#F8FAFC",
    minHeight: "100vh",
    fontFamily: "'Bricolage Grotesque', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 14,
  },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    background: "#EFF6FF",
    border: "1px solid #BFDBFE",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
    letterSpacing: "-0.3px",
  },
  subtitle: { fontSize: 12, color: "#6B7280", margin: "2px 0 0" },
  statChip: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    padding: "6px 12px",
  },
  importBtn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "#1E3A5F",
    color: "#fff",
    border: "none",
    borderRadius: 9,
    padding: "9px 18px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Bricolage Grotesque', sans-serif",
    letterSpacing: "-0.1px",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  searchInput: {
    width: "100%",
    padding: "9px 12px 9px 34px",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    fontSize: 13,
    color: "#374151",
    outline: "none",
    background: "#fff",
    fontFamily: "'Bricolage Grotesque', sans-serif",
  },
  tabBtn: {
    background: "transparent",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    color: "#6B7280",
    fontFamily: "'Bricolage Grotesque', sans-serif",
    transition: "all 0.12s",
  },
  tabActive: {
    background: "#EFF6FF",
    border: "1px solid #BFDBFE",
    color: "#2563EB",
  },
  batchBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Bricolage Grotesque', sans-serif",
  },
  deleteAllBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#fff",
    color: "#EF4444",
    border: "1px solid #FECACA",
    borderRadius: 8,
    padding: "8px 16px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Bricolage Grotesque', sans-serif",
    transition: "all 0.12s",
  },
  card: {
    background: "#fff",
    borderRadius: 14,
    border: "1px solid #E5E7EB",
    overflow: "hidden",
    boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
  },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 900 },
  thead: { background: "#F8FAFC", borderBottom: "1px solid #E5E7EB" },
  th: {
    padding: "11px 14px",
    fontSize: 10,
    fontWeight: 600,
    color: "#6B7280",
    textAlign: "left",
    letterSpacing: "0.7px",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  tr: { borderBottom: "1px solid #F3F4F6", transition: "background 0.1s" },
  td: { padding: "12px 14px", fontSize: 13, verticalAlign: "middle" },
  actionBtn: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 7,
    width: 30,
    height: 30,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.12s",
  },
  dropdown: {
    position: "absolute",
    right: 36,
    top: "50%",
    transform: "translateY(-50%)",
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 10,
    width: 178,
    zIndex: 60,
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
    padding: "4px 0",
  },
  ddItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 14px",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    background: "transparent",
    border: "none",
    width: "100%",
    textAlign: "left",
    fontFamily: "'Bricolage Grotesque', sans-serif",
    transition: "background 0.1s",
  },
  ddDivider: { height: 1, background: "#F3F4F6", margin: "3px 0" },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 20px",
    borderTop: "1px solid #F3F4F6",
    background: "#FAFAFA",
    flexWrap: "wrap",
    gap: 10,
  },
  pageInfo: { fontSize: 12, color: "#6B7280" },
  pageBtn: {
    width: 32,
    height: 32,
    borderRadius: 7,
    background: "#fff",
    border: "1px solid #E5E7EB",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    color: "#374151",
    cursor: "pointer",
    transition: "all 0.12s",
  },
  pageBtnActive: {
    background: "#2563EB",
    color: "#fff",
    border: "1px solid #2563EB",
    fontWeight: 700,
  },
  modalActionBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    background: "#fff",
    border: "1px solid #D1D5DB",
    borderRadius: 9,
    padding: "9px 20px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    color: "#1E3A5F",
    fontFamily: "'Bricolage Grotesque', sans-serif",
    boxShadow: "0 2px 12px rgba(0,0,0,0.14)",
    transition: "all 0.15s",
  },
  modalCloseBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    background: "#fff",
    border: "1px solid #D1D5DB",
    borderRadius: 9,
    padding: "9px 18px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    color: "#6B7280",
    fontFamily: "'Bricolage Grotesque', sans-serif",
    boxShadow: "0 2px 12px rgba(0,0,0,0.14)",
    transition: "all 0.15s",
  },
};
