"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, Shield, User } from "lucide-react";

interface UserProfile {
  id: string;
  full_name: string | null;
  company: string | null;
  role: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setUsers((data as UserProfile[]) || []);
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Schimbi rolul utilizatorului la "${newRole}"?`)) return;
    setUpdating(userId);
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    }
    setUpdating(null);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Users size={18} className="text-text-ghost" />
          <h1 className="text-2xl font-light">Utilizatori</h1>
        </div>
        <p className="font-body text-sm text-text-muted">
          Gestioneaza utilizatorii si rolurile
        </p>
      </div>

      {loading ? (
        <p className="font-body text-sm text-text-ghost">Se incarca...</p>
      ) : users.length === 0 ? (
        <p className="font-body text-sm text-text-ghost">Niciun utilizator.</p>
      ) : (
        <div className="border border-border-light rounded-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left font-mono text-[10px] tracking-[2px] uppercase text-text-ghost px-4 py-3">Nume</th>
                <th className="text-left font-mono text-[10px] tracking-[2px] uppercase text-text-ghost px-4 py-3">Companie</th>
                <th className="text-left font-mono text-[10px] tracking-[2px] uppercase text-text-ghost px-4 py-3">Rol</th>
                <th className="text-left font-mono text-[10px] tracking-[2px] uppercase text-text-ghost px-4 py-3">Creat la</th>
                <th className="text-center font-mono text-[10px] tracking-[2px] uppercase text-text-ghost px-4 py-3">Actiuni</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border-subtle hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {user.role === "admin" ? (
                        <Shield size={14} className="text-rifc-red" />
                      ) : (
                        <User size={14} className="text-text-ghost" />
                      )}
                      <span className="font-body text-sm text-text-primary">
                        {user.full_name || "Fara nume"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-text-muted">
                    {user.company || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-mono text-[10px] tracking-[1px] uppercase px-2 py-0.5 border rounded-sm ${
                      user.role === "admin"
                        ? "text-rifc-red border-[rgba(220,38,38,0.3)]"
                        : "text-text-ghost border-border-subtle"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-text-ghost">
                    {new Date(user.created_at).toLocaleDateString("ro-RO")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={updating === user.id}
                      className="bg-surface-card border border-border-light rounded-sm px-2 py-1 font-mono text-[10px] text-text-primary focus:outline-none focus:border-border-red-subtle disabled:opacity-50"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
