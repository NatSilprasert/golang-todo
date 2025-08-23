import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { Toaster } from "sonner"
import { GoogleClientID } from "./assets/config"
import GithubCallback from "./pages/GithubCallback"


const App = () => {
  return (
    <div className="min-h-screen">
      <GoogleOAuthProvider clientId={GoogleClientID}>
        <Toaster 
          theme="dark"
          richColors={true}
          visibleToasts={1}
          closeButton={true}
          toastOptions={{
            style: {
              color: "#fff",
            }
          }}
        />
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/callback" element={<GithubCallback />}/>
        </Routes>
      </GoogleOAuthProvider>
    </div>
  )
}

export default App
