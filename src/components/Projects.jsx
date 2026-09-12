import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../context/languageContext";
import { motion, AnimatePresence } from "motion/react";

export default function Projects() {
    const { language, t } = useLanguage();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");
    const [index, setIndex] = useState(0);

    const categories = ["all", "residential", "commercial", "renovation"];

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        // Replace: .select("*")
        // With only necessary fields:
        const { data, error } = await supabase
            .from("projects")
            .select("id, title_en, title_ar, category, cover_image_url, project_date, work_en, work_ar, budget")
            .eq("published", true)
            .order("created_at", { ascending: false });
        if (!error) setProjects(data || []);
        setLoading(false);
    };

    const filteredProjects =
        activeFilter === "all"
            ? projects
            : projects.filter((p) => p.category === activeFilter);

    useEffect(() => {
        setIndex(0);
    }, [activeFilter]);

    const total = filteredProjects.length;
    const prevIndex = total > 0 ? (index - 1 + total) % total : 0;
    const nextIndex = total > 0 ? (index + 1) % total : 0;
    const current = filteredProjects[index];

    return (
        <motion.section
            id="projects"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative bg-transparent py-24"
        >
            <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-gold text-sm font-semibold tracking-wide mb-2"
                >
                    {t.projects.tagline}
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                    className="text-3xl md:text-4xl font-bold text-charcoal dark:text-white mb-12"
                >
                    {t.projects.headline}
                </motion.h2>

                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map((cat, filterIndex) => (
                        <motion.button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                                duration: 0.5,
                                delay: 0.15 + filterIndex * 0.08,
                                ease: "easeOut"
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${activeFilter === cat
                                ? "bg-gold text-charcoal shadow-md"
                                : "bg-white/95 dark:bg-zinc-900/95 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-gold dark:hover:border-gold hover:text-charcoal dark:hover:text-white"
                                }`}
                        >
                            {t.projects.filters[cat]}
                        </motion.button>
                    ))}
                </div>
            </div>

            {loading ? (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 text-center text-zinc-600 dark:text-zinc-400 mt-16"
                >
                    Loading projects...
                </motion.p>
            ) : total === 0 ? (
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 text-center text-zinc-600 dark:text-zinc-400 mt-16"
                >
                    No projects in this category yet.
                </motion.p>
            ) : (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: 35 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="relative z-10 max-w-5xl mx-auto mt-16 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
                            className="hidden md:block w-40 h-72 -mr-10 z-0 cursor-pointer overflow-hidden rounded-md border border-zinc-300 dark:border-zinc-700/50"
                            style={{ transform: "skewX(-8deg)" }}
                            onClick={() => setIndex(prevIndex)}
                        >
                            <img
                                src={filteredProjects[prevIndex].cover_image_url}
                                alt=""
                                className="w-full h-full object-cover opacity-60 hover:opacity-80 transition-opacity"
                                style={{ transform: "skewX(8deg) scale(1.3)" }}
                            />
                        </motion.div>

                        <motion.button
                            onClick={() => setIndex(prevIndex)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute left-0 md:left-24 z-20 bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-700 text-charcoal dark:text-white hover:bg-gold hover:border-gold hover:text-charcoal transition-colors duration-300 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                            aria-label="Previous project"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </motion.button>

                        <motion.div
                            className="relative z-10 w-full max-w-xl h-72 md:h-96 shadow-2xl cursor-pointer group overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700/60"
                            onClick={() => navigate(`/projects/${current.id}`)}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={current.id}
                                    src={current.cover_image_url}
                                    alt={language === "ar" ? current.title_ar : current.title_en}
                                    initial={{ opacity: 0, scale: 1.03 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                    className="w-full h-full object-cover group-hover:brightness-95 group-hover:scale-105 transition-all duration-500"
                                />
                            </AnimatePresence>

                            <div className="absolute inset-0 bg-black/10 dark:bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 bg-white/95 text-charcoal text-sm font-semibold px-4 py-2 rounded-full transition-opacity shadow-md">
                                    {language === "ar" ? "عرض التفاصيل" : "View details"}
                                </span>
                            </div>
                        </motion.div>

                        <motion.button
                            onClick={() => setIndex(nextIndex)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute right-0 md:right-24 z-20 bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-700 text-charcoal dark:text-white hover:bg-gold hover:border-gold hover:text-charcoal transition-colors duration-300 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                            aria-label="Next project"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
                            className="hidden md:block w-40 h-72 -ml-10 z-0 cursor-pointer overflow-hidden rounded-md border border-zinc-300 dark:border-zinc-700/50"
                            style={{ transform: "skewX(-8deg)" }}
                            onClick={() => setIndex(nextIndex)}
                        >
                            <img
                                src={filteredProjects[nextIndex].cover_image_url}
                                alt=""
                                className="w-full h-full object-cover opacity-60 hover:opacity-80 transition-opacity"
                                style={{ transform: "skewX(8deg) scale(1.3)" }}
                            />
                        </motion.div>
                    </motion.div>

                    {/* Metadata Card Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 35, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
                        className="relative z-10 max-w-4xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-5 gap-6 text-center px-6 bg-white/95 dark:bg-zinc-900/95 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.35 }}
                        >
                            <p className="text-xs font-semibold text-gold uppercase tracking-wide">
                                {t.projects.labels.name}
                            </p>
                            <p className="text-charcoal dark:text-white font-bold mt-1 text-base">
                                {language === "ar" ? current.title_ar : current.title_en}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <p className="text-xs font-semibold text-gold uppercase tracking-wide">
                                {t.projects.labels.date}
                            </p>
                            <p className="text-charcoal dark:text-white font-medium mt-1">
                                {current.project_date || "-"}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.45 }}
                        >
                            <p className="text-xs font-semibold text-gold uppercase tracking-wide">
                                {t.projects.labels.work}
                            </p>
                            <p className="text-charcoal dark:text-white font-medium mt-1">
                                {language === "ar" ? current.work_ar : current.work_en}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <p className="text-xs font-semibold text-gold uppercase tracking-wide">
                                {t.projects.labels.category}
                            </p>
                            <p className="text-charcoal dark:text-white font-medium mt-1">
                                {t.projects.filters[current.category]}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.55 }}
                        >
                            <p className="text-xs font-semibold text-gold uppercase tracking-wide">
                                {t.projects.labels.budget}
                            </p>
                            <p className="text-charcoal dark:text-white font-medium mt-1">
                                {current.budget || "-"}
                            </p>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </motion.section>
    );
}