import React from "react";
import { FaClipboardList } from "react-icons/fa";

function Boards() {
  const boards = [
    { id: 1, name: "Personal Tasks" },
    { id: 2, name: "Team Project" },
  ];

  return (
    <div className="min-h-screen bg-[#1C352D] p-8">
      <h1 className="text-3xl font-bold text-[#F9F6F3] mb-6">My Boards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {boards.map((board) => (
          <div
            key={board.id}
            className="p-6 bg-[#F9F6F3] border border-[#A6B28B] rounded-xl shadow hover:shadow-lg flex flex-col items-center gap-3 transition"
          >
            <FaClipboardList className="text-4xl text-[#1C352D]" />
            <span className="font-semibold text-lg text-[#1C352D]">
              {board.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Boards;
