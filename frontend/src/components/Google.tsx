import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';


export default function Google({signUp}: {signUp: boolean}) {
  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      const token = tokenResponse.credential;
      if (token) {
        const userInfo = jwtDecode(token);
        console.log(userInfo);
      } else {
        console.log('No token received');
      }
    },
    onError: () => {
      console.log('Login Failed');
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

