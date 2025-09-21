import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate
import socket from "../api/socket";
import { fetchNotifications, deleteNotification } from "../api/api";
import { toast } from "react-toastify";

function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const navigate = useNavigate(); // navigation

  useEffect(() => {
    loadNotifications();

    const userId = localStorage.getItem("userId");
    if (userId) {
      socket.emit("registerUser", userId);
    }

    // Join all boards the user is a member of
    const boards = JSON.parse(localStorage.getItem("boards") || "[]");
    boards.forEach((b) => socket.emit("joinBoard", b._id));

    const handleReminder = (data) => {
      console.log("[SOCKET REMINDER RECEIVED]", data);
      setNotifications((prev) => [data, ...prev]);
      toast.info(`Reminder: ${data.title}`, { autoClose: 5000 });
    };

    socket.on("deadlineReminder", handleReminder);

    return () => socket.off("deadlineReminder", handleReminder);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const data = await deleteNotification(id);
      console.log("Deleted:", data);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  return (
    <div className="p-6 bg-blue-900 min-h-screen w-full">
      <div className="max-w-7xl mx-auto relative">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-0 right-0 mt-2 mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold text-white mb-4">Notifications</h2>

        {notifications.length === 0 && (
          <p className="text-gray-200 text-center">No notifications</p>
        )}

        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n._id}
              onClick={() => setSelectedNotification(n)}
              className={`rounded-xl shadow-md p-4 flex justify-between items-start w-full cursor-pointer transition
        ${n.read ? "bg-gray-200 text-gray-700" : "bg-white hover:bg-gray-50"}`}
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{n.title}</p>
                <p
                  className="text-gray-600 text-sm mt-1"
                  dangerouslySetInnerHTML={{ __html: n.message }}
                />
                {n.deadline && (
                  <span className="text-sm text-gray-500 block mt-1">
                    ⏰ Deadline: {new Date(n.deadline).toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex flex-col items-end space-y-2 ml-4">
                {!n.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(n._id);
                    }}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(n._id);
                  }}
                  className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 flex items-center justify-center bg-blue-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl p-6 relative">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {selectedNotification.title}
            </h3>

            {selectedNotification.description && (
              <p className="text-gray-800 mb-3">
                {selectedNotification.description}
              </p>
            )}

            <p
              className="text-gray-700 mb-3"
              dangerouslySetInnerHTML={{ __html: selectedNotification.message }}
            />
            {selectedNotification.deadline && (
              <p className="text-sm text-gray-600">
                ⏰ Deadline:{" "}
                {new Date(selectedNotification.deadline).toLocaleString()}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Created:{" "}
              {new Date(selectedNotification.createdAt).toLocaleString()}
            </p>

            <button
              onClick={() => setSelectedNotification(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
