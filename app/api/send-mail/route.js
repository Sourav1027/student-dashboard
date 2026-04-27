import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { to_email } = await req.json();

    if (!to_email) {
      return Response.json(
        { success: false, message: "Email required" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Test Mail <onboarding@resend.dev>",
      to: to_email,
      subject: "Hello",
     html: `
  <h2>Hello ${student_name} 👋</h2>
  <p>Your admit card is ready.</p>
  <p>Check attachment below.</p>
`,
    });

    return Response.json({ success: true, message: "Sent" });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}