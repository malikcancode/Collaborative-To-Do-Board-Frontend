import React from "react";
import { FaEllipsisV } from "react-icons/fa";

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
          <div className="absolute right-0 mt-9 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-20">
            {/* Board name */}
            <div className="px-4 py-3 border-gray-200">
              <p className="text-gray-800 font-semibold text-lg truncate">
                Board : {activeBoard.name}
              </p>
            </div>

            {/* Invite user input (only admin) */}
            {isAdmin && (
              <div className="px-4 py-3 flex gap-2">
                <input
                  type="text"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter user email"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleInviteUser}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  Invite
                </button>
              </div>
            )}

            {/* Delete Board (only admin) */}
            {isAdmin && (
              <div className="px-4 py-3">
                <button
                  onClick={() => handleDeleteBoard(activeBoard._id)}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                >
                  Delete Board
                </button>
              </div>
            )}

            {/* Exit Board (for members only) */}
            {!isAdmin && (
              <div className="px-4 py-3">
                <button
                  onClick={() => handleExitBoard(activeBoard._id)}
                  className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-700 transition"
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
