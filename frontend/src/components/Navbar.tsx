import { ArrowRight, Check, } from "lucide-react"
import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <div className="px-24 py-4 border-b-4 border-bg2 flex justify-between">
        <div className="flex gap-1 items-center">
            <Check />
            <h1 className="font-semibold text-xl">TODO</h1>
        </div>

        <Link to='/login'>
            <button className="px-6 py-3 bg-bg2 rounded-2xl flex gap-2 items-center hover:bg-bg-hover/30">
                <ArrowRight size={16} />
                    <p className="">Login</p>
            </button>
        </Link>
    </div>
  )
}

export default Navbar
