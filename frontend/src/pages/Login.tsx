import { useState } from "react"
import GitHub from "../components/Github"
import Google from "../components/Google"
import { Input } from "../components/ui/input"

const Login = () => {

    const [signUp, setSignUp] = useState(false);

    return (
        <div className="w-full h-dvh flex justify-center items-center">
            <div className="border w-110 px-8 py-10 border-bg-hover rounded flex flex-col gap-3">
                
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-semibold">Welcome!</h1>
                    <p className="font-light">Login to Todo to continue.</p>
                </div>

                <Google signUp={signUp}/>
                <GitHub signUp={signUp}/>

                <div className="w-full flex gap-2 items-center">
                    <span className="border-b border-bg-hover w-full"></span>
                    <p className="text-muted-foreground font-light">OR</p>
                    <span className="border-b border-bg-hover w-full"></span>
                </div>

                <div className="flex flex-col gap-2">
                    <p>Email</p>
                    <Input type="email" placeholder="Your email address"/>
                </div>
                <div className="flex flex-col gap-2">
                    <p>Password</p>
                    <Input type="text" placeholder="Your password"/>
                </div>
                {signUp && 
                    <div className="flex flex-col gap-2">
                        <p>Confirm password</p>
                        <Input type="text" placeholder="Enter your password again"/>
                    </div>
                }  

                <button className="text-muted-foreground hover:text-white mt-4 px-6 py-3 bg-bg2 rounded flex gap-2 items-center justify-center hover:bg-bg-hover/30 border border-bg2 hover:border-white/50">
                          {signUp ? 'Sign up' : 'Login'}
                </button>

                <p className="mt-1 text-center font-light text-white flex gap-1 justify-center">
                    {signUp ? 'Already' : 'Don\'t'} have an account?
                    <span 
                        onClick={() => setSignUp(!signUp)}
                        className="underline underline-offset-2 text-blue-500"
                    >
                        {signUp ? 'Login' : 'Sign up'}
                    </span>
                </p>
            </div>
        </div>
    )
}

export default Login
