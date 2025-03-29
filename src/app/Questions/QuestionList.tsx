"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Question {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  topic: string; // Assuming questions have a topic field
}

export default function QuestionsList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const router = useRouter();
  
  const handleSolveClick = (id: string) => {
    router.push(`/code?qid=${id}`);
  };
    
  
     

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/questions");
        const data = await res.json();
        setQuestions(data.questions); // ✅ Ensure you're accessing `questions`
        setFilteredQuestions(data.questions); // Initialize filtered questions
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Filter questions based on search term, topic, and difficulty
  useEffect(() => {
    const filtered = questions.filter((q) => {
      const matchesSearch =
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTopic =
        selectedTopic === "All" || q.topic === selectedTopic;
      const matchesDifficulty =
        selectedDifficulty === "All" || q.difficulty === selectedDifficulty;

      return matchesSearch && matchesTopic && matchesDifficulty;
    });

    setFilteredQuestions(filtered);
  }, [searchTerm, selectedTopic, selectedDifficulty, questions]);

  // Extract unique topics and difficulties for dropdown options
  const topics = ["All", ...new Set(questions.map((q) => q.topic))];
  const difficulties = ["All", ...new Set(questions.map((q) => q.difficulty))];

  // Calculate the number of questions per topic
  const topicCounts = questions.reduce((acc, question) => {
    acc[question.topic] = (acc[question.topic] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 w-full mx-auto bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Questions List</h1>

      {/* Topics and Counts */}
      <div className="mb-4 w-full flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2">Topics Overview</h2>
        <ul className="space-y-1 flex flex-rows gap-2">
          {Object.entries(topicCounts).map(([topic, count]) => (
            <li key={topic} className="text-white border-none bg-gray-700 rounded-full h-12 p-4 flex items-center justify-center">
              {topic}: {count} question{count > 1 ? "s" : ""}
            </li>
          ))}
        </ul>
      </div>

      

      {/* Dropdowns for Topic and Difficulty */}
      <div className="flex gap-4 mb-2">
        {/* Topic Dropdown */}
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="w-1/2 h-11 p-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
        >
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>

        {/* Difficulty Dropdown */}
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="w-1/2 p-2 h-11 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
        >
          {difficulties.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>
        {/* Search Bar */}
      <input
        type="text"
        placeholder="Search questions by title or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 h-11 mb-4 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
      />
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : filteredQuestions.length === 0 ? (
        <p className="text-gray-400">No questions available</p>
      ) : (
        <ul className="space-y-2">
          {filteredQuestions.map((q) => (
            <li
              key={q._id}
              className="p-2 border border-gray-700 rounded-lg bg-gray-800 shadow flex flex-row justify-between items-center"
            >
              <div className="flex flex-col">
                <h3 className="text-m font-semibold">{q.title}</h3>
                <p className="text-gray-400 hidden">{q.description}</p>
                <p className="text-gray-400">Difficulty: {q.difficulty}</p>
                <p className="text-gray-400">Topic: {q.topic}</p>
              </div>
              <button className="bg-green-500 h-10 text-white px-6 text-m rounded hover:bg-green-600" 
              onClick={() => handleSolveClick(q._id)}>
                Solve
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
