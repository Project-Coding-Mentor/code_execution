'use client';
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula, draculaDarkStyle } from "@uiw/codemirror-theme-dracula";
import { javascript } from "@codemirror/lang-javascript";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { EditorView } from "@codemirror/view";
import Question from "./question";
import Submition from "./submition";
import AI from "./ai";


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
  const [question, setQuestion] = useState("Write a function to square a number.");

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

            console.log("resultData", ); 
            
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

  const submitCode= async () => {
    // try {
    //   for (let test of testCases) {
    //     const response = await fetch("http://localhost:2358/submissions", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         source_code: code,
    //         language_id: language.id,
    //         stdin: test.input,  
    //       }),
    //     });
  
    //     const data = await response.json();
    //     if (data.token) {
    //       setTimeout(async () => {
    //         const resultResponse = await fetch(`http://localhost:2358/submissions/${data.token}`);
    //         const resultData = await resultResponse.json();
            
    //         // Check if output matches expected
    //         const isCorrect = resultData.stdout.trim() === test.expected;
            
    //         setTestCases((prev) =>
    //           prev.map((t) =>
    //             t.input === test.input ? { ...t, result: resultData.stdout.trim(), passed: isCorrect } : t
    //           )
    //         );
  
    //         setOutput(resultData.stdout || resultData.stderr || "No output");
    //       }, 2000);
    //     }
    //   }
    // } catch (error) {
    //   setOutput("Error executing");}
  }

  const customTheme = EditorView.theme({
    "&": { backgroundColor: "transparent !important" },
  });

 const [tab, setTab] = useState(0);

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
        <Question question={question} />
      ) : tab === 1 ? (
        <Submition />
      ) : (
        <AI />
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
            extensions={language.mode ? [language.mode()] : []}
            theme={[dracula, customTheme]}
            onChange={(val) => setCode(val)}
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
          <div key={index} className={`p-2 mb-2 text-white ${test.passed ? "bg-green-700" : "bg-gray-700"}`}>
            <p>Input: {test.input}</p>
            <p>Expected Output: {test.expected}</p>
            <p>Actual Output: {test.result || "Pending"}</p>
          </div>
        ))}
      </CardContent>
    </Card>

  </div>
</div>

  );
}

