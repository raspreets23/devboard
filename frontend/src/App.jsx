import { useState, useEffect } from "react";

const API_BASE_URL = "https://devboard-api.onrender.com/tasks";

const COLUMNS = [
  { id: "To Do", title: "To Do", badgeColor: "bg-amber-100 text-amber-800 border-amber-300", headerBorder: "border-amber-400" },
  { id: "In Progress", title: "In Progress", badgeColor: "bg-blue-100 text-blue-800 border-blue-300", headerBorder: "border-blue-500" },
  { id: "Done", title: "Done", badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300", headerBorder: "border-emerald-500" },
];

const NEXT_STATUS = {
  "To Do": "In Progress",
  "In Progress": "Done",
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/tasks`);
      if (!res.ok) {
        throw new Error(`Failed to fetch tasks: ${res.statusText}`);
      }
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Failed to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle new task creation
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          assignee: assignee.trim() || null,
          status: "To Do",
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to create task: ${res.statusText}`);
      }

      // Reset form and refresh board
      setTitle("");
      setDescription("");
      setAssignee("");
      await fetchTasks();
    } catch (err) {
      setError(err.message || "Error creating task.");
    } finally {
      setSubmitting(false);
    }
  };

  // Move task forward in pipeline
  const handleMoveForward = async (task) => {
    const nextStatus = NEXT_STATUS[task.status];
    if (!nextStatus) return;

    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update task: ${res.statusText}`);
      }

      await fetchTasks();
    } catch (err) {
      setError(err.message || "Error moving task forward.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navigation / Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
              D
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                DevBoard
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  MVP
                </span>
              </h1>
              <p className="text-xs text-slate-500">Project Management Kanban Board</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="px-3 py-1 bg-slate-100 rounded-full font-medium">
              Total Tasks: <span className="text-indigo-600 font-bold">{tasks.length}</span>
            </span>
            <button
              onClick={fetchTasks}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium transition"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">⚠️ Connection Alert:</span>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-500 hover:text-rose-700 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Task Creation Form */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>➕</span> Add New Task
          </h2>
          <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Task Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Build API authentication"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Assignee
              </label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of details..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>

            <div className="md:col-span-1">
              <button
                type="submit"
                disabled={submitting || !title.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium py-2 px-4 rounded-lg text-sm transition shadow-sm hover:shadow"
              >
                {submitting ? "Adding..." : "Add Task"}
              </button>
            </div>
          </form>
        </section>

        {/* Kanban Board Columns */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((column) => {
            const columnTasks = tasks.filter((t) => t.status === column.id);

            return (
              <div
                key={column.id}
                className="bg-slate-100 rounded-2xl border border-slate-200/80 p-4 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div
                  className={`flex items-center justify-between pb-3 mb-4 border-b-2 ${column.headerBorder}`}
                >
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800 text-base">{column.title}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${column.badgeColor}`}
                    >
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {loading && (
                    <div className="text-center py-8 text-xs text-slate-400">Loading tasks...</div>
                  )}

                  {!loading && columnTasks.length === 0 && (
                    <div className="text-center py-10 px-4 border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs">
                      No tasks in this column
                    </div>
                  )}

                  {!loading &&
                    columnTasks.map((task) => {
                      const canMoveForward = Boolean(NEXT_STATUS[task.status]);

                      return (
                        <div
                          key={task.id}
                          className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition duration-150 flex flex-col justify-between gap-3 group"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-semibold text-slate-900 text-sm leading-snug">
                                {task.title}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-mono">#{task.id}</span>
                            </div>

                            {task.description && (
                              <p className="text-xs text-slate-600 line-clamp-3 mb-2">
                                {task.description}
                              </p>
                            )}

                            {task.assignee && (
                              <div className="flex items-center gap-1.5 mt-2">
                                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center uppercase">
                                  {task.assignee.charAt(0)}
                                </span>
                                <span className="text-xs text-slate-500 font-medium">
                                  {task.assignee}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400 font-medium">
                              Status: <span className="text-slate-600">{task.status}</span>
                            </span>

                            {canMoveForward ? (
                              <button
                                onClick={() => handleMoveForward(task)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition border border-indigo-200"
                              >
                                Move Forward →
                              </button>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Completed ✓
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
