"use client";

import { useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type EditState = {
  id: string;
  name: string;
  email: string;
  password: string;
};

function blankForm() {
  return { name: "", email: "", password: "" };
}

export default function AdminUsersPage() {
  const [currentEmail, setCurrentEmail] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add form
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState(blankForm());
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState("");

  // Edit modal
  const [editState, setEditState] = useState<EditState | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");

  // Password visibility
  const [showAddPw, setShowAddPw] = useState(false);
  const [showEditPw, setShowEditPw] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((s) => setCurrentEmail(s?.user?.email ?? ""))
      .catch(() => {});
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      setUsers(await res.json());
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddSaving(true);
    setAddError("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      if (!res.ok) {
        const d = await res.json();
        setAddError(d.error ?? "Failed to create user");
      } else {
        const created = await res.json();
        setUsers((u) => [...u, created]);
        setAdding(false);
        setAddForm(blankForm());
      }
    } catch {
      setAddError("Network error");
    } finally {
      setAddSaving(false);
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editState) return;
    setEditSaving(true);
    setEditError("");
    try {
      const body: Record<string, string> = { name: editState.name, email: editState.email };
      if (editState.password) body.password = editState.password;
      const res = await fetch(`/api/users/${editState.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json();
        setEditError(d.error ?? "Failed to update user");
      } else {
        const updated = await res.json();
        setUsers((u) => u.map((x) => (x.id === updated.id ? updated : x)));
        setEditState(null);
      }
    } catch {
      setEditError("Network error");
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDelete(user: User) {
    if (user.email === currentEmail) {
      alert("You cannot delete your own account.");
      return;
    }
    if (!confirm(`Delete user "${user.name}" (${user.email})? This cannot be undone.`)) return;
    try {
      await fetch(`/api/users/${user.id}`, { method: "DELETE" });
      setUsers((u) => u.filter((x) => x.id !== user.id));
    } catch {
      alert("Failed to delete user");
    }
  }

  function openEdit(user: User) {
    setEditState({ id: user.id, name: user.name, email: user.email, password: "" });
    setEditError("");
    setShowEditPw(false);
  }

  const inputCls = "w-full border border-[#E8DDD0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]";

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#2C2C2C]">User Management</h1>
          <p className="text-sm text-[#8C8277] mt-1">Admin accounts with access to this panel</p>
        </div>
        {!adding && (
          <button
            onClick={() => { setAdding(true); setAddForm(blankForm()); setAddError(""); }}
            className="flex items-center gap-2 bg-[#8B5E3C] hover:bg-[#6B4226] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </button>
        )}
      </div>

      {/* Add user form */}
      {adding && (
        <div className="bg-white border border-[#E8DDD0] rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-base font-semibold text-[#2C2C2C] mb-5">New Admin User</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Name <span className="text-[#8B5E3C]">*</span></label>
                <input
                  type="text"
                  required
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className={inputCls}
                  placeholder="Jason Norris"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Email <span className="text-[#8B5E3C]">*</span></label>
                <input
                  type="email"
                  required
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className={inputCls}
                  placeholder="jason@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Password <span className="text-[#8B5E3C]">*</span></label>
              <div className="relative">
                <input
                  type={showAddPw ? "text" : "password"}
                  required
                  minLength={8}
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  className={inputCls + " pr-10"}
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowAddPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8277] hover:text-[#2C2C2C]"
                  tabIndex={-1}
                  title={showAddPw ? "Hide password" : "Show password"}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showAddPw
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    }
                  </svg>
                </button>
              </div>
            </div>
            {addError && <p className="text-red-500 text-sm">{addError}</p>}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={addSaving}
                className="bg-[#8B5E3C] hover:bg-[#6B4226] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                {addSaving ? "Creating…" : "Create User"}
              </button>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="border border-[#E8DDD0] text-[#8C8277] hover:text-[#2C2C2C] text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users table */}
      {loading ? (
        <p className="text-[#8C8277] text-sm">Loading users…</p>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <div className="bg-white border border-[#E8DDD0] rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#FAF5EE] border-b border-[#E8DDD0]">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-[#2C2C2C]">Name</th>
                <th className="text-left px-5 py-3 font-semibold text-[#2C2C2C]">Email</th>
                <th className="text-left px-5 py-3 font-semibold text-[#2C2C2C] hidden sm:table-cell">Added</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDD0]">
              {users.map((user) => {
                const isYou = user.email === currentEmail;
                return (
                  <tr key={user.id} className="hover:bg-[#FAF5EE]/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-[#2C2C2C]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#8B5E3C]/10 text-[#8B5E3C] flex items-center justify-center font-bold text-xs shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        {user.name}
                        {isYou && (
                          <span className="text-xs bg-[#3D5A3E]/10 text-[#3D5A3E] font-medium px-2 py-0.5 rounded">You</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#8C8277]">{user.email}</td>
                    <td className="px-5 py-4 text-[#8C8277] hidden sm:table-cell">
                      {new Date(user.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(user)}
                          className="text-xs font-medium text-[#8B5E3C] hover:text-[#6B4226] border border-[#E8DDD0] hover:border-[#8B5E3C] px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        {!isYou && (
                          <button
                            onClick={() => handleDelete(user)}
                            className="text-xs font-medium text-red-500 hover:text-red-700 border border-[#E8DDD0] hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-center text-[#8C8277] text-sm py-10">No users found.</p>
          )}
        </div>
      )}

      {/* Edit modal */}
      {editState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-[#2C2C2C] mb-5">Edit User</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Name <span className="text-[#8B5E3C]">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={editState.name}
                  onChange={(e) => setEditState({ ...editState, name: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">Email <span className="text-[#8B5E3C]">*</span></label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={editState.email}
                  onChange={(e) => setEditState({ ...editState, email: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
                  New Password <span className="text-[#8C8277] font-normal">(leave blank to keep current)</span>
                </label>
                <div className="relative">
                  <input
                    type={showEditPw ? "text" : "password"}
                    minLength={8}
                    value={editState.password}
                    onChange={(e) => setEditState({ ...editState, password: e.target.value })}
                    className={inputCls + " pr-10"}
                    placeholder="Min. 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8277] hover:text-[#2C2C2C]"
                    tabIndex={-1}
                    title={showEditPw ? "Hide password" : "Show password"}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showEditPw
                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      }
                    </svg>
                  </button>
                </div>
              </div>
              {editError && <p className="text-red-500 text-sm">{editError}</p>}
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={editSaving}
                  className="bg-[#8B5E3C] hover:bg-[#6B4226] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  {editSaving ? "Saving…" : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditState(null)}
                  className="border border-[#E8DDD0] text-[#8C8277] hover:text-[#2C2C2C] text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
