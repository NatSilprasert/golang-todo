import Card from "./Card"

const Todo = () => {
  return (
    <div className="px-24 mt-8">
        <h1 className="font-semibold text-xl">Recently Modified</h1>
        <div className="mt-8 grid grid-cols-4 gap-4">
            <Card />
        </div>
    </div>
  )
}

export default Todo
