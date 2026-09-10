import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../context/languageContext";

const PAGE_SIZE = 4;

export default function Team() {
    const { language, t } = useLanguage();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
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

    const totalPages = Math.ceil(members.length / PAGE_SIZE);

    useEffect(() => {
        if (page > 0 && page >= totalPages) {
            setPage(Math.max(0, totalPages - 1));
        }
    }, [totalPages, page]);

    // Close modal on Escape key
    useEffect(() => {
        if (!activeMember) return;
        const handleKey = (e) => {
            if (e.key === "Escape") setActiveMember(null);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [activeMember]);

    const goPrev = () => setPage((p) => Math.max(0, p - 1));
    const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

    if (loading) {
        return (
            <section id="team" className="relative bg-cream dark:bg-[#0a0a0a] py-24 transition-colors duration-300">
                <p className="text-center text-zinc-600 dark:text-zinc-400">Loading...</p>
            </section>
        );
    }

    if (members.length === 0) return null;

    const visibleMembers = members.slice(
        page * PAGE_SIZE,
        page * PAGE_SIZE + PAGE_SIZE
    );

    const isFirstPage = page === 0;
    const isLastPage = page === totalPages - 1;

    const PrevIcon = language === "ar" ? ChevronRight : ChevronLeft;
    const NextIcon = language === "ar" ? ChevronLeft : ChevronRight;

    return (
        <section
            id="team"
            className="relative bg-transparent py-24"
        >
            <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                <p className="text-gold text-sm font-semibold tracking-wide mb-2 uppercase">
                    {t.team.tagline}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-charcoal dark:text-white mb-12">
                    {t.team.headline}
                </h2>

                <div className="relative">
                    {totalPages > 1 && (
                        <button
                            type="button"
                            onClick={goPrev}
                            disabled={isFirstPage}
                            aria-label="Previous team members"
                            className="hidden md:flex items-center justify-center absolute top-1/2 -translate-y-1/2 -left-14 w-11 h-11 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white/90 dark:bg-zinc-800/90 shadow-md text-charcoal dark:text-white hover:bg-gold dark:hover:bg-gold hover:text-charcoal dark:hover:text-charcoal hover:border-gold dark:hover:border-gold transition-colors duration-300 disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-zinc-800 disabled:hover:text-charcoal dark:disabled:hover:text-white disabled:cursor-not-allowed z-20"
                        >
                            <PrevIcon />
                        </button>
                    )}

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {visibleMembers.map((member) => {
                            const name = language === "ar" ? member.name_ar : member.name_en;
                            const role = language === "ar" ? member.role_ar : member.role_en;
                            const bio = language === "ar" ? member.bio_ar : member.bio_en;

                            return (
                                <button
                                    key={member.id}
                                    type="button"
                                    onClick={() => bio && setActiveMember(member)}
                                    className="group relative rounded-xl overflow-hidden h-80 shadow-xl border border-zinc-200 dark:border-zinc-800 hover:border-gold transition-all duration-300 text-left w-full cursor-pointer bg-white/95 dark:bg-zinc-900/95"
                                >
                                    <img
                                        src={member.photo_url}
                                        alt={name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />

                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/95 via-charcoal/70 to-transparent px-4 pt-14 pb-4 text-left">
                                        <h3 className="text-white font-bold">{name}</h3>
                                        <p className="text-gold text-sm mb-1">{role}</p>

                                        {bio && (
                                            <p className="text-stone-300 text-xs leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                {bio}
                                            </p>
                                        )}
                                    </div>

                                    {bio && (
                                        <span className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-white/95 text-charcoal text-[11px] font-semibold px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                                            {language === "ar" ? "المزيد" : "Read more"}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {totalPages > 1 && (
                        <button
                            type="button"
                            onClick={goNext}
                            disabled={isLastPage}
                            aria-label="Next team members"
                            className="hidden md:flex items-center justify-center absolute top-1/2 -translate-y-1/2 -right-14 w-11 h-11 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white/90 dark:bg-zinc-800/90 shadow-md text-charcoal dark:text-white hover:bg-gold dark:hover:bg-gold hover:text-charcoal dark:hover:text-charcoal hover:border-gold dark:hover:border-gold transition-colors duration-300 disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-zinc-800 disabled:hover:text-charcoal dark:disabled:hover:text-white disabled:cursor-not-allowed z-20"
                        >
                            <NextIcon />
                        </button>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-6 mt-8">
                        <button
                            type="button"
                            onClick={goPrev}
                            disabled={isFirstPage}
                            aria-label="Previous team members"
                            className="flex md:hidden items-center justify-center w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 text-charcoal dark:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <PrevIcon />
                        </button>

                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setPage(i)}
                                    aria-label={`Go to team members page ${i + 1}`}
                                    className={`h-2 rounded-full transition-all duration-300 ${i === page
                                        ? "w-6 bg-gold"
                                        : "w-2 bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500"
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={goNext}
                            disabled={isLastPage}
                            aria-label="Next team members"
                            className="flex md:hidden items-center justify-center w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 text-charcoal dark:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <NextIcon />
                        </button>
                    </div>
                )}
            </div>

            {activeMember && (
                <BioModal
                    member={activeMember}
                    language={language}
                    onClose={() => setActiveMember(null)}
                />
            )}
        </section>
    );
}

function BioModal({ member, language, onClose }) {
    const name = language === "ar" ? member.name_ar : member.name_en;
    const role = language === "ar" ? member.role_ar : member.role_en;
    const bio = language === "ar" ? member.bio_ar : member.bio_en;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center px-4 py-8 bg-charcoal/80 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xl w-full max-w-sm my-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative w-full aspect-square shrink-0">
                    <img
                        src={member.photo_url}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute top-3 right-3 rtl:right-auto rtl:left-3 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 text-charcoal hover:bg-white transition-colors shadow-md"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="px-6 py-5 text-left rtl:text-right">
                    <h3 className="text-xl font-bold text-charcoal dark:text-white">{name}</h3>
                    <p className="text-gold text-sm font-semibold mb-3">{role}</p>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed whitespace-pre-line break-words">
                        {bio}
                    </p>
                </div>
            </div>
        </div>
    );
}

function ChevronLeft() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
        </svg>
    );
}

function ChevronRight() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}