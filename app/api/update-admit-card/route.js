import db from "../../lib/db";

export async function POST(req) {
  try {
    const { roll_no, file_url } = await req.json();

    if (!roll_no || !file_url) {
      return Response.json({ success: false }, { status: 400 });
    }

    await db.query(
      `UPDATE students 
       SET admit_card = ?
       WHERE roll_no = ?`,
      [file_url, roll_no]
    );

    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}