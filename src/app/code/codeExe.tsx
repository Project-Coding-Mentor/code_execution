'use client';
import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula, draculaDarkStyle } from "@uiw/codemirror-theme-dracula";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { EditorView } from "@codemirror/view";
import Question from "./question";
import Submition from "./submition";
import AI from "./ai";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface Question {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  topic: string;
  testCases: Array<{ input: string; expectedOutput: string }>;
}

const languages = [
  { id: 63, name: "JavaScript", mode: javascript },
  { id: 71, name: "Python" , mode: python},
  { id: 62, name: "Java" ,mode: java},
  { id: 68, name: "C" },
  { id: 72, name: "C++" }
];

export default function CodeExecutor() {
  const [code, setCode] = useState("console.log('Hello, World!');");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState(languages[0]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const qid = searchParams?.get("qid") || null;

  const [testCases, setTestCases] = useState([
    { input: "5", expected: "25", status: "pending", result: "", passed: false },
    { input: "3", expected: "9", status: "pending", result: "", passed: false },
  ]);
  const [loading, setLoading] = useState(false); // Added loading state
  const [question, setQuestion] = useState<Question>({
    _id: "",
    title: "Loading...",
    description: "Fetching question details...",
    difficulty: "Unknown",
    topic: "Unknown",
    testCases: [],
  });
  
  const [error, setError] = useState<string | null>(null); // Added error state

  useEffect(() => {
    fetch("api/questions/" + qid)
      .then((res) => res.json())
      .then((data) => {
        if (!data.question) {
          console.error("Invalid response: Missing question field");
          return;
        }
  
        setQuestion(data.question); // Update state with question data
  
        if (data.question.testCases && Array.isArray(data.question.testCases)) {
          setTestCases(
            data.question.testCases.map((tc: { input: string; expectedOutput: string }) => ({
              input: tc.input,
              expected: tc.expectedOutput,
              status: "pending",
            }))
          );
        } else {
          setTestCases([]); // Fallback if no test cases
        }
      })
      .catch((error) => console.error("Error fetching question:", error));
  }, []);
  

 
  
  const runCode = async () => {
    try {
      for (let test of testCases) {
        const response = await fetch("http://localhost:2358/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source_code: code,
            language_id: language.id,
            stdin: test.input, // Pass the test case input here
          }),
        });

        const data = await response.json();
        if (data.token) {
          setTimeout(async () => {
            const resultResponse = await fetch(`http://localhost:2358/submissions/${data.token}`);
            const resultData = await resultResponse.json();

            // Check if resultData.stdout exists
            if (resultData.stdout) {
              const isCorrect = resultData.stdout.trim() === test.expected;

              setTestCases((prev) =>
                prev.map((t) =>
                  t.input === test.input
                    ? { ...t, result: resultData.stdout.trim(), passed: isCorrect, status: "completed" }
                    : t
                )
              );

              setOutput(resultData.stdout.trim());
            } else {
              // Handle runtime error
              setTestCases((prev) =>
                prev.map((t) =>
                  t.input === test.input
                    ? { ...t, result: "Runtime Error", passed: false, status: "completed" }
                    : t
                )
              );

              setOutput(resultData.stderr || "Runtime Error");
            }
          }, 2000);
        }
      }
    } catch (error) {
      setOutput("Error executing code");
      console.error("Error executing code:", error);
    }
  };

  const submitCode = () => {
    setSubmissions((prevSubmissions) => [...prevSubmissions, code]); // Add the current code to the submissions list
  };

  const customTheme = EditorView.theme({
    "&": { backgroundColor: "transparent !important" },
  });
 const [tab, setTab] = useState(0);
 const [submissions, setSubmissions] = useState<string[]>([]); // Add state for submissions
 const [result, setResult] = useState(""); // Add a state variable for result
  // Add a state variable for submitted code // Add a state variable for result

 const handleTabChangeQuestion = () => {
  setTab(0);
 };

 const handleTabChangeSubmitions = () => {
  setTab(1);
 };
 const handleTabChangeAI = () => {
  setTab(2);
 };
  

  return (
    <div className="h-screen bg-gray-500 text-white p-0 flex flex-row gap-4">
  
  {/* Question Section */}
  <Card className="bg-black w-1/2 p-0 flex-1 relative left-0 border-none rounded-none">
      <div className="flex flex-row justify-evenly text-white p-2 bg-gray-700 cursor-pointer ">
        <div onClick={handleTabChangeQuestion} className="hover:underline">Question</div>
        <div>|</div>
        <div onClick={handleTabChangeSubmitions}
        className="hover:underline">Submission</div>
        <div>|</div>
        <div onClick={handleTabChangeAI}
        className="hover:underline">AI</div>
       </div>
       <div className="bg-black w-full p-1 flex-1 relative left-0 border-none     rounded-none">
      {tab === 0 ? (
          <Question title={question.title} description={question.description} />
        ) : tab === 1 ? (
          <Submition submissions={submissions} />
        ) : (
          <AI result={result} code={code} />
        )}
      </div>
  </Card>
   
  

  {/* Code Editor & Test Cases */}
  <div className="flex-1 flex flex-col w-1/2 h-screen relative">
    
    {/* Code Editor Section */}
    <Card className="bg-black flex-1 rounded-none p-0 border-none overflow-hidden relative">
      
      <CardContent className="h-full flex flex-col border-1">
      <div className="text-amber-100 text-white mt-1 ml-1 mb-2 
       p-2">Enter your code here:-</div>
        <div className="absolute z-50 top-2 right-4 text-white">
        
          <Select onValueChange={(val) => {
            const selectedLanguage = languages.find(l => l.name === val);
            if (selectedLanguage) {
              setLanguage(selectedLanguage);
            }
          }}>
            <SelectTrigger className="w-[180px]">{language.name}</SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.id} value={lang.name}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* CodeMirror Editor */}
        <div className="flex-1 overflow-auto">
          <CodeMirror
            value={code}
            extensions={language.mode ? [language.mode()] : []} // Dynamically set the language mode
            theme={[dracula, customTheme]} // Apply the Dracula theme
            onChange={(val) => setCode(val)} // Update the code state on change
            className="h-full"
          />
        </div>

        {/* Buttons */}
        <div className="absolute right-2 bottom-2 flex gap-2">
          <Button className="mt-4 bg-blue-600 hover:bg-blue-500" onClick={runCode}>
            Run Code
          </Button>
          <Button className="mt-4 bg-blue-600 hover:bg-blue-500" onClick={submitCode}>
            Submit
          </Button>
        </div>
        
      </CardContent>
    </Card>

    {/* Test Cases Section */}
    <Card className="bg-black rounded-none p-4 border-none overflow-auto h-[40%]">
      <CardContent className="h-full">
        <h2 className="text-lg font-bold mb-2 text-white">Test Cases</h2>
        {testCases.map((test, index) => (
          <div
            key={index}
            className={`p-2 mb-2 text-white ${
              test.status === "pending"
                ? "bg-gray-700" // Gray for pending test cases
                : test.passed
                ? "bg-green-700" // Green for passed test cases
                : test.result === "Runtime Error"
                ? "bg-red-700" // Red for runtime errors
                : "bg-red-700" // Red for failed test cases
            }`}
          >
            <p>Input: {test.input}</p>
            <p>Expected Output: {test.expected}</p>
            {test.status === "pending" ? (
              <p className="text-yellow-400">Status: Pending</p>
            ) : test.result === "Runtime Error" ? (
              <p className="text-red-400">Error: {test.result}</p>
            ) : (
              <p>Actual Output: {test.result || "Pending"}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>

  </div>
</div>

  );
}

