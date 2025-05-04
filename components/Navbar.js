import axios from "axios";
import { useState } from "react";

const Navbar = ({ notifications: initialNotifications }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n => (n._id === notificationId ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  return (
    <div className="relative">
    <button>
      <i className="bell-icon">🔔</i>
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 text-white bg-red-600 rounded-full text-xs px-2">
          {unreadCount}
        </span>
      )}
    </button>
  
    <div className="absolute right-0 mt-2 bg-white rounded shadow w-64 z-10">
      {/* Notification dropdown content */}
  
        {/* Dropdown list of notifications */}
        <div className="absolute right-0 mt-2 bg-white rounded shadow w-64 z-9">
          {notifications.length === 0 ? (
            <p className="p-2 text-gray-500 text-sm">No notifications</p>
          ) : (
            notifications.map(n => (
              <div
                key={n._id}
                className={`p-2 border-b text-sm ${
                  n.read ? "text-gray-400" : "font-semibold"
                }`}
              >
                <p>{n.message}</p>
                {!n.read && (
                  <button
                    className="text-blue-500 text-xs"
                    onClick={() => handleMarkAsRead(n._id)}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
