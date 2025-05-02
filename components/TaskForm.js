import { useState } from "react";
import axios from "axios";

const TaskForm = ({ onSuccess }) => {
    const [task, setTask] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "Low",
      });
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Ensure the dueDate is in a valid format
        const formattedDate = new Date(task.dueDate).toISOString().split('T')[0]; // 'YYYY-MM-DD'
        
        const taskWithValidDate = { ...task, dueDate: formattedDate };
        const token = localStorage.getItem("token");
      
        try {
          await axios.post("http://localhost:5000/api/tasks", taskWithValidDate, {
            headers: { Authorization: `Bearer ${token}` },
          });
      
          setTask({ title: "", description: "", dueDate: "", priority: "Low" });
          onSuccess();
        } catch (error) {
          console.error("Error creating task:", error);
          alert("Failed to create task");
        }
      };
      

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border p-4 rounded shadow"
    >
      <input
        placeholder="Title"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
        className="w-full border p-2"
        required
      />
      <textarea
        placeholder="Description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
        className="w-full border p-2"
      />
      <input
        placeholder="Date"
        value={task.dueDate}
        onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
        className="w-full border p-2"
      />
      <select
        value={task.priority}
        onChange={(e) => setTask({ ...task, priority: e.target.value })}
        className="w-full border p-2"
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <button
        type="submit"
        className="bg-[#DFD3C3] text-[#85586F] px-4 py-2 rounded-full hover:bg-[#D0B8A8] transition duration-300"
        >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
