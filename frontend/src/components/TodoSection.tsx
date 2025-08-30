import { Plus } from "lucide-react"
import axios from "axios"
import { backEndUrl } from "../assets/config"
import { toast } from "sonner"
import Todos from "./Todos"
import { useAppContext } from "../context/AppContext"

const TodoSection = () => {

  const { token, setTodos } = useAppContext();

  const createTodo = async () => {
    try {

        const response = await axios.get(backEndUrl + '/api/createTodos', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        
        setTodos(prev => [...prev, ...response.data])

    } catch (error: unknown) {

      if (axios.isAxiosError(error) && error.response) {
        toast.error("Error Message", {
          description: error.response.data.error
        })
      } else {
        toast.error("An unexpected error occurred");
        console.log(error)
      }

    }
  }

  return (
    <div className="px-24 mt-8">
      <div className="flex gap-3 items-center">
        <h1 className="font-semibold text-xl">Recently Modified</h1>
        <div onClick={createTodo} className="bg-bg2 p-1 font-medium text-gray-400 rounded-sm flex items-center justify-center hover:text-white hover:bg-bg-hover/40">
          <Plus size={16}/>
        </div>
      </div>
      <Todos />
    </div>
  )
}

export default TodoSection
