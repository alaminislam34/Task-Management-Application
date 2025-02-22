import { useContext } from "react";
import AddTask from "../AddTask/AddTask";
import TaskBoard from "./TaskBoard/TaskBoard";
import { authContext } from "../../ContextApi/AuthContext";
import { MdAddTask } from "react-icons/md";

const Home = () => {
  const { theme } = useContext(authContext);
  return (
    <div>
      <AddTask />
      <div className={`text-center py-4 px-2 space-y-2 `}>
        <h2 className="text-xl lg:text-2xl font-semibold">
          Welcome to Your Task Management App!
        </h2>
        <p className="text-sm md:text-base lg:text-lg">
          We are thrilled to have you here. Let’s get started and make your
          productivity skyrocket!
        </p>
      </div>

      <div className="flex justify-center items-center my-4 md:my-6">
        <button
          onClick={() => document.getElementById("my_modal_4").showModal()}
          className={`btn py-2 px-4 rounded-xl ${
            theme === "light" ? "bg-blue-200" : "bg-[#1C2948]"
          }`}
        >
          Add Task <MdAddTask className="text-lg lg:text-xl" />
        </button>
      </div>
      <TaskBoard />
    </div>
  );
};

export default Home;
