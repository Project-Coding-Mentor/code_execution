'use client';
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { javascript } from "@codemirror/lang-javascript";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";

const languages = [
  { id: 63, name: "JavaScript", mode: javascript },
  { id: 71, name: "Python" },
  { id: 62, name: "Java" },
  { id: 68, name: "C" },
  { id: 72, name: "C++" }
];

export default function CodeExecutor() {
  const [code, setCode] = useState("console.log('Hello, World!');");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState(languages[0]);
  const [testCases, setTestCases] = useState([
    { input: "5", expected: "25", status: "pending", result: "", passed: false },
    { input: "3", expected: "9", status: "pending", result: "", passed: false },
  ]);

  const runCode = async () => {
    try {
      for (let test of testCases) {
        const response = await fetch("http://localhost:2358/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source_code: code,
            language_id: language.id,
            stdin: test.input,  // Pass the test case input here
          }),
        });
  
        const data = await response.json();
        if (data.token) {
          setTimeout(async () => {
            const resultResponse = await fetch(`http://localhost:2358/submissions/${data.token}`);
            const resultData = await resultResponse.json();
            
            // Check if output matches expected
            const isCorrect = resultData.stdout.trim() === test.expected;
            
            setTestCases((prev) =>
              prev.map((t) =>
                t.input === test.input ? { ...t, result: resultData.stdout.trim(), passed: isCorrect } : t
              )
            );
  
            setOutput(resultData.stdout || resultData.stderr || "No output");
          }, 2000);
        }
      }
    } catch (error) {
      setOutput("Error executing code");
    }
  };
  

  return (
    <div className="h-screen w-1/2 bg-gray-900 text-white p-4 flex flex-col gap-4">
      {/* Code Execution Section */}
      <Card className="flex-1 bg-gray-800 p-4 relative">
        <CardContent>
          <div className="absolute top-2 right-4">
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
          <CodeMirror
            value={code}
            extensions={language.mode ? [language.mode()] : []}
            theme={dracula}
            onChange={(val) => setCode(val)}
          />
          <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-500" onClick={runCode}>
            Run Code
          </Button>
          <div className="mt-2 p-2 bg-black rounded text-green-400">{output}</div>
        </CardContent>
      </Card>

      {/* Test Cases Section */}
<Card className="h-1/3 bg-gray-800 p-4 overflow-auto">
  <CardContent>
    <h2 className="text-lg font-bold mb-2">Test Cases</h2>
    {testCases.map((test, index) => (
      <div
        key={index}
        className={`p-2 rounded mb-2 ${test.passed ? "bg-green-700" : "bg-gray-700"}`}
      >
        <p>Input: {test.input}</p>
        <p>Expected Output: {test.expected}</p>
        <p>Actual Output: {test.result || "Pending"}</p>
      </div>
    ))}
  </CardContent>
</Card>

    </div>
  );
}

