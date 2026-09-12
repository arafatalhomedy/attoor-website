import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../context/languageContext";
import { motion, AnimatePresence } from "motion/react";

const PAGE_SIZE = 4;

export default function Team() {
    const { language, t } = useLanguage();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMember, setActiveMember] = useState(null);

    useEffect(() => {
        fetchMembers();

        const channel = supabase
            .channel("team_members_changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "team_members" },
                () => {
                    fetchMembers();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchMembers = async () => {
        const { data, error } = await supabase
            .from("team_members")
            .select("*")
            .eq("published", true)
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: true });

        if (!error) setMembers(data || []);
        setLoading(false);
    };

    // Close modal on Escape key
    useEffect(() => {
        if (!activeMember) return;

        const handleKey = (e) => {
            if (e.key === "Escape") setActiveMember(null);
        };

        window.addEventListener("keydown", handleKey);

        return () => window.removeEventListener("keydown", handleKey);
    }, [activeMember]);

    /*
     * Duplicate the first 4 members at the end.
     * This allows the carousel to keep moving smoothly
     * and reset without showing a jump.
     */
    const carouselMembers =
        members.length > PAGE_SIZE
            ? [...members, ...members.slice(0, PAGE_SIZE)]
            : members;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);

    /*
     * Automatically move ONE card every 2 seconds.
     */
    useEffect(() => {
        if (members.length <= PAGE_SIZE) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => prev + 1);
        }, 2000);

        return () => clearInterval(timer);
    }, [members.length]);

    /*
     * When we reach the duplicated cards,
     * instantly reset back to the beginning.
     */
    useEffect(() => {
        if (currentIndex === members.length) {
            const resetTimer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(0);

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        setIsTransitioning(true);
                    });
                });
            }, 700);

            return () => clearTimeout(resetTimer);
        }
    }, [currentIndex, members.length]);

    if (loading) {
        return (
            <motion.section
                id="team"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative bg-cream dark:bg-[#0a0a0a] py-24 transition-colors duration-300"
            >
                <p className="text-center text-zinc-600 dark:text-zinc-400">
                    Loading...
                </p>
            </motion.section>
        );
    }

    if (members.length === 0) return null;

    /*
     * Desktop: 4 cards visible
     * Tablet: 2 cards visible
     * Mobile: 1 card visible
     */
    return (
        <motion.section
            id="team"
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
                    className="text-gold text-sm font-semibold tracking-wide mb-2 uppercase"
                >
                    {t.team.tagline}
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
                    className="text-3xl md:text-4xl font-bold text-charcoal dark:text-white mb-12"
                >
                    {t.team.headline}
                </motion.h2>

                {/* Carousel */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                        duration: 0.8,
                        delay: 0.2,
                        ease: "easeOut"
                    }}
                    className="relative"
                >
                    <div className="overflow-hidden">
                        <div
                            className={`flex ${isTransitioning
                                ? "transition-transform duration-700 ease-in-out"
                                : ""
                                }`}
                            style={{
                                transform: `translateX(-${currentIndex * (100 / PAGE_SIZE)
                                    }%)`,
                            }}
                        >
                            {carouselMembers.map((member, index) => {
                                const name =
                                    language === "ar"
                                        ? member.name_ar
                                        : member.name_en;

                                const role =
                                    language === "ar"
                                        ? member.role_ar
                                        : member.role_en;

                                const bio =
                                    language === "ar"
                                        ? member.bio_ar
                                        : member.bio_en;

                                return (
                                    <motion.div
                                        key={`${member.id}-${index}`}
                                        initial={{ opacity: 0, y: 25 }}
                                        whileInView={{
                                            opacity: 1,
                                            y: 0
                                        }}
                                        viewport={{
                                            once: true,
                                            amount: 0.2
                                        }}
                                        transition={{
                                            duration: 0.6,
                                            delay: (index % PAGE_SIZE) * 0.1,
                                            ease: "easeOut"
                                        }}
                                        className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-4"
                                    >
                                        <motion.button
                                            type="button"
                                            onClick={() =>
                                                bio &&
                                                setActiveMember(member)
                                            }
                                            whileHover={{
                                                y: -5
                                            }}
                                            whileTap={{
                                                scale: 0.98
                                            }}
                                            transition={{
                                                duration: 0.3,
                                                ease: "easeOut"
                                            }}
                                            className="group relative rounded-xl overflow-hidden h-80 shadow-xl border border-zinc-200 dark:border-zinc-800 hover:border-gold transition-all duration-300 text-left w-full cursor-pointer bg-white/95 dark:bg-zinc-900/95"
                                        >
                                            <motion.img
                                                src={member.photo_url}
                                                alt={name}
                                                initial={{ scale: 1 }}
                                                whileHover={{ scale: 1.05 }}
                                                transition={{
                                                    duration: 0.5,
                                                    ease: "easeOut"
                                                }}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />

                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/95 via-charcoal/70 to-transparent px-4 pt-14 pb-4 text-left">
                                                <h3 className="text-white font-bold">
                                                    {name}
                                                </h3>

                                                <p className="text-gold text-sm mb-1">
                                                    {role}
                                                </p>

                                                {bio && (
                                                    <p className="text-stone-300 text-xs leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        {bio}
                                                    </p>
                                                )}
                                            </div>

                                            {bio && (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    whileHover={{ opacity: 1 }}
                                                    className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-white/95 text-charcoal text-[11px] font-semibold px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md"
                                                >
                                                    {language === "ar"
                                                        ? "المزيد"
                                                        : "Read more"}
                                                </motion.span>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* Dots */}
                {members.length > PAGE_SIZE && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.3,
                            ease: "easeOut"
                        }}
                        className="flex items-center justify-center mt-8"
                    >
                        <div className="flex gap-2">
                            {members.map((_, i) => (
                                <motion.button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                        setIsTransitioning(true);
                                        setCurrentIndex(i);
                                    }}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={`Go to team member ${i + 1
                                        }`}
                                    className={`h-2 rounded-full transition-all duration-300 ${i ===
                                        currentIndex % members.length
                                        ? "w-6 bg-gold"
                                        : "w-2 bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500"
                                        }`}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Bio Modal */}
            <AnimatePresence>
                {activeMember && (
                    <BioModal
                        member={activeMember}
                        language={language}
                        onClose={() => setActiveMember(null)}
                    />
                )}
            </AnimatePresence>
        </motion.section>
    );
}

function BioModal({ member, language, onClose }) {
    const name =
        language === "ar"
            ? member.name_ar
            : member.name_en;

    const role =
        language === "ar"
            ? member.role_ar
            : member.role_en;

    const bio =
        language === "ar"
            ? member.bio_ar
            : member.bio_en;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-start justify-center px-4 py-8 bg-charcoal/80 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                transition={{
                    duration: 0.4,
                    ease: "easeOut"
                }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xl w-full max-w-sm my-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative w-full aspect-square shrink-0">
                    <img
                        src={member.photo_url}
                        alt={name}
                        className="w-full h-full object-cover"
                    />

                    <motion.button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        whileHover={{
                            scale: 1.1,
                            rotate: 90
                        }}
                        whileTap={{
                            scale: 0.9
                        }}
                        transition={{
                            duration: 0.2
                        }}
                        className="absolute top-3 right-3 rtl:right-auto rtl:left-3 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 text-charcoal hover:bg-white transition-colors shadow-md"
                    >
                        <CloseIcon />
                    </motion.button>
                </div>

                <div className="px-6 py-5 text-left rtl:text-right">
                    <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="text-xl font-bold text-charcoal dark:text-white"
                    >
                        {name}
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        className="text-gold text-sm font-semibold mb-3"
                    >
                        {role}
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed whitespace-pre-line break-words"
                    >
                        {bio}
                    </motion.p>
                </div>
            </motion.div>
        </motion.div>
    );
}

function CloseIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}