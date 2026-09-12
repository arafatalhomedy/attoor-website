import { useEffect, useState } from "react";
import images from "../assets";
import ImageCarousel from "./imageCarousel";
import { useLanguage } from "../context/languageContext";
import { supabase } from "../lib/supabaseClient";
import { motion } from "motion/react";

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
            ? {
                ...stat,
                value:
                    projectCount === null
                        ? "…"
                        : `${projectCount}+`,
            }
            : stat
    );

    return (
        <motion.section
            id="about"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative bg-transparent py-24"
        >
            <div className="relative z-10 max-w-6xl mx-auto px-6">

                <div className="text-center mb-14">

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: 0.6,
                            ease: "easeOut"
                        }}
                        className="text-gold text-sm font-semibold tracking-wide mb-2 uppercase"
                    >
                        {t.about.tagline}
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: 0.7,
                            delay: 0.1,
                            ease: "easeOut"
                        }}
                        className="text-3xl md:text-4xl font-bold text-charcoal dark:text-white"
                    >
                        {t.about.headline}
                    </motion.h2>

                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                            duration: 0.9,
                            ease: "easeOut"
                        }}
                        className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl group"
                    >
                        <ImageCarousel
                            images={[
                                images.work4,
                                images.work2,
                                images.work6
                            ]}
                            interval={2000}
                            className="w-full h-80 md:h-96 transition-transform duration-500 group-hover:scale-105"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                            duration: 0.9,
                            delay: 0.15,
                            ease: "easeOut"
                        }}
                    >
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.7,
                                delay: 0.25,
                                ease: "easeOut"
                            }}
                            className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8"
                        >
                            {t.about.body}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                                scale: 1
                            }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.35,
                                ease: "easeOut"
                            }}
                            className="grid grid-cols-2 gap-6 bg-white/95 dark:bg-zinc-900/95 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{
                                        opacity: 0,
                                        y: 20
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.45 + index * 0.1,
                                        ease: "easeOut"
                                    }}
                                >
                                    <p className="text-3xl font-bold text-gold">
                                        {stat.value}
                                    </p>

                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </motion.section>
    );
}