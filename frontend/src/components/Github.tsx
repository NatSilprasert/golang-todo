export default function GitHub({signUp}: {signUp: boolean}) {

  const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const redirectUri = encodeURIComponent("http://localhost:5173/callback");

  const login = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}`;
  };

  return (
    <button
      onClick={() => login()}
      className="flex items-center gap-2 bg-bg2 text-white px-4 py-3 rounded justify-center border border-bg-hover hover:border-white/50"
    >
      <img
        src="https://img.icons8.com/?size=100&id=YSWCDCSF4H3N&format=png&color=FFFFFF"
        className="w-5 h-5"
      />
      <span>Sign {signUp ? 'up' : 'in'} with Github</span>
    </button>
  );
}