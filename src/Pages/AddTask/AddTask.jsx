import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { authContext } from "../../ContextApi/AuthContext";
import { MdClose } from "react-icons/md";

const AddTask = () => {
  const { refetch, user, theme } = useContext(authContext);
  const [titleError, setTitleError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);
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

    if (!title || !description || !category) {
      return toast.error("All fields are required");
    } else {
      axios
        .post(`${import.meta.env.VITE_URL}/addTask`, task, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.insertedId) {
            refetch();
            toast.success("Task added successfully");
            form.reset();
            document.getElementById("my_modal_4").close();
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <dialog id="my_modal_4" className="modal modal-bottom sm:modal-middle">
      <div
        className={`modal-box p-6 lg:p-8 rounded-xl shadow-xl relative ${
          theme === "light" ? "bg-blue-100" : "bg-[#1C2948]"
        }`}
      >
        <form onSubmit={handleAddTask}>
          <h2 className="text-xl md:text-2xl font-bold py-4 text-center">
            Add A New Task
          </h2>
          <div className="flex flex-col gap-2 space-y-3 lg:space-y-4">
            <label
              className="flex flex-col gap-1 justify-start text-gray-500"
              htmlFor="title"
            >
              Task Title*
              <input
                className="py-1 px-2 lg:py-1.5 lg:px-3 rounded-md border border-gray-500 focus:outline-gray-600 focus:border-none"
                type="text"
                name="title"
                max={50}
                onChange={(e) => {
                  if (e.target.value.length > 50)
                    return setTitleError(
                      "Task title cannot exceed 50 characters"
                    );
                  else setTitleError(null);
                }}
                required
              />
              {titleError ? (
                <p className="text-red-500 text-xs py-2">{titleError}</p>
              ) : (
                ""
              )}
            </label>
            <label
              className="flex flex-col gap-1 justify-start text-gray-500"
              htmlFor="description"
            >
              Description*
              <textarea
                className="py-1 px-2 lg:py-1.5 lg:px-3 rounded-md border border-gray-500 focus:outline-gray-600 focus:border-none"
                type="text"
                name="description"
                maxLength={200}
                onChange={(e) => {
                  if (e.target.value.length > 200)
                    return setDescriptionError(
                      "Description cannot exceed 200 characters"
                    );
                  else setDescriptionError(null);
                }}
                required
              />
              {descriptionError ? (
                <p className="text-red-500 text-xs py-2">{descriptionError}</p>
              ) : (
                ""
              )}
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                className={`py-1 w-full btn px-2 lg:py-1.5 lg:px-3 border rounded-md cursor-pointer ${
                  theme === "light" ? "bg-blue-400" : "bg-blue-500"
                }`}
              >
                Add Task
              </button>
            </div>
          </div>
        </form>
        <div className="modal-action absolute -top-2 right-4">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="cursor-pointer">
              <MdClose />
            </button>
          </form>
        </div>
      </div>
    </dialog>
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
