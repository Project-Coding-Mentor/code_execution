"use client";
import React, { useState } from "react";
import axios from "axios";
import { Search, Bot, User, Clipboard } from "lucide-react";
import "./chatbot.css";

interface AIProps {
    result: any; // Replace 'any' with the appropriate type if known
    code: string; // Add the code prop to accept the user's code
}

const AI: React.FC<AIProps> = ({ result, code }) => {
    const [userQuestion, setUserQuestion] = useState("");
    const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const askChatbot = async () => {
        if (!userQuestion.trim()) return;

        // Include the user's code in the chatbot request
        const updatedChatHistory = [
            ...chatHistory,
            { role: "user", content: `Code:\n${code}\n\nQuestion:\n${userQuestion}` },
        ];
        setChatHistory([...updatedChatHistory, { role: "bot", content: "Typing..." }]);

        try {
            const response = await axios.post(
                "https://api.together.xyz/v1/chat/completions",
                {
                    model: "mistralai/Mistral-7B-Instruct-v0.2",
                    messages: updatedChatHistory.slice(-10), // Limit to the last 10 messages
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOGETHER_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const botMessage = (response.data as { choices: { message: { content: string } }[] }).choices[0].message.content;
            setChatHistory([...updatedChatHistory, { role: "bot", content: botMessage }]);
        } catch (error) {
            console.error("Error fetching chatbot response:", error);
            setChatHistory([...updatedChatHistory, { role: "bot", content: "Error: Unable to fetch response." }]);
        }

        setUserQuestion("");
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            askChatbot();
        }
    };

    const copyToClipboard = (code: string) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(code);
            alert("Code copied to clipboard! ✅");
        } else {
            alert("Clipboard API not supported in this browser.");
        }
    };

    const renderMessage = (msg: { role: string; content: string }, index: number) => {
        if (msg.role === "bot" && msg.content.includes("```")) {
            const codeMatch = msg.content.match(/```(?:\w+)?\n([\s\S]*?)```/);
            const codeContent = codeMatch ? codeMatch[1] : "No code found.";

            return (
                <div key={index} className="message bot">
                    <Bot className="icon" />
                    <div className="code-block">
                        <pre><code>{codeContent}</code></pre>
                        <button className="copy-btn" onClick={() => copyToClipboard(codeContent)}>
                            <Clipboard className="copy-icon" /> Copy
                        </button>
                    </div>
                </div>
            );
        }

        // Format bot responses for better readability
        const formattedContent = msg.content
            .split("\n")
            .map((line, idx) => <p key={idx}>{line}</p>);

        return (
            <div key={index} className={`message ${msg.role}`}>
                {msg.role === "user" ? <User className="icon" /> : <Bot className="icon" />}
                <div className="message-content">{formattedContent}</div>
            </div>
        );
    };

    return (
        <div className="chat-container w-full flex justify-center items-center">
            {/* <div className={`menu ${menuOpen ? "change" : ""}`} onClick={toggleMenu}>
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div>
            </div> */}
            <div className="main_container2">
                <h1 className="chat-title">What can I help with?</h1>
                <div className="search-bar">
                    <Search className="icon" />
                    <input
                        type="text"
                        placeholder="Ask anything"
                        value={userQuestion}
                        onChange={(e) => setUserQuestion(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <button className="search-btn" onClick={askChatbot}>Search</button>
                </div>
                <div className="chatbox">
                    {chatHistory.map((msg, index) => renderMessage(msg, index))}
                </div>
            </div>
        </div>
    );
};

export default AI;