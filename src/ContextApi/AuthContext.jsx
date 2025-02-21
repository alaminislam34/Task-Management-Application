/* eslint-disable react/prop-types */
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../Firebase/Firebase.config";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import socket from "../Pages/Home/TaskBoard/Socket";

// Fetch tasks function
const fetchTasks = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};
export const authContext = createContext();

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [modalTask, setModalTask] = useState([]);
  const [tasks, setTasks] = useState({ ToDo: [], InProgress: [], Done: [] });

  console.log(tasks);
  // Use the useQuery hook to fetch tasks
  const { data, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  // Format the fetched tasks
  const formattedTasks = data?.reduce(
    (acc, task) => {
      const category = task.category.replace("-", "");
      if (!acc[category]) acc[category] = [];
      acc[category].push(task);
      return acc;
    },
    { ToDo: [], InProgress: [], Done: [] }
  );

  useEffect(() => {
    if (formattedTasks) {
      setTasks((prevTasks) => {
        if (!deepEqual(prevTasks, formattedTasks)) {
          return formattedTasks;
        }
        return prevTasks;
      });
    }
  }, [formattedTasks]);
  // Toggle the theme
  const handleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // User control on browser
  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setLoading(false);

        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_URL}/users?email=${user?.email}`,
            { withCredentials: true }
          );
          console.log(data);
          if (!data) {
            const res = await axios.post(
              `${import.meta.env.VITE_URL}/postUser`,
              {
                name: user?.displayName,
                email: user?.email,
              },
              { withCredentials: true }
            );
            console.log(res.data);
          }
        } catch (error) {
          console.error("Error checking/adding user:", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Theme control on browser
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    socket.on("taskUpdate", (data) => {
      setTasks((prevTasks) => {
        if (data.type === "insert") {
          return {
            ...prevTasks,
            [data.task.category]: [
              ...(prevTasks[data.task.category] || []),
              data.task,
            ],
          };
        } else if (data.type === "update") {
          return {
            ...prevTasks,
            [data.task.category]: prevTasks[data.task.category]
              ? prevTasks[data.task.category].map((task) =>
                  task._id === data.task._id ? data.task : task
                )
              : [],
          };
        } else if (data.type === "delete") {
          return {
            ...prevTasks,
            [data.category]: prevTasks[data.category]
              ? prevTasks[data.category].filter(
                  (task) => task._id !== data.taskId
                )
              : [],
          };
        }
        return prevTasks;
      });
    });

    return () => {
      socket.off("taskUpdate");
    };
  }, []);
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
  };

  return <authContext.Provider value={info}>{children}</authContext.Provider>;
};

export default AuthContext;

// Helper function to compare objects deeply
function deepEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
