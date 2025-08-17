import { useState } from "react"
import GitHub from "../components/Github"
import Google from "../components/Google"
import { Input } from "../components/ui/input"
import axios from 'axios';
import { backEndUrl } from "../assets/config";
import { useAppContext } from "../context/AppContext";
import { toast } from "sonner";

const Login = () => {

    const {setToken, navigate} = useAppContext();
    const [signUp, setSignUp] = useState(false);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
 
    const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {

            if (signUp) {

                if (password !== confirmPassword) {
                    return toast.error("Password does not match", {
                        description: "Please make sure password and confirm password are the same.",
                    })
                }

                await axios.post(backEndUrl + '/api/register', {email, password})
        
                toast.success("Account Created!", {
                    description: "Your account has been created successfully.",
                    duration: 4000,
                    icon: "🎉",
                })
                setSignUp(false)
                setEmail('')
                setPassword('')
                setConfirmPassword('')

            } else {
                const response = await axios.post(backEndUrl + '/api/login', {email, password})
                
                setToken(response.data.token)
                localStorage.setItem('token', response.data.token)
                toast.success("Login Successful!", {
                    description: "Welcome back! You are now logged in.",
                    duration: 4000,
                    icon: "🎉",
                })
                setSignUp(false)
                setEmail('')
                setPassword('')
                setConfirmPassword('')
                navigate('/')
            }

        } catch (error: any) {
            toast.error("Error Message", {
            description: error.response.data.message
            })
        }
    }

    const isFormValid = signUp
        ? email && password && confirmPassword && password === confirmPassword
        : email && password;

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

                <form onSubmit={onSubmitHandler} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <p>Email</p>
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" 
                            placeholder="Your email address"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p>Password</p>
                        <Input 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="text" 
                            placeholder="Your password"
                            required
                        />
                    </div>

                    {signUp && 
                        <div className="flex flex-col gap-2">
                            <p>Confirm password</p>
                            <Input 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                type="text" 
                                placeholder="Enter your password again"
                                required
                            />
                        </div>
                    }  

                    <button 
                        className={`mt-4 px-6 py-3 rounded flex gap-2 items-center justify-center border border-bg2 ${isFormValid ? 'text-white bg-bg-hover/30 hover:border-white/50' : 'bg-bg2 text-muted-foreground'}`}>
                            {signUp ? 'Sign up' : 'Login'}
                    </button>
                </form>

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
