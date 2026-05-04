import db from "../../lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT 
        id,
        roll_no,
        reference_no,
        fname,
        lname,
        course,
        category,
        email,
        phone,
        photo,
        signature,
        admit_card,
        send_admit_card
       FROM students  WHERE status = '1'
       ORDER BY id DESC`
    );

    return Response.json({ students: rows });
  } catch (err) {
    console.log(err);
    return Response.json({ error: "DB fetch error" }, { status: 500 });
  }
}
export async function POST(req) {
  try {
    const { students } = await req.json();

    if (!Array.isArray(students) || students.length === 0) {
      return Response.json({ error: "No data" }, { status: 400 });
    }

    const values = students.map((s) => [
      s.Roll_No || "",
      s.Reference_No || "",
      s.First_Name || "",
      s.Last_Name || "",
      s.Course || "",
      s.Category || "",
      s.Email || "",
      s.Phone || "",
      s.photo || null,
      s.signature || null,
      s.send_admit_card || "Pending",
    ]);

    await db.query(
      `INSERT INTO students 
      (roll_no, reference_no, fname, lname, course, category, email, phone, photo, signature, send_admit_card)
      VALUES ?`,
      [values]
    );

    return Response.json({ success: true });

  } catch (err) {
    console.log("POST ERROR:", err);
    return Response.json({ error: "DB error" }, { status: 500 });
  }


  
}