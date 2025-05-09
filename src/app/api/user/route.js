import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/user";
import { connectToDB } from "@/utils/db";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  try {
    await connectToDB();
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.profile.name,
      email: user.email,
      progress: user.stats?.problemsSolved || {},
    });
  } catch (err) {
    console.error("JWT Error:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
