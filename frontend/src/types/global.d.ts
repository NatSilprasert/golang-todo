interface AppContextType {
    navigate: ReturnType<typeof useNavigate>;
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    todos: Todo[];
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

interface AppContextProviderProps {
  children: ReactNode;
}

interface Todo {
    id: number;
    title: string;
    completed: boolean;
    userId: number;
    createAt: string;
    updateAt: string;
    dueDate: string;
}