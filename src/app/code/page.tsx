import React from 'react';
import CodeExecutor from './codeExe';
import Navbar from '@/components/Navbar';

const page = () => {
    return (
        <div>
            <Navbar/>
            <CodeExecutor/>
        </div>
    );
};

export default page;