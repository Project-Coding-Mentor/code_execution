"use client";
import React from "react";
import graphData from "./DATA/graphData";
import './user_interface.css'; // Import CSS file for styling
import Navbar from "@/components/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation"; // Import useRouter

const Dashboard = () => {
  const router = useRouter(); // Initialize useRouter

  const handleNavigateToQuestions = () => {
    router.push("/Questions"); // Navigate to the /Questions route
  };

  return (
    <div>
        <Navbar/>
        <div className="dashboard-container flex flex-col items-center">
        
      <h1>Hello Himanshu</h1>
      <p>Let's get started and improve ourself</p>

      {/* Progress Graph */}
      <div className="progress-container">
        <h2 className="progress-title">PROGRESS</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={graphData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="gray" />
            <XAxis dataKey="topic" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#222" />
            <Bar dataKey="completed" fill="green" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="div">
        <h1 className="header2">Topics Coverd</h1>
      </div>
      {/* Topics Covered */}
      <div className="topics-container">
        <div className="topic-box advanced flex flex-col items-center">
          <h3>Advanced</h3>
          <p>Dynamic Programming x12</p>
          <p>Divide and Conquer x5</p>
          <p>Game Theory x2</p>
        </div>

        <div className="topic-box intermediate flex flex-col items-center">
          <h3>Intermediate</h3>
          <p>Database x6</p>
          <p>Math x39</p>
          <p>Bit Manipulation x17</p>
        </div>

        <div className="topic-box fundamental flex flex-col items-center">
          <h3>Fundamental</h3>
          <p>Array x82</p>
          <p>String x50</p>
          <p>Two Pointers x26</p>
        </div>
      </div>
      
      {/* Navigate to Questions */}
      <button
        className="Start_progress bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleNavigateToQuestions}
      >
        Let's Code
      </button>
    </div>
    </div>
    
    
  );
};

export default Dashboard;