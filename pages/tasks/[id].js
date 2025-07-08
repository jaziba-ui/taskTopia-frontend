import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const TaskDetailsPage = () => {
    const router = useRouter()
    const { id } = router.query
    const [status,setStatus] = useState("")
    const [task,setTask] = useState(null)

    useEffect(() => {
        const fetchTask = async() => {
            if(!id) return

         const token = localStorage.getItem("token");
        console.log("token",token)

        try{
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      setTask(res.data)
      setStatus(res.data.status)
    }catch(err){
        console.error(err)
    }
        }

    if (id)    fetchTask()
    }, [id])

const handleStatusChange = async(e) => {
    const newStatus = e.target.value;
    const token = localStorage.getItem("token")

    try {
        await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    )
        setStatus(newStatus)
    } catch (error) {
        console.error("Error updating task status:", error);
    }
}


if(!task) return <p>Loading....</p>

return (
  <div className="max-w-4xl mx-auto mt-10 p-6 shadow rounded bg-white text-black">
    <div className="flex flex-col md:flex-row gap-8">
      
      {/* LEFT COLUMN: Title and Description */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4 text-[#85586F]">{task.title}</h1>
        <p className="text-[#6c4f4f] whitespace-pre-line"><strong>Description:</strong><br />{task.description}</p>
      </div>

      {/* RIGHT COLUMN: Due date, Priority, Status, Assigned To */}
      <div className="w-full md:w-[40%] space-y-4 text-[#85586F] pt-5 mt-5">
        <div>
          <p><strong>Due Date:</strong> {task.dueDate?.split("T")[0]}</p>
        </div>
        <div>
          <p><strong>Priority:</strong> {task.priority}</p>
        </div>
        <div>
          <p><strong>Assigned To:</strong> {task.assignedTo?.name || "Unassigned"}</p>
        </div>

        <div>
          <label className="block font-semibold mb-1">Change Status:</label>
          <select
            value={status}
            onChange={handleStatusChange}
            className="w-full bg-[#F8EDE3] text-[#85586F] border border-[#D0B8A8] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D0B8A8] hover:border-[#C3B091] transition"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Verify">Verify</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

    </div>
  </div>
);


}

export default TaskDetailsPage;