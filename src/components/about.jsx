import { useEffect, useState } from "react";
import images from "../assets";
import ImageCarousel from "./imageCarousel";
import { useLanguage } from "../context/languageContext";
import { supabase } from "../lib/supabaseClient";

export default function About() {
    const { t } = useLanguage();
    const [projectCount, setProjectCount] = useState(null);

    useEffect(() => {
        fetchProjectCount();

        const channel = supabase
            .channel("about_projects_count")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "projects" },
                () => {
                    fetchProjectCount();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchProjectCount = async () => {
        const { count, error } = await supabase
            .from("projects")
            .select("*", { count: "exact", head: true })
            .eq("published", true);

        if (!error) setProjectCount(count);
    };

    const stats = t.about.stats.map((stat, index) =>
        index === 0
            ? { ...stat, value: projectCount === null ? "…" : `${projectCount}+` }
            : stat
    );

    return (
        <section
            id="about"
            className="relative bg-transparent py-24"
        >
            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <div className="text-center mb-14">
                    <p className="text-gold text-sm font-semibold tracking-wide mb-2 uppercase">
                        {t.about.tagline}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-charcoal dark:text-white">
                        {t.about.headline}
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl group">
                        <ImageCarousel
                            images={[images.work4, images.work2, images.work6]}
                            interval={2000}
                            className="w-full h-80 md:h-96 transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    <div>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
                            {t.about.body}
                        </p>

                        <div className="grid grid-cols-2 gap-6 bg-white/95 dark:bg-zinc-900/95 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
                            {stats.map((stat) => (
                                <div key={stat.label}>
                                    <p className="text-3xl font-bold text-gold">{stat.value}</p>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}