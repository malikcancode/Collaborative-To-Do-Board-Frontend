import React from "react";
import { FaEllipsisV } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function BoardDropdown({
  activeBoard,
  dropdownOpen,
  setDropdownOpen,
  handleDeleteBoard,
  inviteEmail,
  setInviteEmail,
  handleInviteUser,
  handleExitBoard,
  isAdmin,
}) {
  // Invite user
  const handleInvite = async () => {
    try {
      await handleInviteUser(); // call the actual invite function
      toast.success("Invitation sent successfully!");
      setInviteEmail(""); // clear input
    } catch (err) {
      console.error(err);

      // Extract message correctly
      const msg =
        err.response?.data?.message || // Axios response error from backend
        err.data?.message || // fallback if using fetch
        err.message || // JS error
        "Failed to send invitation.";

      toast.error(msg); // show the backend message in toast
    }
  };

  // Exit board (members)
  const handleExit = async () => {
    try {
      await handleExitBoard(activeBoard._id);
      toast.success("Exited board successfully!");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to exit board.";
      toast.error(msg);
    }
  };

  // Delete board (admin)
  const handleDelete = async () => {
    try {
      await handleDeleteBoard(activeBoard._id);
      toast.success("Board deleted successfully!");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to delete board.";
      toast.error(msg);
    }
  };

  return (
    <div className="relative inline-block">
      <div className="flex justify-end relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="text-white text-2xl hover:text-gray-300 transition"
        >
          <FaEllipsisV />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-9 w-80 bg-white shadow-2xl border border-gray-200 z-20">
            {/* Board name */}
            <div className="px-4 py-3 border-gray-200">
              <p className="text-gray-800 font-semibold text-lg truncate">
                Board : {activeBoard.name}
              </p>
            </div>

            {/* Invite user input (admin only) */}
            {isAdmin && (
              <div className="px-4 py-3 flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter user email"
                    className="border border-gray-300 px-3 py-2 text-sm flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={handleInvite}
                    className="bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Invite
                  </button>
                </div>
              </div>
            )}

            {/* Delete board (admin only) */}
            {isAdmin && (
              <div className="px-4 py-3">
                <button
                  onClick={handleDelete}
                  className="w-full bg-red-600 text-white px-4 py-2 text-sm font-semibold hover:bg-red-700 transition"
                >
                  Delete Board
                </button>
              </div>
            )}

            {/* Exit board (members only) */}
            {!isAdmin && (
              <div className="px-4 py-3 flex flex-col gap-2">
                <button
                  onClick={handleExit}
                  className="w-full bg-yellow-600 text-white px-4 py-2 text-sm font-semibold hover:bg-yellow-700 transition"
                >
                  Exit Board
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BoardDropdown;
