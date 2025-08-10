export default function GitHub({signUp}: {signUp: boolean}) {
  const login = () => {
    window.location.href = "http://localhost:8080/login/github";
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