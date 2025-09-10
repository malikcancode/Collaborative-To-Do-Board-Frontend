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
}) {
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="text-white text-2xl"
      >
        <FaEllipsisV />
      </button>

      {dropdownOpen && (
        <div className="absolute mt-2 w-96 bg-white shadow-lg py-2 z-10">
          <p className="px-4 py-2 text-gray-700 uppercase font-semibold border-b">
            {activeBoard.name}
          </p>

          <div className="px-4 py-2 flex gap-2">
            <input
              type="text"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter User ID"
              className="border rounded px-2 py-1 text-sm flex-1"
            />
            <button
              onClick={handleInviteUser}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Invite
            </button>
          </div>

          <button
            onClick={() => handleDeleteBoard(activeBoard._id)}
            className="w-full text-left cursor-pointer px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            Delete Board
          </button>
        </div>
      )}
    </div>
  );
}

export default BoardDropdown;
