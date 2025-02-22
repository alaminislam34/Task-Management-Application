import { useContext, useState } from "react";
import { authContext } from "../../../ContextApi/AuthContext";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";
import { GrUpdate } from "react-icons/gr";

const Modal = () => {
  const { modalTask, refetch, theme } = useContext(authContext);
  const [error, setError] = useState(null);
  const handleUpdateTask = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;
    const updatedTask = { title, description };
    console.table({ title, description });
    if (!title || !description) {
      return setError("All fields are required");
    } else {
      setError(null);
      axios
        .patch(
          `${import.meta.env.VITE_URL}/updateTask/${modalTask._id}`,
          updatedTask,
          { withCredentials: true }
        )
        .then(() => {
          toast.success("Task updated successfully", {
            icon: <GrUpdate />,
            className:
              "text-center flex justify-center items-center flex-row gap-2",
            theme: theme === "light" ? "light" : "dark",
          });
          form.reset();
          refetch();
          document.getElementById("my_modal_5").close();
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  };

  return (
    <div>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div
          className={`modal-box p-6 lg:p-8 rounded-xl shadow-xl relative ${
            theme === "light" ? "bg-blue-100" : "bg-[#1C2948]"
          }`}
        >
          <div>
            <form
              onSubmit={handleUpdateTask}
              className="flex flex-col gap-2 space-y-2"
            >
              <p className="text-xl lg:text-2xl font-semibold py-2 lg:py-4">
                Edit Task
              </p>
              {error ? (
                <p className="text-error text-xs py-2"> {error} </p>
              ) : (
                ""
              )}
              <input
                className="py-2 px-4 rounded-md border border-gray-600 focus:outline-none focus:border-gray-400"
                type="text"
                name="title"
                defaultValue={modalTask.title && modalTask.title}
              />
              <input
                className="py-2 px-4 rounded-md border border-gray-600 focus:outline-none focus:border-gray-400"
                type="text"
                name="description"
                defaultValue={modalTask.description && modalTask.description}
              />
              <input
                type="submit"
                value="Update"
                className={`py-1 w-full btn border rounded-md cursor-pointer ${
                  theme === "light" ? "bg-blue-400" : "bg-blue-500"
                }`}
              />
            </form>
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="absolute top-2 right-2 cursor-pointer border-none">
                <MdClose />
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
