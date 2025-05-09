import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import User from '@/models/user'
import connectDB from '@/utils/db';

export async function POST(req: Request) {
  const { name, email, password, confirmPassword } = await req.json();
  const isValidEmail= (email: string) => {
   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return regex.test(email); 
}
if(!name || !email || !password || !confirmPassword) {
    return NextResponse.json({message: "Please fill all fields"}, {status: 400})
}

if(!isValidEmail(email)) {
    return NextResponse.json({message: "Please enter a valid email"}, {status: 400})
}

if(password !== confirmPassword) {
    return NextResponse.json({message: "Passwords do not match"}, {status: 400})}
if(password.length < 6) {
    return NextResponse.json({message: "Password must be at least 6 characters"}, {status: 400})
}

try{
    await connectDB();
    const existingUser = await User.findOne({email})
    if(existingUser){
        return NextResponse.json({message: "User already exists"}, {status: 400})
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword
    });
    await newUser.save();
    return NextResponse.json({message: "User created successfully"}, {status: 201})
}catch(err) {
    return NextResponse.json({message: "Something went wrong"}, {status: 500})
}
}