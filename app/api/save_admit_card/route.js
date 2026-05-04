import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { roll_no, fileName, pdf_base64 } = await req.json();

    const base64Data = pdf_base64.replace(
      /^data:application\/pdf;base64,/,
      ""
    );

    const dirPath = path.join(
      process.cwd(),
      "public",
      "student",
      "admit_card",
      String(roll_no)
    );

    fs.mkdirSync(dirPath, { recursive: true });

    const filePath = path.join(dirPath, fileName);
    fs.writeFileSync(filePath, base64Data, "base64");

    const fileUrl =
      process.env.NEXT_PUBLIC_BASE_URL +
      `/student/admit_card/${roll_no}/${fileName}`;

    await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/update-admit-card",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roll_no,
          file_url: fileUrl,
        }),
      }
    );

    return Response.json({
      success: true,
      url: fileUrl,
    });
  } catch {
    return Response.json({ success: false, error: "Save failed" });
  }
}