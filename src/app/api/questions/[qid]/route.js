import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { QuestionsDB } from "@/lib/questionsdb";
import { Questions } from "@/lib/model/questions";

export async function GET(req, context) {
  try {
    await mongoose.connect(QuestionsDB);

    const { qid } = context.params;  // ✅ Fix: Correct way to access params

    if (!qid) {
      return NextResponse.json({ error: "Question ID is required" }, { status: 400 });
    }

    const question = await Questions.findById(qid);
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ question });
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json({ error: "Failed to fetch question" }, { status: 500 });
  }
}

