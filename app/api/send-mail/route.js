import nodemailer from "nodemailer";
import db from "../../lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const { to_email, student_id, pdf_base64 } = await req.json();

    if (!to_email || !student_id || !pdf_base64) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    let base64Data = pdf_base64;

    if (pdf_base64.startsWith("data:application/pdf")) {
      base64Data = pdf_base64.split("base64,")[1];
    }

    if (!base64Data) {
      return Response.json(
        { success: false, message: "Invalid PDF data" },
        { status: 400 }
      );
    }

    const pdfBuffer = Buffer.from(base64Data, "base64");

    const relativeDir = path.join("public", "student", "admit_card", String(student_id));
    const absoluteDir = path.join(process.cwd(), relativeDir);

    await mkdir(absoluteDir, { recursive: true });

    const fileName = "admitcard.pdf";
    const absoluteFilePath = path.join(absoluteDir, fileName);

    await writeFile(absoluteFilePath, pdfBuffer);

    const publicUrl = `/student/admit_card/${student_id}/${fileName}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const fullUrl = `${baseUrl}${publicUrl}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"Amar Jyoti Institute" <${process.env.SMTP_EMAIL}>`,
      to: to_email,
      subject: "BPT Entrance Examination 2026 — Admit Card",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">       
        <div style="padding: 24px; background: #F9FAFB;">
          <p>Dear Candidate,</p>
          <p>Your admit card for BPT Entrance Examination 2026 is ready.</p>          
        </div>
     
        
      </div>
      `,



      //  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      //   <div style="background: #1E3A5F; padding: 24px; text-align: center;">
      //     <h2 style="color: #fff; margin: 0;">Amar Jyoti Institute of Physiotherapy</h2>
      //     <p style="color: #93C5FD; margin: 6px 0 0;">(University of Delhi)</p>
      //   </div>
      //   <div style="padding: 24px; background: #F9FAFB;">
      //     <p>Dear Candidate,</p>
      //     <p>Your admit card for BPT Entrance Examination 2026 is ready.</p>
      //     <a href="${fullUrl}" style="display:inline-block;margin-top:16px;padding:12px 20px;background:#2563EB;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">
      //       Download Admit Card
      //     </a>
      //     <p style="margin-top:16px;">Or copy this link:<br/>
      //       <span style="color:#2563EB">${fullUrl}</span>
      //     </p>
      //     <p style="margin-top:16px;">
      //       <strong>Date:</strong> 30th August 2026<br/>
      //       <strong>Time:</strong> 10:00 AM – 12:00 Noon
      //     </p>
      //   </div>
      //   <div style="padding: 16px; text-align: center; font-size: 12px; color: #6B7280;">
      //     011-22379827 | info@ajipt.org
      //   </div>
      // </div>
      attachments: [
        {
          filename: "AdmitCard_BPT2026.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    if (info.messageId) {
      await db.query(
        `UPDATE students 
         SET admit_card = ?, send_admit_card = 'Sent' 
         WHERE id = ?`,
        [publicUrl, student_id]
      );
    }

    return Response.json({
      success: true,
      admit_card_url: fullUrl,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}