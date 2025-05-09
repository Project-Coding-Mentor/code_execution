import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  await dbConnect();
  const { email, topic, questionId, timeTaken } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const topicData = user.progress.get(topic) || { total: 0, completed: 0, questions: [] };

  const existing = topicData.questions.find(q => q.id === questionId);

  if (existing) {
    existing.attempts += 1;
    existing.timeTaken = timeTaken;
    existing.status = "solved";
  } else {
    topicData.questions.push({ id: questionId, status: "solved", timeTaken, attempts: 1 });
    topicData.completed += 1;
  }

  user.progress.set(topic, topicData);
  await user.save();

  return Response.json({ message: "Progress updated" });
}
