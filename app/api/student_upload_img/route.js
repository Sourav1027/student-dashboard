import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { image, name, type } = await req.json();

    if (!image || !type) {
      return Response.json({ message: "Missing data" }, { status: 400 });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const fileName = `${Date.now()}_${name}.png`;

    const folder = type === "photo" ? "student/photo" : "student/sign";
    const dirPath = path.join(process.cwd(), "public", folder);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, fileName);
    fs.writeFileSync(filePath, base64Data, "base64");

    const base_url = "http://localhost:3000";
    const imageUrl = `${base_url}/${folder}/${fileName}`;

    return Response.json({ url: imageUrl });

  } catch (error) {
    return Response.json({ message: "Upload failed" }, { status: 500 });
  }
}