import { ArrowRight, Check, } from "lucide-react"

const Navbar = () => {
  return (
    <div className="px-24 py-4 border-b-4 border-secondary flex justify-between">
        <div className="flex gap-1 items-center">
            <Check />
            <h1 className="font-semibold text-xl">TODO</h1>
        </div>

        <button className="px-6 py-3 bg-secondary rounded-2xl flex gap-2 items-center">
            <ArrowRight size={16} />
            <p className="font-semibold">Login</p>
        </button>
    </div>
  )
}

export default Navbar
