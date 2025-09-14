import React from "react";
import { FaPlus, FaBell, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Navbar({ newBoardName, setNewBoardName, handleCreateBoard, isAdmin }) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-gray-900 text-white shadow">
      <div className="flex items-center gap-2">
        <span
          className="font-bold text-xl tracking-wide cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          MyTrello
        </span>
      </div>

      {isAdmin && (
        <div className="flex-1 max-w-2xl mx-6 flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-800 rounded px-3 py-2 w-full">
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Board name"
              className="bg-transparent outline-none text-sm text-white placeholder-gray-400 w-full"
            />
          </div>
          <button
            onClick={handleCreateBoard}
            className="flex whitespace-nowrap cursor-pointer items-center gap-2 bg-blue-600 px-4 py-2 text-xs font-medium hover:bg-blue-700 transition"
          >
            <FaPlus /> Create Board
          </button>
        </div>
      )}

      <div className="flex items-center gap-5">
        <FaBell
          onClick={() => navigate("/notifications")}
          className="text-xl cursor-pointer hover:text-yellow-400"
        />
        {/* <FaCog
          className="text-xl cursor-pointer hover:text-blue-400"
          onClick={() => navigate("/settings")}
        /> */}
      </div>
    </header>
  );
}

export default Navbar;
