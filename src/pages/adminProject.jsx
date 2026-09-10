import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;

export default function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
        } else {
            setProjects(data);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this project? This cannot be undone.")) return;

        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) {
            alert("Failed to delete: " + error.message);
        } else {
            setProjects(projects.filter((p) => p.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-cream">
            <div className="bg-charcoal text-white px-6 py-4 flex items-center justify-between">
                <h1 className="text-lg font-bold">Manage Projects</h1>
                <Link to={`/${ADMIN_PATH}`} className="text-sm text-stone-300 hover:text-gold">
                    ← Back to dashboard
                </Link>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-charcoal">Projects</h2>
                    <button
                        onClick={() => navigate(`/${ADMIN_PATH}/projects/new`)}
                        className="bg-gold hover:opacity-90 text-charcoal font-semibold px-4 py-2 rounded-md"
                    >
                        + Add Project
                    </button>
                </div>

                {loading ? (
                    <p className="text-zinc-500">Loading...</p>
                ) : projects.length === 0 ? (
                    <p className="text-zinc-500">No projects yet. Add your first one.</p>
                ) : (
                    <div className="space-y-3">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white rounded-lg border border-zinc-200 p-4 flex items-center justify-between"
                            >
                                <div>
                                    <p className="font-bold text-charcoal">{project.title_en}</p>
                                    <p className="text-sm text-zinc-500">
                                        {project.category} · {project.project_date || "No date"} · {project.published ? "Published" : "Draft"}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => navigate(`/${ADMIN_PATH}/projects/${project.id}`)}
                                        className="text-sm text-zinc-600 hover:text-gold"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
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