import AddTask from "../AddTask/AddTask";
import TaskBoard from "./TaskBoard/TaskBoard";

const Home = () => {
  return (
    <div>
      <AddTask />
      <TaskBoard />
    </div>
  );
};

export default Home;
