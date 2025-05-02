// import axios from "axios";

// const TaskList = ({ tasks = [], onUpdate }) => {
//     if (tasks.length === 0) {
//         return <p>No tasks to display</p>;
//       }
//     const handleDelete = async (id) => {
//         const token = localStorage.getItem("token")
//         await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
//             headers: { Authorization: `Bearer ${token}`}
//         })
//         onUpdate()
//     }

//     return(
//         <ul className="space-y-2">
//             {tasks.map((task) => (
//                 <li key={task._id} className="border p-4 rounded shadow">
//                     <h3 className="text-lg font-semibold">{task.title}</h3>
//                     <p>{task.description}</p>
//                     <p>Due: {task.dueDate?.split("T")[0]}</p>
//                     <p>Priority: {task.priority}</p>
//                     <p>Status: {task.status}</p>
//                     <button onClick={ () => handleDelete(task._id)} className="mt-2 text-sm text-red-600">
//                         Delete
//                     </button>
//                 </li>
//             ))}
//         </ul>
//     )
// }

// export default TaskList

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
