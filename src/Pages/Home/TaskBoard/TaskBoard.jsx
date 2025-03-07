import { useContext } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import { authContext } from "../../../ContextApi/AuthContext";
import { CiEdit } from "react-icons/ci";
import Modal from "./Modal";
import { toast } from "react-toastify";
import { IoCalendarOutline } from "react-icons/io5";
import { GrInProgress } from "react-icons/gr";
import { AiOutlineDelete, AiOutlineFileDone } from "react-icons/ai";

const TaskBoard = () => {
  const { theme, setModalTask, tasks, setTasks, refetch } =
    useContext(authContext);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If dropped outside of droppable area
    if (!destination) return;

    const sourceCategory = source.droppableId;
    const destinationCategory = destination.droppableId;

    // Restrict dragging tasks from Done category
    if (sourceCategory === "Done") return;

    // Restrict direct movement from ToDo to Done
    if (sourceCategory === "ToDo" && destinationCategory === "Done") return;

    // Restrict movement from InProgress back to ToDo
    if (sourceCategory === "InProgress" && destinationCategory === "ToDo")
      return;

    const sourceTasks = [...tasks[sourceCategory]];

    if (sourceCategory === destinationCategory) {
      // Reorder within the same category and update serial
      const [movedTask] = sourceTasks.splice(source.index, 1);
      sourceTasks.splice(destination.index, 0, movedTask);

      const updatedTasks = sourceTasks.map((task, index) => ({
        ...task,
        serial: index + 1, // Update serial based on new position
      }));

      setTasks({
        ...tasks,
        [sourceCategory]: updatedTasks,
      });
      // **PUT API Call to Update Order**
      axios
        .put(
          `${import.meta.env.VITE_URL}/tasksUpdateOrder`,
          { tasks: updatedTasks },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.data.modifiedCount > 0) {
            refetch();
          }
        });
    } else {
      // Move task between categories
      const destinationTasks = [...(tasks[destinationCategory] || [])];
      const [movedTask] = sourceTasks.splice(source.index, 1);

      // Lock task if moved to Done category
      if (destinationCategory === "Done") {
        movedTask.isLocked = true;
        toast.success("🎉 Great job! Task completed successfully!", {
          icon: false,
          className:
            "text-center flex items-center justify-center flex-warp flex-row",
          theme: theme === "light" ? "light" : "dark",
        });
      }
      if (destinationCategory === "InProgress") {
        toast.info("Task moved to InProgress", {
          className:
            "text-center flex items-center justify-center flex-warp flex-row",
          icon: <GrInProgress />,
          theme: theme === "light" ? "light" : "dark",
        });
      }

      movedTask.category = destinationCategory;
      destinationTasks.splice(destination.index, 0, movedTask);

      // Update state with new task order
      setTasks({
        ...tasks,
        [sourceCategory]: sourceTasks,
        [destinationCategory]: destinationTasks,
      });

      // **PUT API Call to Update Category and Lock Status**
      axios
        .put(
          `${import.meta.env.VITE_URL}/tasks/${movedTask._id}`,
          { category: destinationCategory, isLocked: movedTask.isLocked },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.data.modifiedCount > 0) {
            refetch();
          }
        });
    }
  };

  const handleDeleteTask = (taskId) => {
    axios
      .delete(`${import.meta.env.VITE_URL}/tasks/${taskId}`, {
        withCredentials: true,
      })
      .then(() => {
        refetch();
        toast.success(`🗑️ Task deleted successfully!`, {
          className:
            "text-center flex items-center justify-center flex-warp flex-row",
          icon: false,
          theme: theme === "light" ? "light" : "dark",
        });
      });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {["ToDo", "InProgress", "Done"].map((category) => (
          <Droppable key={category} droppableId={category}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`p-4 rounded-lg shadow-xl min-h-[200px] 
                ${
                  category === "Done"
                    ? `${
                        theme === "light"
                          ? "bg-[#A5D6A7] text-gray-600"
                          : "bg-[#1B5E20]/50 text-gray-300"
                      }`
                    : category === "InProgress"
                    ? `${
                        theme === "light"
                          ? "bg-[#FFE082] text-gray-600"
                          : "bg-[#947400]/50 text-gray-300"
                      }`
                    : `${
                        theme === "light"
                          ? "bg-[#BBDEFB] text-gray-600"
                          : "bg-[#1E3A8A]/50 text-gray-300"
                      }`
                }`}
              >
                <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
                  {category}{" "}
                  {category === "Done" ? (
                    <AiOutlineFileDone className={`text-xl md:text-2xl`} />
                  ) : category === "InProgress" ? (
                    <GrInProgress className={`text-xl md:text-2xl`} />
                  ) : (
                    <IoCalendarOutline className={`text-xl md:text-2xl`} />
                  )}
                </h2>

                {tasks[category]
                  ?.sort((a, b) => a.serial - b.serial)
                  .map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                      isDragDisabled={category === "Done" || task.isLocked}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...(category !== "Done" && provided.dragHandleProps)}
                          className={`p-2 my-4 rounded-md cursor-move backdrop-blur-md ${
                            theme === "light"
                              ? "shadow-[0px_0px_10px_0px_rgb(0,0,0,0.2)]"
                              : "shadow-[0px_0px_15px_0px_rgb(255,255,255,0.2)]"
                          } relative list-decimal`}
                        >
                          {category === "ToDo" && (
                            <div className="absolute top-2 right-2 flex gap-4 items-center">
                              <button
                                onClick={() => {
                                  document
                                    .getElementById("my_modal_5")
                                    .showModal();
                                  setModalTask(task);
                                }}
                              >
                                <CiEdit className="cursor-pointer" />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="cursor-pointer"
                              >
                                <AiOutlineDelete />
                              </button>
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="cursor-pointer"
                            >
                              <AiOutlineDelete />
                            </button>
                          </div>
                          <div className="space-y-1">
                            <p
                              className={`text-xs text-right pr-2 ${
                                category === "ToDo" &&
                                new Date(task.dueDate) < new Date()
                                  ? "text-red-400"
                                  : ""
                              }`}
                            >
                              {" "}
                              {category !== "ToDo"
                                ? new Date(task.timestamp).toLocaleString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "2-digit",
                                      year: "numeric",
                                      hour: "numeric",
                                      minute: "2-digit",
                                      hour12: true,
                                    }
                                  )
                                : "Due On : " +
                                  " " +
                                  new Date(task.dueDate).toLocaleString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "2-digit",
                                      hour: "numeric",
                                      minute: "2-digit",
                                      hour12: true,
                                    }
                                  )}
                            </p>
                            <h4 className="md:text-lg font-bold">
                              {task.title}
                            </h4>
                            <p className="text-xs md:text-sm">
                              {task.description}
                            </p>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <Modal />
    </DragDropContext>
  );
};

export default TaskBoard;
