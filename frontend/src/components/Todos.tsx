import { useAppContext } from "../context/AppContext"
import Card from "./Card"

const Todos = () => {

    const { todos } = useAppContext();

    return (
        <div className="mt-8 grid grid-cols-4 gap-4">
            {todos.map((todo) => (
                <Card 
                    key={todo.id}
                    {...todo}
                />
            ))}
        </div>
    )
}

export default Todos
