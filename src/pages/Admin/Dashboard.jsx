import React, { useState, useEffect, useCallback } from "react";
import {
  getBoards,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addList,
  deleteList,
  createBoard,
  getBoard,
  exitBoard,
  inviteUser,
  deleteBoard,
} from "../../api/api";
import TaskModal from "../../components/TaskModal";
import Navbar from "../../components/Navbar";
import Column from "../../components/Column";
import BoardDropdown from "../../components/BoardDropdown";
import socket from "../../api/socket";

function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [tasksByList, setTasksByList] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalList, setModalList] = useState(null);
  const [newBoardName, setNewBoardName] = useState("");
  const [newListName, setNewListName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [activeRole, setActiveRole] = useState("member");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [saving, setSaving] = useState(false); // prevents duplicate submission

  const getMemberId = (m) =>
    m?.user?._id ? m.user._id.toString() : m.user?.toString();

  const fetchBoards = useCallback(async () => {
    try {
      const data = await getBoards();
      setBoards(data);
      if (data.length > 0) {
        setActiveBoard(data[0]);
        const userId = localStorage.getItem("userId");
        const membership = data[0].members?.find(
          (m) => getMemberId(m) === userId
        );
        setActiveRole(membership?.role || "member");
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchTasks = useCallback(async (boardId) => {
    try {
      const data = await getTasks(boardId);
      setTasksByList(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  // --- Socket Registration (run only once) ---
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) socket.emit("registerUser", userId);

    const handleBoardInvited = (newBoard) => {
      setBoards((prev) =>
        prev.some((b) => b._id === newBoard._id) ? prev : [...prev, newBoard]
      );
      socket.emit("joinBoard", newBoard._id);
      if (!activeBoard) {
        setActiveBoard(newBoard);
        setLists(newBoard.lists || []);
        fetchTasks(newBoard._id);
      }
    };

    const handleTaskChanged = ({ type, task, taskId }) => {
      setTasksByList((prev) => {
        const updated = { ...prev };

        if (type === "created" && task) {
          if (!updated[task.listId]) updated[task.listId] = [];
          if (!updated[task.listId].some((t) => t._id === task._id))
            updated[task.listId].push(task);
        } else if (type === "updated" && task) {
          // Remove task from all lists first (in case listId changed)
          Object.keys(updated).forEach((lid) => {
            updated[lid] = updated[lid].filter((t) => t._id !== task._id);
          });

          // Insert into the new list
          if (!updated[task.listId]) updated[task.listId] = [];
          updated[task.listId].splice(
            task.position ?? updated[task.listId].length,
            0,
            task
          );
        } else if (type === "deleted" && taskId) {
          Object.keys(updated).forEach((lid) => {
            updated[lid] = updated[lid].filter((t) => t._id !== taskId);
          });
        }

        return updated;
      });
    };

    const handleListChanged = ({ type, list, listId }) => {
      setLists((prev) => {
        if (type === "created" && list) return [...prev, list];
        if (type === "deleted" && listId)
          return prev.filter((l) => l._id !== listId);
        return prev;
      });
    };

    socket.on("boardInvited", handleBoardInvited);
    socket.on("taskChanged", handleTaskChanged);
    socket.on("listChanged", handleListChanged);

    return () => {
      socket.off("boardInvited", handleBoardInvited);
      socket.off("taskChanged", handleTaskChanged);
      socket.off("listChanged", handleListChanged);
    };
  }, [activeBoard, fetchTasks]);

  // --- Handle active board changes ---
  useEffect(() => {
    if (!activeBoard) return;

    // Leave previous boards automatically
    socket.emit("joinBoard", activeBoard._id);

    setLists(activeBoard.lists || []);
    fetchTasks(activeBoard._id);

    const userId = localStorage.getItem("userId");
    const membership = activeBoard.members?.find(
      (m) => getMemberId(m) === userId
    );
    setActiveRole(membership?.role || "member");
  }, [activeBoard]);

  // --- Board / List Actions ---
  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    const created = await createBoard({ name: newBoardName });
    const populated = await getBoard(created._id);
    setBoards((prev) => [...prev, populated]);
    setActiveBoard(populated);
    setNewBoardName("");
  };

  const handleDeleteBoard = async (boardId) => {
    await deleteBoard(boardId);
    setBoards((prev) => prev.filter((b) => b._id !== boardId));
    if (activeBoard?._id === boardId) setActiveBoard(null);
  };

  const handleExitBoard = async (boardId) => {
    await exitBoard(boardId);
    setBoards((prev) => prev.filter((b) => b._id !== boardId));
    setActiveBoard(null);
  };

  const handleAddList = async () => {
    if (!newListName.trim() || !activeBoard) return;
    try {
      await addList(activeBoard._id, newListName);
      setNewListName("");
    } catch (err) {
      console.error("Error adding list:", err);
    }
  };

  const handleDeleteList = async (listId) => {
    if (!activeBoard) return;
    await deleteList(activeBoard._id, listId);
  };

  const handleInviteUser = async () => {
    if (!activeBoard || !inviteEmail.trim()) return;
    await inviteUser(activeBoard._id, inviteEmail);
    setInviteEmail("");
  };

  // --- Task Actions ---
  const handleSaveTask = async (taskData) => {
    if (!activeBoard || saving) return;

    setSaving(true);
    const payload = {
      ...taskData,
      listId: editingTask ? editingTask.listId : modalList._id,
    };

    try {
      if (editingTask) {
        await updateTask(activeBoard._id, editingTask._id, payload);
      } else {
        await createTask(activeBoard._id, payload);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setModalOpen(false);
      setEditingTask(null);
      setModalList(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!activeBoard) return;
    await deleteTask(activeBoard._id, taskId);
  };

  const openTaskModal = (listId) => {
    setModalList(lists.find((l) => l._id === listId) || null);
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  // --- Task Move ---
  const handleMoveTask = async (taskId, fromListId, toListId, toIndex = 0) => {
    if (!activeBoard) return;

    // --- Optimistic UI update ---
    setTasksByList((prev) => {
      const updated = { ...prev };
      const task = updated[fromListId]?.find((t) => t._id === taskId);
      if (!task) return prev;

      updated[fromListId] = updated[fromListId].filter((t) => t._id !== taskId);

      const movedTask = { ...task, listId: toListId, position: toIndex };
      const newList = [...(updated[toListId] || [])];
      newList.splice(toIndex, 0, movedTask);
      updated[toListId] = newList;

      return updated;
    });

    try {
      await updateTask(activeBoard._id, taskId, {
        listId: toListId,
        position: toIndex,
      });
    } catch (err) {
      console.error("[MOVE TASK ERROR]", err);
      fetchTasks(activeBoard._id); // rollback
    }
  };

  // --- Render ---
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar
        newBoardName={newBoardName}
        setNewBoardName={setNewBoardName}
        handleCreateBoard={handleCreateBoard}
        isAdmin={activeRole === "admin" || boards.length === 0}
      />

      <main className="flex-1 p-4 bg-blue-900 overflow-x-auto">
        {activeBoard ? (
          <div className="flex flex-col gap-6">
            <BoardDropdown
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
              activeBoard={activeBoard}
              inviteEmail={inviteEmail}
              setInviteEmail={setInviteEmail}
              handleInviteUser={handleInviteUser}
              isAdmin={activeRole === "admin"}
              handleDeleteBoard={handleDeleteBoard}
              handleExitBoard={handleExitBoard}
            />

            <div className="flex items-start gap-4 w-max">
              {lists.map((list) => (
                <Column
                  key={list._id}
                  title={list.name}
                  cards={tasksByList[list._id] || []}
                  moveCard={handleMoveTask}
                  onAddCard={openTaskModal}
                  col={list._id}
                  onDeleteTask={handleDeleteTask}
                  onEditTask={openEditModal}
                  onDeleteList={handleDeleteList}
                />
              ))}

              {(activeRole === "admin" || activeRole === "member") && (
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
        task={editingTask || null}
      />
    </div>
  );
}

export default Dashboard;
