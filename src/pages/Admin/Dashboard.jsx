import React, { useState, useEffect } from "react";
import {
  getBoards,
  createBoard,
  getTasks,
  createTask,
  updateTask,
  deleteBoard,
  deleteTask,
  addList,
  inviteUser,
  deleteList,
} from "../../api/api";
import TaskModal from "../../components/TaskModal";
import Navbar from "../../components/Navbar";
import Column from "../../components/Column";
import BoardDropdown from "../../components/BoardDropdown";
import socket from "../../api/socket";

function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [newBoardName, setNewBoardName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [lists, setLists] = useState([]);
  const [tasksByList, setTasksByList] = useState({});
  const [newListName, setNewListName] = useState("");
  const [modalList, setModalList] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [activeRole, setActiveRole] = useState("member");

  // Join board room when activeBoard changes
  useEffect(() => {
    if (activeBoard) {
      socket.emit("joinBoard", activeBoard._id);
      setLists(activeBoard.lists || []);
      fetchTasks(activeBoard._id);

      const userId = localStorage.getItem("userId");
      if (activeBoard.owner && activeBoard.owner._id === userId) {
        setActiveRole("admin");
      } else if (activeBoard.members && Array.isArray(activeBoard.members)) {
        const membership = activeBoard.members.find(
          (m) => m.user._id === userId
        );
        setActiveRole(membership ? membership.role : "member");
      } else {
        setActiveRole("basic");
      }
    }
  }, [activeBoard]);

  // Socket listeners for real-time updates
  useEffect(() => {
    const handleTaskChanged = ({ type, task, taskId }) => {
      console.log("Task event received:", type, task, taskId);
      if (activeBoard) fetchTasks(activeBoard._id);
    };

    const handleListChanged = ({ type, list, listId }) => {
      console.log("List event received:", type, list, listId);
      if (activeBoard) fetchBoards();
    };

    socket.on("taskChanged", handleTaskChanged);
    socket.on("listChanged", handleListChanged);

    return () => {
      socket.off("taskChanged", handleTaskChanged);
      socket.off("listChanged", handleListChanged);
    };
  }, [activeBoard]);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const data = await getBoards();
      setBoards(data);

      const userId = localStorage.getItem("userId");
      if (data.length > 0) {
        setActiveBoard(data[0]);
        if (data[0].members && Array.isArray(data[0].members)) {
          const membership = data[0].members.find((m) => m.user._id === userId);
          setActiveRole(membership ? membership.role : "basic");
        } else {
          setActiveRole("basic");
        }
      } else {
        setActiveRole("basic");
      }
    } catch (err) {
      console.error("Error fetching boards:", err);
    }
  };

  const fetchTasks = async (boardId) => {
    try {
      const data = await getTasks(boardId);
      setTasksByList(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    try {
      const newBoard = await createBoard({ name: newBoardName });
      setBoards([...boards, newBoard]);
      setActiveBoard(newBoard);
      setNewBoardName("");
    } catch (err) {
      console.error("Error creating board:", err);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    try {
      await deleteBoard(boardId);
      setBoards(boards.filter((b) => b._id !== boardId));
      if (activeBoard && activeBoard._id === boardId) {
        setActiveBoard(null);
      }
      setDropdownOpen(false);
    } catch (err) {
      console.error("Error deleting board:", err);
    }
  };

  const moveCard = async (cardId, fromCol, toCol) => {
    if (!activeBoard) return;
    try {
      if (fromCol !== toCol) {
        const newPosition = tasksByList[toCol]?.length || 0;
        await updateTask(activeBoard._id, cardId, {
          listId: toCol,
          position: newPosition,
        });
        // emit so others see update
        socket.emit("taskChanged", {
          boardId: activeBoard._id,
          type: "updated",
          taskId: cardId,
        });
        await fetchTasks(activeBoard._id);
      }
    } catch (error) {
      console.error("Error moving card:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!activeBoard) return;
    try {
      await deleteTask(activeBoard._id, taskId);
      socket.emit("taskChanged", {
        boardId: activeBoard._id,
        type: "deleted",
        taskId,
      });
      await fetchTasks(activeBoard._id);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const openTaskModal = (listId) => {
    const listObj = lists.find((l) => l._id === listId);
    setModalList(listObj || null);
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    if (!activeBoard) return;
    try {
      const payload = {
        ...taskData,
        listId: editingTask ? editingTask.listId : modalList._id,
      };
      if (editingTask) {
        const updated = await updateTask(
          activeBoard._id,
          editingTask._id,
          payload
        );
        socket.emit("taskChanged", {
          boardId: activeBoard._id,
          type: "updated",
          task: updated,
        });
      } else {
        const created = await createTask(activeBoard._id, payload);
        socket.emit("taskChanged", {
          boardId: activeBoard._id,
          type: "created",
          task: created,
        });
      }
      await fetchTasks(activeBoard._id);
      setModalOpen(false);
      setEditingTask(null);
      setModalList(null);
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  const handleAddList = async () => {
    if (!newListName.trim() || !activeBoard) return;
    const newList = await addList(activeBoard._id, newListName);
    setLists([...lists, newList]);
    setNewListName("");
  };

  const handleInviteUser = async () => {
    if (!activeBoard || !inviteEmail.trim()) return;
    try {
      await inviteUser(activeBoard._id, inviteEmail);
      alert("User invited successfully!");
      setInviteEmail("");
    } catch (err) {
      console.error("Error inviting user:", err);
      alert(err.message || "Failed to invite user");
    }
  };

  const handleDeleteList = async (listId) => {
    if (!activeBoard) return;
    try {
      await deleteList(activeBoard._id, listId);
      setLists(lists.filter((l) => l._id !== listId));
    } catch (err) {
      console.error("Error deleting list:", err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar
        newBoardName={newBoardName}
        setNewBoardName={setNewBoardName}
        handleCreateBoard={handleCreateBoard}
        isAdmin={activeRole === "admin" || activeRole === "basic"}
      />

      <main className="flex-1 p-4 bg-cover bg-center bg-blue-900 overflow-x-auto relative">
        {activeBoard ? (
          <div className="flex flex-col gap-6">
            <BoardDropdown
              activeBoard={activeBoard}
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
              handleDeleteBoard={handleDeleteBoard}
              inviteEmail={inviteEmail}
              setInviteEmail={setInviteEmail}
              handleInviteUser={handleInviteUser}
              isAdmin={activeRole === "admin"}
            />

            <div className="flex items-start gap-4 w-max">
              {lists.map((list) => (
                <Column
                  key={list._id}
                  title={list.name}
                  cards={tasksByList[list._id] || []}
                  moveCard={moveCard}
                  onAddCard={openTaskModal}
                  col={list._id}
                  onDeleteTask={handleDeleteTask}
                  onEditTask={openEditModal}
                  onDeleteList={handleDeleteList}
                />
              ))}

              {(activeRole === "admin" || activeRole === "basic") && (
                <div className="w-72 bg-gray-200 rounded-md shadow flex flex-col items-center justify-center p-4">
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="List name"
                    className="mb-2 px-2 py-1 rounded border w-full"
                  />
                  <button
                    onClick={handleAddList}
                    className="bg-blue-600 text-white px-3 py-1 rounded w-full"
                  >
                    + Add another list
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-white text-center h-[80vh] flex items-center justify-center">
            No boards found. Create one above.
          </p>
        )}
      </main>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        defaultStatus="To Do"
        task={editingTask}
      />
    </div>
  );
}

export default Dashboard;
