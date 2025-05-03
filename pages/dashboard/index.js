import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "../../components/TaskForm";
import TaskList from "../../components/TaskList";
import FloatingBackground from "@/components/FloatingBackground";
import { useRouter } from "next/router";
// import { URLSearchParams } from "next/dist/compiled/@edge-runtime/primitives/url";

const Dashboard = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState({
    created: [],
    assigned: [],
    overdue: [],
  });

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
  });

  const applyFilters = async () => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val) query.append(key, val);
    });
  
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  
    try {
      const [createdRes, assignedRes, overdueRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/tasks/created-tasks?${query}`, { headers }),
        axios.get(`http://localhost:5000/api/tasks/assigned-tasks?${query}`, { headers }),
        axios.get(`http://localhost:5000/api/tasks/overdue-tasks?${query}`, { headers }),
      ]);
  
      setTasks({
        created: createdRes.data.tasks || [],
        assigned: assignedRes.data.tasks || [],
        overdue: overdueRes.data.tasks || [],
      });
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };
  


  const EmptyTaskMessage = ({ message }) => (
    <div className="text-center p-6 border-4 border-dotted border-[#D0B8A8] bg-[#F8EDE3] rounded-xl shadow-sm my-4">
      {/* <div className="text-5xl mb-3">☕</div> */}
      <p className="text-[#85586F] font-semibold">{message}</p>
      <p className="text-sm italic text-[#D0B8A8]">
        Let the ideas percolate...
      </p>
    </div>
  );

  const fetchTasks = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  
    try {
      const [createdRes, assignedRes, overdueRes] = await Promise.all([
        axios.get("http://localhost:5000/api/tasks/created-tasks", { headers }),
        axios.get("http://localhost:5000/api/tasks/assigned-tasks", { headers }),
        axios.get("http://localhost:5000/api/tasks/overdue-tasks", { headers }),
      ]);
  
      console.log("Created Tasks:", createdRes.data.tasks);
      console.log("Assigned Tasks:", assignedRes.data.tasks);
      console.log("Overdue Tasks:", overdueRes.data.tasks);
      setTasks({
        created: createdRes.data.tasks || [],
        assigned: assignedRes.data.tasks || [],
        overdue: overdueRes.data.tasks || [],
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };  

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="relative p-8 overflow-hidden min-h-screen bg-[#F8EDE3]">
      <FloatingBackground />
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <TaskForm onSuccess={fetchTasks} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 mt-3">
        <input
          type="text"
          placeholder="Search by title or desc"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="bg-[#F8EDE3] text-[#85586F] border border-[#D0B8A8] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D0B8A8] hover:border-[#C3B091] transition"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
           className="bg-[#F8EDE3] text-[#85586F] border border-[#D0B8A8] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D0B8A8] hover:border-[#C3B091] transition"
        >
          <option value="">Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
           className="bg-[#F8EDE3] text-[#85586F] border border-[#D0B8A8] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D0B8A8] hover:border-[#C3B091] transition"
        >
          <option value="">Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button
          onClick={applyFilters}
          className="bg-[#DFD3C3] text-[#85586F] px-4 py-2 rounded-full hover:bg-[#D0B8A8] transition"
        >
          Apply Filters
        </button>
      </div>

      {/* Created by You Section */}
      <h2 className="text-xl mt-6">Created by You</h2>
      {console.log(tasks.created)}
      {tasks.created.length > 0 ? (
        <TaskList tasks={tasks.created} onUpdate={fetchTasks} />
      ) : (
        <EmptyTaskMessage message="No tasks created yet." />
      )}

      {/* Assigned to You Section */}
      <h2 className="text-xl mt-6">Assigned to You</h2>
      {tasks.assigned.length > 0 ? (
        <TaskList tasks={tasks.assigned} onUpdate={fetchTasks} />
      ) : (
        <EmptyTaskMessage message="You haven't been assigned any tasks yet." />
      )}

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
