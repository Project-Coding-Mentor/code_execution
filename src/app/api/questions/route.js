import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { QuestionsDB } from "@/lib/questionsdb";
import { Questions } from "@/lib/model/questions";

export async function GET() {
  try {
    await mongoose.connect(QuestionsDB);
    const allQuestions = await Questions.find();

    return NextResponse.json({ questions: allQuestions }); // ✅ Returns all questions
  } catch (error) {
    console.error("Error fetching all questions:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

