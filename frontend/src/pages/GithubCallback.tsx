import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import { backEndUrl } from "../assets/config";
import { toast } from "sonner";

const GithubCallback = () => {
    const { navigate, setToken } = useAppContext();

    useEffect(() => {
        const fetchToken = async () => {
            const code = new URLSearchParams(window.location.search).get("code");
            if (!code) return;

            try {
                const response = await axios.post(backEndUrl + "/api/github/login", { code });

                setToken(response.data.token)
                localStorage.setItem("token", response.data.token);
                toast.success("Login Successful!", {
                description: "Welcome back! You are now logged in.",
                duration: 4000,
                icon: "🎉",
                })
                navigate('/');

            } catch (error: any) {
                console.log(error);
                toast.error("Error Message", {
                description: error.response.data.message
                })
            }
        };

        fetchToken();

    }, [navigate, setToken]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="loader mb-4"></div>
            <p></p>

            <style>{`
                .loader {
                border: 6px solid #f3f3f3;
                border-top: 6px solid #454545;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                animation: spin 1s linear infinite;
                }

                @keyframes spin {
                0% { transform: rotate(0deg);}
                100% { transform: rotate(360deg);}
                }
            `}</style>
            </div>
    )
}

export default GithubCallback
