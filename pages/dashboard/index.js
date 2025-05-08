import { useEffect, useState, useRef } from "react";
import axios from "axios";
import TaskForm from "../../components/TaskForm";
import TaskList from "../../components/TaskList";
import FloatingBackground from "@/components/FloatingBackground";
import { useRouter } from "next/router";
import io from "socket.io-client";
import Navbar from "../../components/Navbar.js";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [latestNotification, setLatestNotification] = useState(null);
  const router = useRouter();
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [tasks, setTasks] = useState({
    created: [],
    assigned: [],
    // overdue: [],
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
    console.log("Fetching tasks with filters:", customFilters); // Debugging line
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

    console.log(token,headers)

    if (!user) {
      console.warn("User not loaded yet, skipping task fetch.");
      return;
    }

    if (user.role === "admin" || user.role === "manager") {
      console.log(
        "Created URL:",
        `http://localhost:5000/api/tasks/created-tasks?${query}`
      );
      console.log(
        "Assigned URL:",
        `http://localhost:5000/api/tasks/assigned-tasks?${query}`
      );
      // console.log(
      //   "Overdue URL:",
      //   `http://localhost:5000/api/tasks/overdue-tasks?${query}`
      // );

      try {
        const [createdRes, assignedRes, overdueRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/tasks/created-tasks?${query}`, {
            headers,
          }),
          axios.get(`http://localhost:5000/api/tasks/assigned-tasks?${query}`, {
            headers,
          }),
          // axios.get(`http://localhost:5000/api/tasks/overdue-tasks?${query}`, {
          //   headers,
          // }),
        ]);
        console.log("Created Tasks:", createdRes.data.tasks);
        console.log("Assigned Tasks:", assignedRes.data.tasks);
        // console.log("Overdue Tasks:", overdueRes.data.tasks);
        setTasks({
          created: createdRes.data.tasks || [],
          assigned: assignedRes.data.tasks || [],
          // overdue: overdueRes.data.tasks || [],
        });
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    }

    if (user.role === "user") {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/tasks/assigned-tasks?${query}`,
          { headers }
        );
        console.log("Assigned Tasks:", res.data.tasks);
        setTasks({ created: [], assigned: res.data.tasks || [] });
      } catch (err) {
        console.error("Error fetching user tasks:", err);
      }
    }
  };

  const applyFilters = () => {
    fetchTasks(filters);
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    socketRef.current = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
      socketRef.current.emit("register", user._id);
    });

    socketRef.current.on("new-notification", (data) => {
      console.log("📢 Notification received:", data);
      setNotifications((prev) => [data, ...prev]);
      setLatestNotification(data);
      setShowModal(true);
    });

    socketRef.current.on("new-task", () => {
      fetchTasks();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;

    console.log("User now available:", user);

    fetchTasks();
    fetchNotifications();

    socket.emit("register", user?.id);
    console.log("Socket ID on frontend:", socket.id);

    socket.on("new-notification", (data) => {
      console.log("Notification data: ", data);
      setNotifications((prev) => [data, ...prev]);
      setLatestNotification(data);
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        window.location.reload();
      }, 5000);
    });

    socket.on("new-notification", (data) => {
      console.log("Notification received:", data); // Debugging line
      setNotifications((prev) => [data, ...prev]);
      setLatestNotification(data);
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false); // Close the modal
        window.location.reload(); // Reload the page
      }, 5000);
    });

    socket.on("new-task", () => {
      fetchTasks();
    });

    return () => {
      socket.off("new-task");
      socket.off("new-notification");
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    console.log("User", user);
    console.log("Tasks after setting state:", tasks); // Debugging line
  }, [tasks]);

  const handleModalClose = () => {
    setShowModal(false);
    window.location.reload(); // Reload the page when modal is closed
    // fetchTasks()
  };

  return (
    <div className="relative p-8 overflow-hidden min-h-screen bg-[#F8EDE3]">
      {/* <Navbar notifications={notifications} /> */}
      {user && (
        <div className="text-sm text-right text-[#85586F] font-medium mb-4">
          Logged in as: <span className="font-bold">{user.name}</span> (
          {user.role})
        </div>
      )}
      {user && (user.role === "admin" || user.role === "manager") && (
        <div className="my-6 p-4 border rounded-lg bg-[#DFD3C3] shadow-md">
          <h2 className="text-lg font-semibold text-[#85586F] mb-2">
            User Management
          </h2>
          <button
            className="bg-[#C3B091] text-white px-4 py-2 rounded-full hover:bg-[#B89F8A]"
            onClick={() => router.push("/admin/users")}
          >
            Manage Users
          </button>
        </div>
      )}

      <FloatingBackground />
      {console.log("Latest notification:", latestNotification)}
      {showModal && latestNotification && (
        // console.log("Latest notification:", latestNotification)
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
              onClick={handleModalClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {user?.role !== "user" && (
        <button
          onClick={() => setShowModal(true)}
          className="your-create-button"
        >
          Create Task
        </button>
      )}

      {showModal && user?.role !== "user" && (
        <TaskForm onClose={() => setShowModal(false)} onSuccess={fetchTasks} />
      )}
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

      {user?.role === "admin" || user?.role === "manager" ? (
        <>
          {/* <h2 className="text-xl mt-6">Assigned Tasks</h2>
          {tasks.assigned.length > 0 ? ( 
         <TaskList tasks={tasks.assigned} onUpdate={fetchTasks} /> 
         ) : ( 
          <EmptyTaskMessage message="You haven't assigned any tasks yet." />
     )} */}

          {/* <h2 className="text-xl mt-6 text-red-600">Overdue Tasks</h2>
          {tasks.overdue.length > 0 ? (
            <TaskList tasks={tasks.overdue} onUpdate={fetchTasks} />
          ) : (
            <EmptyTaskMessage message="No overdue tasks. All are on time" />
          )} */}

          <h2 className="text-xl mt-6">Created Tasks</h2>
          {tasks.created.length > 0 ? (
            <TaskList tasks={tasks.created} onUpdate={fetchTasks} />
          ) : (
            <EmptyTaskMessage message="No tasks created yet." />
          )}
        </>
      ) : (
        <>
          <h2 className="text-xl mt-6">Your Assigned Tasks</h2>
          {tasks.assigned.length > 0 ? (
            <TaskList tasks={tasks.assigned} onUpdate={fetchTasks} />
          ) : (
            <EmptyTaskMessage message="You haven't been assigned any tasks yet." />
          )}

          {/* <h2 className="text-xl mt-6 text-red-600">Overdue Tasks</h2>
          {tasks.overdue.length > 0 ? (
            <TaskList tasks={tasks.overdue} onUpdate={fetchTasks} />
          ) : (
            <EmptyTaskMessage message="No overdue tasks.You are on top of it!" />
          )} */}
        </>
      )}
    </div>
  );
};

export default Dashboard;
