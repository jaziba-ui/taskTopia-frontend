import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "../../components/TaskForm";
import TaskList from "../../components/TaskList";
import FloatingBackground from "@/components/FloatingBackground";
import { useRouter } from "next/router";
import io from "socket.io-client";
import Navbar from "../../components/Navbar.js";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [latestNotification, setLatestNotification] = useState(null);
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
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

  const EmptyTaskMessage = ({ message }) => (
    <div className="text-center p-6 border-4 border-dotted border-[#D0B8A8] bg-[#F8EDE3] rounded-xl shadow-sm my-4">
      {/* <div className="text-5xl mb-3">☕</div> */}
      <p className="text-[#85586F] font-semibold">{message}</p>
      <p className="text-sm italic text-[#D0B8A8]">
        Let the ideas percolate...
      </p>
    </div>
  );

  const fetchTasks = async (customFilters = filters) => {
    const query = new URLSearchParams();
    Object.entries(customFilters).forEach(([key, val]) => {
      if (val) query.append(key, val);
    });

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const [createdRes, assignedRes, overdueRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/tasks/created-tasks?${query}`, {
          headers,
        }),
        axios.get(`http://localhost:5000/api/tasks/assigned-tasks?${query}`, {
          headers,
        }),
        axios.get(`http://localhost:5000/api/tasks/overdue-tasks?${query}`, {
          headers,
        }),
      ]);

      console.log(
        createdRes.data.tasks,
        assignedRes.data.tasks,
        overdueRes.data.tasks
      );
      setTasks({
        created: createdRes.data.tasks || [],
        assigned: assignedRes.data.tasks || [],
        overdue: overdueRes.data.tasks || [],
      });
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const applyFilters = () => {
    fetchTasks(filters);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Socket ID on frontend:", socket.id);
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User ID:", user?.id);
    console.log("User:", user);
    if (user.id) {
      socket.emit("register", user?.id);
      // console.log("Assigned To:", assignedRes.data.tasks)

      socket.on("new-notification", (data) => {
        setNotifications((prev) => [data, ...prev]);
        setLatestNotification(data);
        setShowModal(true);

        // Auto-close the modal and reload after 5 seconds
        setTimeout(() => {
          setShowModal(false); // Close the modal
          window.location.reload(); // Reload the page
        }, 5000);
      });

      socket.on("new-task", () => {
        fetchTasks(); // ✅ Correct one from top
      });
    }
    console.log("Socket ID on frontend2:", socket.id);

    fetchTasks(); // ✅ Call correct version from top
    fetchNotifications();

    return () => {
      socket.off("new-task");
      socket.off("new-notification");
      socket.disconnect();
    };
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
    window.location.reload(); // Reload the page when modal is closed
  };

  return (
    <div className="relative p-8 overflow-hidden min-h-screen bg-[#F8EDE3]">
      {/* <Navbar notifications={notifications} /> */}
      <FloatingBackground />
      {showModal && latestNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm text-center">
            <h3 className="text-lg font-bold text-[#85586F] mb-2">
            🍫 New Notification
            </h3>
            <p className="text-sm text-gray-700">
              {latestNotification.message}
            </p>
            <button
              className="mt-4 px-4 py-2 bg-[#D0B8A8] text-white rounded-full hover:bg-[#C3B091]"
              onClick={handleModalClose}>
                Close
            </button>
          </div>
        </div>
      )}
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
      {/* {console.log(tasks.created)} */}
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
