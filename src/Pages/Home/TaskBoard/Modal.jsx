import { useContext } from "react";
import { authContext } from "../../../ContextApi/AuthContext";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";
import socket from "./Socket";

const Modal = () => {
  const { modalTask, refetch } = useContext(authContext);
  const handleUpdateTask = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;
    const updatedTask = { title, description };
    console.table({ title, description });
    if (!title || !description) {
      return toast.error("All fields are required");
    } else {
      axios
        .patch(
          `${import.meta.env.VITE_URL}/updateTask/${modalTask._id}`,
          updatedTask
        )
        .then((res) => {
          console.log(res.data);
          toast.success("Task updated successfully");
          form.reset();
          refetch();
          socket.emit("updateTask", updatedTask);
          document.getElementById("my_modal_5").close();
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong");
          form.reset();
        });
    }
  };

  return (
    <div>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <div>
            <form onSubmit={handleUpdateTask} className="flex flex-col gap-2">
              <p className="text-xl lg:text-2xl font-semibold py-2 lg:py-4">
                Edit Task
              </p>
              <input
                className="py-2 px-4 rounded-md"
                type="text"
                name="title"
                defaultValue={modalTask.title}
              />
              <input
                className="py-2 px-4 rounded-md"
                type="text"
                name="description"
                defaultValue={modalTask.description}
              />
              <input
                type="submit"
                value="Update"
                className="py-2 w-full rounded-md cursor-pointer border"
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
