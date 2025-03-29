'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    setLoading(true);
    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setLoading(false);
    }
  };

  // const [users, setUsers] = useState<{ _id: string; name: string; email: string }[]>([]);

  // useEffect(() => {
  //   fetch("http://localhost:3002/api/users")
  //     .then((res) => res.json())
  //     .then((data) => setUsers(data))
  //     .catch((err) => console.error("Error fetching users:", err));
  // }, []);
  
  return (
    // <div className="flex min-h-screen items-center justify-center bg-gray-100">
    //   <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
    //     <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
    //     <form onSubmit={handleSubmit(onSubmit)}>
    //       <div className="mb-4">
    //         <label className="block text-gray-700">Email</label>
    //         <input 
    //           type="email" 
    //           {...register('email', { required: 'Email is required' })} 
    //           className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300" 
    //         />
    //         {errors.email?.message && <p className="text-red-500 text-sm">{String(errors.email.message)}</p>}
    //       </div>
    //       <div className="mb-4">
    //         <label className="block text-gray-700">Password</label>
    //         <input 
    //           type="password" 
    //           {...register('password', { required: 'Password is required' })} 
    //           className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300" 
    //         />
    //         {errors.password?.message && <p className="text-red-500 text-sm">{String(errors.password.message)}</p>}
    //       </div>
    //       <button 
    //         type="submit" 
    //         className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
    //         disabled={loading}
    //       >
    //         {loading ? 'Logging in...' : 'Login'}
    //       </button>
    //     </form>
    //   </div>
    // </div>
    
    <div>
      <h1>User List</h1>
      


    </div>

    
  
  );
}
