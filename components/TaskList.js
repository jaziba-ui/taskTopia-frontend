import axios from "axios";
import Link from 'next/link'

const TaskList = ({ tasks = [], onUpdate }) => {
  // const handleDelete = async (id) => {
  //   const token = localStorage.getItem("token");
  //   await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   onUpdate();
  // };

  const handleNextStage = async(task) => {
    const statusOrder = ["To Do", "In Progress", "Verify", "Completed"]
    const currentIndex = statusOrder.indexOf(task.status)

    if(currentIndex === -1 || currentIndex === statusOrder.length - 1) return

    const nextStatus = statusOrder[currentIndex+1]

    const token = localStorage.getItem("token")

    try{
      await axios.put(
         `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${task._id}`,
         {status : nextStatus},
         {
          headers: {
            Authorization: `Bearer ${token}`
          }
         }
      )

      onUpdate()
    }
    catch(err){
      console.error("Error updating status", err)
    }
  }


console.log("taska",tasks)
  const newTasks = {
  todo: [],
  inProgress: [],
  verify: [],
  completed: [],
};


  tasks.forEach((task) => {
    if (task.status === "To Do") newTasks.todo.push(task);
    else if (task.status === "In Progress") newTasks.inProgress.push(task);
    else if (task.status === "Verify") newTasks.verify.push(task);
    else if (task.status === "Completed" || task.status === "Archive") newTasks.completed.push(task);
  });

  
  const Column = ({ title, tasks }) => (
    <div className="p-4 rounded-lg shadow h-full bg-[var(--accent)] text-[var(--foreground)]">
      <h2 className="text-center font-semibold text-lg mb-4">{title}</h2>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="bg-[var(--button-bg)] p-3 rounded-md shadow border border-gray-200"
          >
            {/* <h6 className="font-semibold">{task.title}</h6>
            <p>{task.description}</p>
            
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Status:</strong> {task.status}</p>
            {task.assignedTo && (
              <p><strong>Assigned To:</strong> {task.assignedTo.name}</p>
            )} */}
            <Link 
            href={`/tasks/${task._id}`}
            >
            <h6 className="font-semibold hover:underline cursor-pointer">
              {task.title}
            </h6>
            </Link>
            <p><strong>🗓</strong> {task.dueDate?.split("T")[0]}</p>
            {task.status !== "Completed" && (
  <button
     onClick={() => handleNextStage(task)}
    className="mt-2 bg-[#85586F] text-white px-4 py-2 rounded-full hover:bg-[#6c4f4f] transition"
  >
    Next Stage
  </button>
)}

          </li>
        ))}
      </ul>
    </div>
  );


  return (
 <div className="bg-background min-h-screen p-4">
      <div className="flex gap-4">
        <div className="w-1/4">
          <Column title="To Do" tasks={newTasks.todo} />
        </div>
        <div className="w-1/4">
          <Column title="In Progress" tasks={newTasks.inProgress} />
        </div>
        <div className="w-1/4">
          <Column title="Verify" tasks={newTasks.verify} />
        </div>
        <div className="w-1/4">
          <Column title="Completed" tasks={newTasks.completed} />
        </div>
      </div>
    </div>
);
};

export default TaskList;
