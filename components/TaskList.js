import axios from "axios";

const TaskList = ({ tasks = [], onUpdate }) => {
      

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        onUpdate();
    };

    return (
        <ul className="space-y-4">
            {tasks.map((task) => (
                <li
                    key={task._id}
                    className="bg-white border border-[#D0B8A8] p-4 rounded-2xl shadow-lg transition hover:scale-[1.01]"
                >
                    <h3 className="text-xl font-semibold text-[#85586F] mb-1">
                        {task.title}
                    </h3>
                    <p className="text-[#85586F] mb-1">{task.description}</p>
                    <p className="text-sm text-[#85586F]">
                        <strong>Due:</strong> {task.dueDate?.split("T")[0]}
                    </p>
                    <p className="text-sm text-[#85586F]">
                        <strong>Priority:</strong> {task.priority}
                    </p>
                    <p className="text-sm text-[#85586F]">
                        <strong>Status:</strong> {task.status}
                    </p>
                    {task.assignedTo && (
        <p className="text-sm text-[#85586F]">
          <strong>Assigned To:</strong> {task.assignedTo.name}
        </p>
      )}
                    <button
                        onClick={() => handleDelete(task._id)}
                        className="mt-3 inline-block bg-[#DFD3C3] text-[#85586F] px-4 py-1 rounded-full text-sm hover:bg-[#D0B8A8] transition"
                    >
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default TaskList;
