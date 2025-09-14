import React, { useEffect, useState } from "react";
import socket from "../api/socket"; // your socket instance
import { getAuthHeader } from "../api/api";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    // Fetch initial notifications
    fetchNotifications();

    const userId = localStorage.getItem("userId");
    if (userId) socket.emit("registerUser", userId);

    const handleReminder = (data) => {
      setNotifications((prev) => [data, ...prev]);
    };

    socket.on("deadlineReminder", handleReminder);

    return () => {
      socket.off("deadlineReminder", handleReminder);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_BASE}/notifications`, {
        headers: getAuthHeader(),
      });
      setNotifications(response.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${API_BASE}/notifications/${id}/mark-read`,
        {},
        { headers: getAuthHeader() }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  return (
    <div className="p-6 bg-blue-900 min-h-screen w-full">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Notifications</h2>

        {notifications.length === 0 && (
          <p className="text-gray-200 text-center">No notifications</p>
        )}

        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n._id}
              onClick={() => setSelectedNotification(n)}
              className={`rounded-xl shadow-md p-4 flex justify-between items-start w-full cursor-pointer transition ${
                n.read ? "bg-gray-100" : "bg-white hover:bg-gray-50"
              }`}
            >
              <div>
                <p className="font-semibold text-gray-900">{n.title}</p>

                {/* ✅ show description if exists */}
                {/* {n.description && (
                  <p className="text-gray-700 text-sm">{n.description}</p>
                )} */}
                <p
                  className="text-gray-600 text-sm"
                  dangerouslySetInnerHTML={{ __html: n.message }}
                />

                {n.deadline && (
                  <span className="text-sm text-gray-500 block mt-1">
                    Deadline: {new Date(n.deadline).toLocaleString()}
                  </span>
                )}
              </div>
              {!n.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(n._id);
                  }}
                  className="ml-4 px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Mark Read
                </button>
              )}
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

            {/* ✅ show description inside modal */}
            {selectedNotification.description && (
              <p className="text-gray-800 mb-3">
                {selectedNotification.description}
              </p>
            )}

            <p
              className="text-gray-700 mb-3"
              dangerouslySetInnerHTML={{
                __html: selectedNotification.message,
              }}
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
