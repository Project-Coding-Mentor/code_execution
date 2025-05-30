"use client";
import {Button} from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input";
import Link from "next/link";

import {toast} from "sonner"; 
import { useRouter } from "next/navigation";

import { useState } from "react";

import {
  FaGithub
} from "react-icons/fa";
import {FcGoogle} from "react-icons/fc";
import { TriangleAlert } from "lucide-react";

const Signup = () => {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [pending, setPending]=useState(false);
  const [error, setError]=useState(null);

  const router = useRouter();
  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const res = await fetch("/api/auth/signup",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form),
    
    } )
    const data = await res.json();

    if(res.ok){
      setPending(false);
      const data= await res.json();
      router.push("/sign-in")
    }else if(res.status === 400){
      setError(data.message)
      setPending(false)
    }else if(res.status===500){
      setError(data.message)
    }
  }

  

  return(
    <div className="h-full flex items-center justify-center bg-[#1b0918]">
      <Card className="md:h-auto w-[80%] sm:w-[420px] sm:p-8" >
        <CardHeader>
          <CardTitle className="text-center">
            Sign up
          </CardTitle>
          <CardDescription className="text-sm text-center text-accent-foreground">
            Use email to create account
          </CardDescription>
        </CardHeader>
        {!!error && (
          <div className="bg-destructive/15 p-3 rounded-md flex item-center gap-x-2 text-sm text-destructive mb-6">
            <TriangleAlert/>
            <p>{error}</p>
          </div>
        )}
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
                type="text"
                disabled={pending}
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({...form, name:e.target.value})}
                required
            />
            <Input
                type="email"
                disabled={pending}
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({...form, email:e.target.value})}
                required
            />
            <Input
                type="Password"
                disabled={pending}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({...form, password:e.target.value})}
                required
            />
            <Input
                type="Confirm Password"
                disabled={pending}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) => setForm({...form, confirmPassword:e.target.value})}
                required
            />
            <Button className="w-full" size="lg" disabled={false}>Continue</Button>
          </form>

          <Separator/>

          <div className="flex my-2 gap-2 justify-evenly mx-auto items-center">
            <Button
                disabled={false}
                onClick={() => {}}
                variant="outline"
                size="lg"
                className="bg-slate-300 hover:bg-slate-400 hover:scale-110"
            >
              <FcGoogle className="size-8 left-2.5 top-2.5"/>
            </Button>
            <Button
                disabled={false}
                onClick={() => {}}
                variant="outline"
                size="lg"
                className="bg-slate-300 hover:bg-slate-400 hover:scale-110"
            >
              <FaGithub className="size-8 left-2.5 top-2.5"/>
            </Button>
          </div>
          <p className="text-center text-sm mt-2 text-muted-foreground">
            Already have an account?
            <Link href="sign-in" className="text-sky-700 ml-4 hover:underline curser-pointer">Sign-in</Link>            
          </p>
          
        </CardContent>
      </Card>

    </div>
  )
}
export default Signup;