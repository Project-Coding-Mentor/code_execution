import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import User from "@/models/User";
import { connectToDB } from "@/utils/db";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  const { email, password } = await req.json();

  await connectToDB();
  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

  
  const response = NextResponse.json({ message: "Login successful" });
  response.headers.set(
    "Set-Cookie",
    serialize("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
  );

  return response;
}
