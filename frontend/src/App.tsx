import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { Toaster } from "sonner"


const App = () => {
  return (
    <div className="min-h-screen">
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
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
        </Routes>
      </GoogleOAuthProvider>
    </div>
  )
}

export default App
