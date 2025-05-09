"use client";
import {Button} from "@/components/ui/button";
import {useState} from "react";
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
import {signIn} from "next-auth/react";
import { useRouter } from "next/navigation";



import {
  FaGithub
} from "react-icons/fa";
import {FcGoogle} from "react-icons/fc";
import { toast } from "sonner";

const SignIn = () => {

  const[email, setEmail]=useState<string>("");
  const[password, setPassword]=useState<string>("");
  const[pending, setPending]=useState<boolean>(false);
  
  const [error, setError]=useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const res = await signIn("credentials" , {
      redirect: false,
      email,
      password
    })
    if(res?.ok){
      router.push("/");
      toast.success("login successful")
    }else if(res?.status === 401){
      setError("Invalid credentials")
      setPending(false)
    }else{
      setError("Something went wrong");
    }
    
  }

  return(
    <div className="h-full flex items-center justify-center bg-[#1b0918]">
      <Card className="md:h-auto w-[80%] sm:w-[420px] sm:p-8" >
        <CardHeader>
          <CardTitle className="text-center">
            Sign in
          </CardTitle>
          <CardDescription className="text-sm text-center text-accent-foreground">
            Use email to Sign In
          </CardDescription>
        </CardHeader>
        
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            
            <Input
                type="email"
                disabled={pending}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <Input
                type="Password"
                disabled={pending}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            Create a New Account?
            <Link href="sign-up" className="text-sky-700 ml-4 hover:underline curser-pointer">Sign-up</Link>            
          </p>
          
        </CardContent>
      </Card>

    </div>
  )
}
export default SignIn;