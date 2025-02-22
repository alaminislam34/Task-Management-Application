/* eslint-disable react/prop-types */
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../Firebase/Firebase.config";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// Fetch tasks function
// eslint-disable-next-line react-refresh/only-export-components
export const authContext = createContext();

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [modalTask, setModalTask] = useState([]);
  const [tasks, setTasks] = useState({ ToDo: [], InProgress: [], Done: [] });
  const [allUsers, setAllUsers] = useState([]);

  // Use the useQuery hook to fetch tasks
  const { data, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      if (!user) return;
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/tasks?email=${user.email}`,
        { withCredentials: true }
      );
      return response.data;
    },
    enabled: !!user,
  });

  // Format the fetched tasks
  useEffect(() => {
    if (data) {
      const formattedTasks = data.reduce(
        (acc, task) => {
          acc[task.category] = acc[task.category] || [];
          acc[task.category].push(task);
          return acc;
        },
        { ToDo: [], InProgress: [], Done: [] }
      );
      setTasks(formattedTasks);
    }
  }, [data]);

  // Toggle the theme
  const handleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        const { data } = await axios.get(`${import.meta.env.VITE_URL}/users`, {
          withCredentials: true,
        });
        setAllUsers(data);
        const exists = data.find((u) => u.email === user?.email);
        if (!exists) {
          await axios.post(
            `${import.meta.env.VITE_URL}/postUser`,
            { name: user.displayName, email: user.email },
            { withCredentials: true }
          );
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Theme control on browser
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // User info for context
  const info = {
    theme,
    handleTheme,
    user,
    setUser,
    setLoading,
    loading,
    modalTask,
    setModalTask,
    tasks,
    setTasks,
    refetch,
    allUsers,
  };

  return <authContext.Provider value={info}>{children}</authContext.Provider>;
};

export default AuthContext;
