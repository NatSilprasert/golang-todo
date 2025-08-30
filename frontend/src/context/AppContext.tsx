import axios from "axios";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { backEndUrl } from "../assets/config";
import { toast } from "sonner";



const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
        }
        if (token) {
          fetchUserTodos();
        }
    }, [token])

    const fetchUserTodos = async () => {
      try {
        const response = await axios.get(backEndUrl + '/api/todos', {
           headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setTodos(response.data)
        console.log("fetch successfully!")
      } catch (error: any) {
        console.log("Token being sent:", token)
        toast.error("Error Message", {
          description: error.response?.data?.error || error.message
        })
      }
    }

    const value: AppContextType = { 
        token, setToken, navigate,
        todos, setTodos
    };

    return (
        <AppContext.Provider value={value}>
        {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider