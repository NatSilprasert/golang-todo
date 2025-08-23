import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { backEndUrl } from '../assets/config';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';

export default function Google({signUp}: {signUp: boolean}) {

  const { navigate, setToken } = useAppContext();

  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {

      console.log("Google Access Token:", credentialResponse.access_token);

      try {
        const response = await axios.post(backEndUrl + '/api/google/login', {
          token: credentialResponse.access_token,
        });

    
        setToken(response.data.token)
        localStorage.setItem("token", response.data.token);
        toast.success("Login Successful!", {
          description: "Welcome back! You are now logged in.",
          duration: 4000,
          icon: "🎉",
        })
        navigate('/');
        
        
      } catch (error: any) {
        toast.error("Error Message", {
        description: error.response.data.message
        })
      }
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  return (
    <button
      onClick={() => login()}
      className="mt-3 flex items-center gap-2 bg-bg2 text-white px-4 py-3 rounded hover:bg-bg-hover/30 justify-center border border-bg-hover hover:border-white/50"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        className="w-5 h-5"
      />
      <span>Sign {signUp ? 'up' : 'in'} with Google</span>
    </button>
  );
}
