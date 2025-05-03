import { useEffect, useState } from "react";
import axios from 'axios'

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        const fetchNotifications = async() => {
            const token = localStorage.getItem("token")
            try {
                const res = await axios.get("http://localhost:5000/api/notifications", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setNotifications(res.data)
            } catch (err) {
                console.error("Error fetching notifications", err);
            }
        }
        fetchNotifications()
    }, [])

    return(
        <div className="p-8 bg-[#F8EDE3] min-h-screen">
            <h1 className="text-2xl font-bold mb-6"> Notifications</h1>
            {notifications.length == 0 ? (
                <p>No Notification</p>
            ):(
                <ul className="space-y-4">
                    {notifications.map((note) => (
                        <li key={note._id} className="bg-white shadow p-4 rounded border-l-4 border-[#D0B8A8]">
                            {note.message}
                        </li>
                    ))}
                </ul>
            )
            }
        </div>
    )
}

export default NotificationsPage