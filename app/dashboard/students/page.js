"use client";
import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { 
  MoreVertical, Eye, Send, FileSpreadsheet, User, 
  PenTool, Loader2, X, ChevronLeft, ChevronRight 
} from 'lucide-react';
import AdmitCard from './AdmitCard';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import emailjs from '@emailjs/browser';

const EMAILJS_PUBLIC_KEY = 'ogiJCCAuPwljsowSx';
const EMAILJS_SERVICE_ID = 'service_f2qzy1e';
const EMAILJS_TEMPLATE_ID = 'template_dmj6kiy';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [sendingIndex, setSendingIndex] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Ek page par kitne students dikhane hain

  const importFromExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsImporting(true);
    const workbook = new ExcelJS.Workbook();
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const buffer = event.target.result;
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.worksheets[0];
        const data = [];

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1) return;
          data.push({
            id: rowNumber, // Unique ID for tracking
            Roll_No: row.getCell(1).value?.toString() || "",
            Reference_No: row.getCell(2).value?.toString() || "",
            Name: row.getCell(3).value?.toString() || "",
            Course: row.getCell(4).value?.toString() || "",
            Email: row.getCell(5).value?.text || row.getCell(5).value?.toString() || "",
            Phone: row.getCell(6).value?.toString() || "",
            photo: null,
            signature: null,
            status: 'Pending'
          });
        });

        const images = worksheet.getImages();
        images.forEach((img) => {
          const imgData = workbook.model.media.find(m => m.index === img.imageId);
          const rowIdx = img.range.tl.nativeRow;
          const colIdx = img.range.tl.nativeCol;
          if (imgData && data[rowIdx - 1]) {
            const base64 = `data:image/${imgData.extension};base64,${imgData.buffer.toString('base64')}`;
            if (colIdx === 6) data[rowIdx - 1].photo = base64;
            if (colIdx === 7) data[rowIdx - 1].signature = base64;
          }
        });

        setStudents(data);
        setCurrentPage(1); // Reset to page 1 on new import
      } catch (err) {
        alert("Import error!");
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // --- Pagination Calculations ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = students.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(students.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setOpenDropdown(null);
  };

  // --- Rest of your PDF and Email logic (same as before) ---
  const generatePdfBlob = async (studentData) => {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;left:-9999px;top:0;width:210mm;background:white;';
    document.body.appendChild(container);
    const { createRoot } = await import('react-dom/client');
    const root = createRoot(container);
    root.render(<AdmitCard student={studentData} />);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const canvas = await html2canvas(container, { scale: 2, useCORS: true });
    root.unmount();
    document.body.removeChild(container);
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    return { blob: pdf.output('blob'), dataUrl: pdf.output('datauristring') };
  };

  const handleSendEmail = async (studentId) => {
    const studentIdx = students.findIndex(s => s.id === studentId);
    const student = students[studentIdx];
    setSendingIndex(studentId);
    try {
      const { dataUrl } = await generatePdfBlob(student);
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: student.Email,
        student_name: student.Name,
        pdf_attachment: dataUrl,
      }, EMAILJS_PUBLIC_KEY);

      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: 'Sent ✅' } : s));
    } catch (err) { alert('Email failed!'); }
    setSendingIndex(null);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Database</h1>
        <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition shadow-sm">
          {isImporting ? <Loader2 className="animate-spin" size={18} /> : <FileSpreadsheet size={18} />}
          <span>{isImporting ? "Processing..." : "Import Excel"}</span>
          <input type="file" accept=".xlsx" className="hidden" onChange={importFromExcel} disabled={isImporting} />
        </label>
      </div>

      <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="p-3 text-xs">Roll No</th>
                <th className="p-3 text-xs">Name</th>
                <th className="p-3 text-xs">Email</th>
                <th className="p-3 text-xs">Photo</th>
                <th className="p-3 text-xs">Signature</th>
                <th className="p-3 text-xs">Status</th>
                <th className="p-3 text-center text-xs">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentStudents.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50/50">
                  <td className="p-3 text-sm font-medium text-blue-600">{s.Roll_No}</td>
                  <td className="p-3 text-sm font-bold text-gray-800">{s.Name}</td>
                  <td className="p-3 text-sm text-gray-500 italic">{s.Email}</td>
                  <td className="p-3">
                    {s.photo ? <img src={s.photo} className="w-10 h-12 object-cover rounded border" alt="" /> : <User className="text-gray-300" />}
                  </td>
                  <td className="p-3">
                    {s.signature ? <img src={s.signature} className="w-16 h-8 object-contain rounded border" alt="" /> : <PenTool className="text-gray-300" />}
                  </td>
                  <td className="p-3 text-xs font-bold">{s.status}</td>
                  <td className="p-3 text-center relative">
                    <button onClick={() => setOpenDropdown(openDropdown === s.id ? null : s.id)} className="p-1.5 hover:bg-gray-200 rounded-full">
                      <MoreVertical size={18} />
                    </button>
                    {openDropdown === s.id && (
                      <div className="absolute right-8 top-0 mt-1 w-36 bg-white border shadow-2xl rounded-lg z-[60] py-2">
                        <button onClick={() => { setSelectedStudent(s); setShowModal(true); setOpenDropdown(null); }} className="w-full flex px-4 py-2 text-sm hover:bg-blue-50 gap-2"><Eye size={16}/> View</button>
                        <button onClick={() => handleSendEmail(s.id)} disabled={sendingIndex === s.id} className="w-full flex px-4 py-2 text-sm hover:bg-green-50 gap-2">
                          {sendingIndex === s.id ? <Loader2 size={16} className="animate-spin" /> : <Send size={16}/>} Send
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Pagination Controls --- */}
        {students.length > 0 && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-top border-gray-200">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, students.length)}</span> of <span className="font-medium">{students.length}</span> results
            </div>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
                className="p-2 rounded border bg-white disabled:opacity-50 hover:bg-gray-100 transition"
              >
                <ChevronLeft size={20} />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 rounded border transition ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`}
                >
                  {i + 1}
                </button>
              )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
                className="p-2 rounded border bg-white disabled:opacity-50 hover:bg-gray-100 transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center overflow-y-auto p-8 z-[100]">
          <div className="relative">
            <div className="fixed top-5 right-10 flex gap-3 z-[110]">
              <button onClick={() => {
                setPdfLoading(true);
                generatePdfBlob(selectedStudent).then(({blob}) => {
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `AdmitCard_${selectedStudent.Name}.pdf`;
                  a.click();
                  setPdfLoading(false);
                });
              }} disabled={pdfLoading} className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold">
                {pdfLoading ? "Wait..." : "Download PDF"}
              </button>
              <button onClick={() => setShowModal(false)} className="bg-red-600 text-white px-5 py-2 rounded-full font-bold">Close ✕</button>
            </div>
            <AdmitCard student={selectedStudent} />
          </div>
        </div>
      )}
    </div>
  );
}