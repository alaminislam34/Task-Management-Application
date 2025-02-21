import { useContext } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import { authContext } from "../../../ContextApi/AuthContext";
import { CiEdit } from "react-icons/ci";
import Modal from "./Modal";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
const TaskBoard = () => {
  const { theme, setModalTask, tasks, setTasks, refetch } =
    useContext(authContext);
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCategory = source.droppableId;
    const destinationCategory = destination.droppableId;

    if (sourceCategory === "Done") return;

    if (sourceCategory === destinationCategory) {
      const reorderedTasks = [...tasks[sourceCategory]];
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);

      setTasks({
        ...tasks,
        [sourceCategory]: reorderedTasks,
      });
    } else {
      const sourceTasks = [...tasks[sourceCategory]];
      const destinationTasks = [...(tasks[destinationCategory] || [])];
      const [movedTask] = sourceTasks.splice(source.index, 1);

      if (destinationCategory === "Done") {
        movedTask.isLocked = true;
      }

      movedTask.category = destinationCategory;
      destinationTasks.splice(destination.index, 0, movedTask);

      setTasks({
        ...tasks,
        [sourceCategory]: sourceTasks,
        [destinationCategory]: destinationTasks,
      });

      axios.put(`${import.meta.env.VITE_URL}/tasks/${movedTask._id}`, {
        category: destinationCategory,
      });
    }
  };

  const handleDeleteTask = (taskId) => {
    axios
      .delete(`${import.meta.env.VITE_URL}/tasks/${taskId}`)
      .then((res) => {
        console.log(res.data);
        refetch();
        toast.success("Task deleted successfully");
      })
      .catch((err) => console.log(err));
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
                className={`p-3 rounded-lg shadow-xl min-h-[200px] 
                ${
                  category === "Done"
                    ? `${
                        theme === "light"
                          ? "bg-green-200 text-gray-600"
                          : "bg-green-800/70 text-gray-300"
                      }`
                    : category === "InProgress"
                    ? `${
                        theme === "light"
                          ? "bg-yellow-100 text-gray-600"
                          : "bg-yellow-800/70 text-gray-300"
                      }`
                    : `${
                        theme === "light"
                          ? "bg-blue-100 text-gray-600"
                          : "bg-blue-900/80 text-gray-300"
                      }`
                }`}
              >
                <h2 className="text-lg font-semibold mb-2">{category}</h2>
                {tasks[category]
                  ?.slice()
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                      isDragDisabled={category === "Done" || task.isLocked}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...(category !== "Done" && provided.dragHandleProps)}
                          className="p-2 my-2 shadow-xl rounded-md cursor-move relative"
                        >
                          {category !== "Done" && (
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
                                <MdDelete />
                              </button>
                            </div>
                          )}
                          <div className="space-y-2">
                            <p className="text-xs">{task.timestamp}</p>
                            <div className="absolute top-2 right-2">
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="cursor-pointer"
                              >
                                <MdDelete />
                              </button>
                            </div>
                            <h4 className="font-bold">{task.title}</h4>
                            <p className="text-sm ">{task.description}</p>
                          </div>
                        </div>
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
