import { useEffect, useState } from "react";
import axios from 'axios'

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([])   

      const markAsRead = async (id) => {
        try {
          await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${id}/read`);
          setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, read: true } : n))
          );
        } catch (err) {
          console.error("Failed to mark as read:", err);
        }
      };
      
    useEffect(() => {
        const fetchNotifications = async () => {
          const token = localStorage.getItem("token");
          try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
          } catch (err) {
            console.error("Error fetching notifications", err);
          }
        };
      
        fetchNotifications();
      
        socket.on("new-notification", (data) => {
            console.log("NNNNotification received:", data);
            setNotifications((prev) => [data, ...prev]);
          
            // Trigger browser push notification
            if (Notification.permission === "granted") {
              new Notification("📌 New Task Notification", {
                body: data.message,
              });

              notif.onclick = () => {
                window.focus();
                router.push('/notifications'); // Redirect to your notification page
              };
            }
          });
          

      
        return () => {
          socket.off("new-notification");
        };
      }, []);
      

    return(
        <div className="p-8 bg-[#F8EDE3] min-h-screen">
            <h1 className="text-2xl font-bold mb-6"> Notifications</h1>
            {notifications.length == 0 ? (
                <p>No Notification</p>
            ):(
                <ul className="space-y-4">
                    {notifications.map((note) => (
                        <li
                        key={note._id}
                        onClick={() => markAsRead(note._id)}
                        className={`bg-white shadow p-4 rounded border-l-4 ${
                          note.read ? "border-gray-300" : "border-[#D0B8A8]"
                        } cursor-pointer`}
                      >
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