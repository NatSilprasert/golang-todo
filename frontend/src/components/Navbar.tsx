import { ArrowLeft, ArrowRight, Check, } from "lucide-react"
import { Link } from "react-router-dom"
import { useAppContext } from "../context/AppContext"

const Navbar = () => {

  const {token, setToken} = useAppContext();

  const buttonHandler = () => {
    if (token) {
      localStorage.removeItem('token')
      setToken('')
    }
  }

  return (
    <div className="px-24 py-4 border-b-4 border-bg2 flex justify-between">
        <div className="flex gap-1 items-center">
            <Check />
            <h1 className="font-semibold text-xl">TODO</h1>
        </div>

        <Link to='/login'>
            <button 
              onClick={buttonHandler}
              className="px-6 py-3 bg-bg2 rounded-2xl flex gap-2 items-center hover:bg-bg-hover/40"
            >
              {token ? <ArrowLeft size={16} /> : <ArrowRight size={16} /> }
              <p>{token ? 'Logout' : 'Login'}</p>
            </button>
        </Link>
    </div>
  )
}

export default Navbar
