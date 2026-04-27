import { NextResponse } from "next/server";
import db from "../../lib/db";

export async function PATCH(req) {
  try {
    const body = await req.json();

    const { id, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Student id required" },
        { status: 400 }
      );
    }

    await db.query(
      "UPDATE students SET status = ? WHERE id = ?",
      [status, id]
    );

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}