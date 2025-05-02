import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "../../components/TaskForm";
import TaskList from "../../components/TaskList";
import FloatingBackground from "@/components/FloatingBackground";

const Dashboard = () => {
  const [tasks, setTasks] = useState({
    created: [],
    assigned: [],
    overdue: [],
  });

  const EmptyTaskMessage = ({ message }) => (
    <div className="text-center p-6 border-4 border-dotted border-[#D0B8A8] bg-[#F8EDE3] rounded-xl shadow-sm my-4">
      {/* <div className="text-5xl mb-3">☕</div> */}
      <p className="text-[#85586F] font-semibold">{message}</p>
      <p className="text-sm italic text-[#D0B8A8]">Let the ideas percolate...</p>
    </div>
  );
  
  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    console.log(token);
    
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);  // Log the response to verify the structure
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="relative p-8 overflow-hidden min-h-screen bg-[#F8EDE3]">
        <FloatingBackground/>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <TaskForm onSuccess={fetchTasks} />
  
      {/* Created by You Section */}
      <h2 className="text-xl mt-6">Created by You</h2>
      {tasks.created.length > 0 ? (
        <TaskList tasks={tasks.created} onUpdate={fetchTasks} />
      ) : (
        <EmptyTaskMessage message="No tasks created yet." />
      )}
  
      {/* Assigned to You Section */}
      <h2 className="text-xl mt-6">Assigned by You</h2>
      {tasks.assigned.length > 0 ? (
        <TaskList tasks={tasks.assigned} onUpdate={fetchTasks} />
      ) : (
        <EmptyTaskMessage message="You haven't assigned any tasks yet." />      )}
  
      {/* Overdue Tasks Section */}
      <h2 className="text-xl mt-6 text-red-600">Overdue Tasks</h2>
      {tasks.overdue.length > 0 ? (
        <TaskList tasks={tasks.overdue} onUpdate={fetchTasks} />
      ) : (
        <EmptyTaskMessage message="No overdue tasks. You're on top of it!" />
    )}
    </div>
  );
  
};

export default Dashboard;
