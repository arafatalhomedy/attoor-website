import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../context/languageContext";
import GallerySlider from "../components/gallerySlider";
import ProjectCtaBanner from "../components/projectCtaBanner";
import NetworkBackground from "../components/networkBackground";

export default function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { language, t } = useLanguage();

    const [project, setProject] = useState(null);
    const [gallery, setGallery] = useState([]);
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProject();
    }, [id]);

    const fetchProject = async () => {
        setLoading(true);

        const { data: projectData, error: projectError } = await supabase
            .from("projects")
            .select("*")
            .eq("id", id)
            .single();

        if (projectError || !projectData) {
            setProject(null);
            setLoading(false);
            return;
        }

        const { data: mediaData } = await supabase
            .from("project_media")
            .select("*")
            .eq("project_id", id)
            .order("sort_order", { ascending: true });

        setProject(projectData);
        setGallery((mediaData || []).filter((m) => m.media_type === "gallery"));
        setStages((mediaData || []).filter((m) => m.media_type === "stage"));
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="relative max-w-3xl mx-auto px-6 py-24 text-center min-h-screen flex items-center justify-center">
                <NetworkBackground />
                <p className="relative z-10 text-zinc-500 dark:text-zinc-400">Loading...</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="relative max-w-3xl mx-auto px-6 py-24 text-center min-h-screen flex flex-col items-center justify-center">
                <NetworkBackground />
                <p className="relative z-10 text-zinc-600 dark:text-zinc-400">Project not found.</p>
                <Link to="/" className="relative z-10 text-gold font-semibold mt-4 inline-block hover:underline">
                    {t.projects.detail.back}
                </Link>
            </div>
        );
    }

    const title = language === "ar" ? project.title_ar : project.title_en;
    const description = language === "ar" ? project.description_ar : project.description_en;
    const work = language === "ar" ? project.work_ar : project.work_en;
    const location = language === "ar" ? project.location_ar : project.location_en;
    const client = language === "ar" ? project.client_ar : project.client_en;

    return (
        <div className="relative bg-cream dark:bg-[#0a0a0a] min-h-screen overflow-hidden transition-colors duration-300">
            {/* Mesh Background */}
            <NetworkBackground />

            {/* Hero image - GPU composited layer */}
            <div className="relative z-10 h-80 md:h-96 w-full transform-gpu [transform:translateZ(0)]">
                <img
                    src={project.cover_image_url}
                    alt={title}
                    decoding="async"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-gold dark:hover:text-gold mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t.projects.detail.back}
                </button>

                <span className="inline-block text-xs font-semibold text-gold uppercase tracking-wide mb-2">
                    {t.projects.filters[project.category]}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-charcoal dark:text-white mb-6">{title}</h1>

                {/* Meta row - GPU isolated to prevent canvas repaints underneath */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 bg-white/95 dark:bg-zinc-900/95 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 mb-10 shadow-lg transform-gpu [transform:translateZ(0)]">
                    <div>
                        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">{t.projects.labels.date}</p>
                        <p className="text-charcoal dark:text-white font-semibold mt-1">{project.project_date || "-"}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">{t.projects.labels.work}</p>
                        <p className="text-charcoal dark:text-white font-semibold mt-1">{work || "-"}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">{t.projects.detail.location}</p>
                        <p className="text-charcoal dark:text-white font-semibold mt-1">{location || "-"}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">{t.projects.detail.client}</p>
                        <p className="text-charcoal dark:text-white font-semibold mt-1">{client || "-"}</p>
                    </div>
                    <div className="col-span-2 md:col-span-1 text-center md:text-start">
                        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">{t.projects.labels.budget}</p>
                        <p className="text-charcoal dark:text-white font-semibold mt-1">{project.budget || "-"}</p>
                    </div>
                </div>

                {/* Overview */}
                <h2 className="text-xl font-bold text-charcoal dark:text-white mb-3">{t.projects.detail.overview}</h2>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-12">{description}</p>

                {/* Gallery */}
                {gallery.length > 0 && (
                    <>
                        <h2 className="text-xl font-bold text-charcoal dark:text-white mb-4">{t.projects.detail.gallery}</h2>
                        <div className="mb-12 transform-gpu [transform:translateZ(0)]">
                            <GallerySlider images={gallery} interval={2000} />
                        </div>
                    </>
                )}

                {/* Timeline */}
                {stages.length > 0 && (
                    <>
                        <h2 className="text-xl font-bold text-charcoal dark:text-white mb-6">{t.projects.detail.timeline}</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {stages.map((stage) => (
                                <div key={stage.id} className="transform-gpu [transform:translateZ(0)]">
                                    <img
                                        src={stage.image_url}
                                        alt=""
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-28 object-cover rounded-lg mb-2 border border-zinc-200 dark:border-zinc-800"
                                    />
                                    <p className="text-xs font-semibold text-gold">{stage.stage_date}</p>
                                    <p className="text-charcoal dark:text-white font-semibold text-sm">
                                        {language === "ar" ? stage.stage_title_ar : stage.stage_title_en}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="relative z-10">
                <ProjectCtaBanner />
            </div>
        </div>
    );
}