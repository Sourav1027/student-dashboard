import db from "../../lib/db";

export async function GET() {
  try {
    
    return Response.json({ success: 'DB connection successfull' });
  } catch (err) {
    console.log(err);
    return Response.json({ error: "DB connection failed" }, { status: 500 });
  }
}