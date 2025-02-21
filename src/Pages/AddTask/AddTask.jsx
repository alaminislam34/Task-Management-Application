import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import { authContext } from "../../ContextApi/AuthContext";

const AddTask = () => {
  const { refetch, user } = useContext(authContext);
  const handleAddTask = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;
    const timestamp = new Date().toLocaleString();
    const category = "ToDo";
    const userEmail = user?.email;
    const userName = user?.displayName;
    const task = {
      title,
      description,
      timestamp,
      category,
      userName,
      userEmail,
    };
    console.table(task);
    if (!title || !description || !category) {
      return toast.error("All fields are required");
    } else {
      axios
        .post(`${import.meta.env.VITE_URL}/addTask`, task)
        .then((res) => {
          console.log(res.data);
          if (res.data.insertedId) {
            refetch();
            toast.success("Task added successfully");
            form.reset();
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="">
      <form onSubmit={handleAddTask} className=" w-full p-4 space-y-3 lg:w-2/3">
        <h2 className="text-xl md:text-2xl font-bold py-4">Add New Task</h2>
        <div className="flex flex-wrap gap-2">
          <label className="flex flex-col gap-1 justify-start" htmlFor="title">
            Task Title*
            <input
              className="py-1 px-2 lg:py-1.5 lg:px-3 rounded-md"
              type="text"
              name="title"
            />
          </label>
          <label
            className="flex flex-col gap-1 justify-start"
            htmlFor="description"
          >
            Description*
            <input
              className="py-1 px-2 lg:py-1.5 lg:px-3 rounded-md"
              type="text"
              name="description"
            />
          </label>
          <label
            htmlFor="dueDate"
            className="flex flex-col gap-1 justify-start"
          >
            Due Date*
            <input
              type="date"
              name="dueDate"
              className="py-1 px-2 lg:py-1.5 lg:px-3 rounded-md"
            />
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              className="py-1 px-2 lg:py-1.5 lg:px-3 border rounded-md cursor-pointer"
            >
              Add Task
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTask;

/**
 * AddTask
 *
 * This component renders a form to add a new task
 * Form consists of two input fields (title and description) and a submit button
 * When the form is submitted, it sends a POST request to the server to add the task
 * If the request is successful, it shows a toast notification with a success message
 * If the request is not successful, it shows a toast notification with an error message
 *
 * @returns A React component that renders a form to add a new task
 */
