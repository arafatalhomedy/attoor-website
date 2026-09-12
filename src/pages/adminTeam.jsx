import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { logActivity } from "../lib/LogActivity";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;

export default function AdminTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (!error) setMembers(data || []);
    setLoading(false);
  };

  const handleDelete = async (member) => {
    if (!confirm("Delete this team member? This cannot be undone.")) return;

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", member.id);
    if (error) {
      alert("Failed to delete: " + error.message);
    } else {
      await logActivity("deleted", "team", member.name_en, member.name_ar);
      setMembers(members.filter((m) => m.id !== member.id));
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-charcoal text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Manage Team</h1>
        <Link
          to={`/${ADMIN_PATH}`}
          className="text-sm text-stone-300 hover:text-gold"
        >
          ← Back to dashboard
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-charcoal">Team Members</h2>
          <button
            onClick={() => navigate(`/${ADMIN_PATH}/team/new`)}
            className="bg-gold hover:opacity-90 text-charcoal font-semibold px-4 py-2 rounded-md"
          >
            + Add Member
          </button>
        </div>

        {loading ? (
          <p className="text-zinc-500">Loading...</p>
        ) : members.length === 0 ? (
          <p className="text-zinc-500">
            No team members yet. Add your first one.
          </p>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-lg border border-zinc-200 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {member.photo_url && (
                    <img
                      src={member.photo_url}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-bold text-charcoal">{member.name_en}</p>
                    <p className="text-sm text-zinc-500">
                      {member.role_en} · Added{" "}
                      {new Date(member.created_at).toLocaleDateString()} ·{" "}
                      {member.published ? "Published" : "Draft"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/${ADMIN_PATH}/team/${member.id}`)}
                    className="text-sm text-zinc-600 hover:text-gold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
