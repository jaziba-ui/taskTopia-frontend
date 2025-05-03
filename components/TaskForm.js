import { useEffect, useState } from "react";
import axios from "axios";

const TaskForm = ({ onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
    assignedTo: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isNaN(new Date(task.dueDate).getTime())) {
      alert("Invalid due date");
      return;
    }    

    // Ensure the dueDate is in a valid format
    const formattedDate = new Date(task.dueDate).toISOString().split("T")[0]; // 'YYYY-MM-DD'

    const taskWithValidDate = {
      ...task,
      dueDate: formattedDate,
      assignedTo: task.assignedTo || undefined,
    };
    const token = localStorage.getItem("token");

    console.log("Sending task data:", taskWithValidDate);

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

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to load users", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border p-4 rounded shadow"
    >
      <input
        placeholder="Title"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
        // className=""
        className="w-full text-[#85586F] border border-[#D0B8A8] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D0B8A8] hover:border-[#C3B091] transition"
        required
      />
      <textarea
        placeholder="Description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
        className="w-full text-[#85586F] border border-[#D0B8A8] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D0B8A8] hover:border-[#C3B091] transition"
      />
      <input
        type="date"
        value={task.dueDate}
        onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
        className="w-full text-[#85586F] border border-[#D0B8A8] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D0B8A8] hover:border-[#C3B091] transition"
      />

      <select
        value={task.priority}
        onChange={(e) => setTask({ ...task, priority: e.target.value })}
        className="w-full bg-[#F8EDE3] text-[#85586F] border border-[#D0B8A8] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D0B8A8] hover:border-[#C3B091] transition"
        >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <select
        value={task.assignedTo}
        onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
        className="w-full border bg-[#F8EDE3] text-[#85586F] border border-[#D0B8A8] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D0B8A8] hover:border-[#C3B091] transition"
        >
        <option value="">Assign to (optional)</option>
        {users?.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.email})
          </option>
        ))}
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
