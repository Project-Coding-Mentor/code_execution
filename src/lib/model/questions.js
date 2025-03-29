import mongoose from "mongoose";
const questions= new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    testCases: [
        {
            input: { type: String, required: true },
            expectedOutput: { type: String, required: true }
        }
    ]
}, { timestamps: true });
export const Questions = mongoose.models.questions || mongoose.model("questions", questions);