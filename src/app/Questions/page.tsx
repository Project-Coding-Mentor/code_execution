'use client';
import React from 'react';
import QuestionList from './QuestionList';
import QuestionsList from './QuestionList';
import Navbar from '@/components/Navbar';

const QuestionsPage = () => {
    return (
        <div>
            <Navbar/>
             <QuestionsList />
        </div>
    );
};

export default QuestionsPage;