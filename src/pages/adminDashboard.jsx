import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAdminTheme } from "../context/adminThemeContext";
import { useLanguage } from "../context/languageContext";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;

const formatDateTime = (isoString, locale) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useAdminTheme();
    const { language, toggleLanguage, t } = useLanguage();

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        projects: { total: 0, published: 0 },
        team: { total: 0, published: 0 },
        services: { total: 0, published: 0 },
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [failedLogins24h, setFailedLogins24h] = useState(0);

    const [user, setUser] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    useEffect(() => {
        fetchDashboardData();
        fetchUser();
    }, []);

    const fetchUser = async () => {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingAvatar(true);
        const fileName = `admin-avatar-${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
            .from("project-images")
            .upload(fileName, file);

        if (uploadError) {
            alert("Photo upload failed: " + uploadError.message);
            setUploadingAvatar(false);
            return;
        }

        const { data: urlData } = supabase.storage
            .from("project-images")
            .getPublicUrl(fileName);

        const { data: updateData, error: updateError } = await supabase.auth.updateUser({
            data: { avatar_url: urlData.publicUrl },
        });

        if (!updateError) setUser(updateData.user);
        setUploadingAvatar(false);
    };

    const fetchDashboardData = async () => {
        setLoading(true);

        const [
            projectsRes,
            projectsPublishedRes,
            teamRes,
            teamPublishedRes,
            servicesRes,
            servicesPublishedRes,
            recentProjects,
            recentTeam,
            recentServices,
            failedLoginsRes,
        ] = await Promise.all([
            supabase.from("projects").select("*", { count: "exact", head: true }),
            supabase.from("projects").select("*", { count: "exact", head: true }).eq("published", true),
            supabase.from("team_members").select("*", { count: "exact", head: true }),
            supabase.from("team_members").select("*", { count: "exact", head: true }).eq("published", true),
            supabase.from("services").select("*", { count: "exact", head: true }),
            supabase.from("services").select("*", { count: "exact", head: true }).eq("published", true),
            supabase.from("projects").select("id, title_en, title_ar, created_at").order("created_at", { ascending: false }).limit(5),
            supabase.from("team_members").select("id, name_en, name_ar, created_at").order("created_at", { ascending: false }).limit(5),
            supabase.from("services").select("id, title_en, title_ar, created_at").order("created_at", { ascending: false }).limit(5),
            supabase
                .from("login_attempts")
                .select("*", { count: "exact", head: true })
                .eq("success", false)
                .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        ]);

        setStats({
            projects: { total: projectsRes.count || 0, published: projectsPublishedRes.count || 0 },
            team: { total: teamRes.count || 0, published: teamPublishedRes.count || 0 },
            services: { total: servicesRes.count || 0, published: servicesPublishedRes.count || 0 },
        });

        const combined = [
            ...(recentProjects.data || []).map((p) => ({
                id: `project-${p.id}`,
                label: (language === "ar" ? p.title_ar : p.title_en) || "-",
                type: "Project",
                created_at: p.created_at,
            })),
            ...(recentTeam.data || []).map((m) => ({
                id: `team-${m.id}`,
                label: (language === "ar" ? m.name_ar : m.name_en) || "-",
                type: "Team",
                created_at: m.created_at,
            })),
            ...(recentServices.data || []).map((s) => ({
                id: `service-${s.id}`,
                label: (language === "ar" ? s.title_ar : s.title_en) || "-",
                type: "Service",
                created_at: s.created_at,
            })),
        ]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 10);

        setRecentActivity(combined);
        setFailedLogins24h(failedLoginsRes.count || 0);
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate(`/${ADMIN_PATH}/login`);
    };

    const typeBadgeColor = {
        Project: "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
        Team: "bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
        Service: "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    };

    const avatarUrl = user?.user_metadata?.avatar_url;
    const initials = user?.email ? user.email[0].toUpperCase() : "?";
    const locale = language === "ar" ? "ar-EG" : undefined;

    return (
        <div className="min-h-screen bg-cream dark:bg-zinc-900 transition-colors duration-300">
            <div className="bg-charcoal dark:bg-black px-6 py-4 flex items-center justify-between">
                <h1 className="text-lg font-bold text-white">{t.admin.title}</h1>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        aria-label="Toggle language"
                        className="text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-md transition-colors"
                    >
                        {language === "en" ? "AR" : "EN"}
                    </button>

                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle dark mode"
                        className="text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-md transition-colors"
                    >
                        {theme === "dark" ? `☀️ ${t.admin.light}` : `🌙 ${t.admin.dark}`}
                    </button>

                    <div className="flex items-center gap-2">
                        <label className="relative cursor-pointer group" title="Click to change photo">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt="Admin"
                                    className="w-8 h-8 rounded-full object-cover border border-white/20"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gold text-charcoal flex items-center justify-center text-sm font-bold">
                                    {initials}
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                            />
                            {uploadingAvatar && (
                                <span className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center text-[8px] text-white">
                                    ...
                                </span>
                            )}
                        </label>
                        <span className="text-sm text-stone-300 hidden sm:inline">{user?.email}</span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition-colors"
                    >
                        {t.admin.logout}
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-10">
                <h2 className="text-2xl font-bold text-charcoal dark:text-white mb-6">{t.admin.dashboard}</h2>

                <div className="grid sm:grid-cols-3 gap-6 mb-10">
                    <Link to={`/${ADMIN_PATH}/projects`} className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:border-gold transition-colors">
                        <h3 className="font-bold text-charcoal dark:text-white mb-2">{t.admin.manage.projects.title}</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.admin.manage.projects.desc}</p>
                    </Link>
                    <Link to={`/${ADMIN_PATH}/team`} className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:border-gold transition-colors">
                        <h3 className="font-bold text-charcoal dark:text-white mb-2">{t.admin.manage.team.title}</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.admin.manage.team.desc}</p>
                    </Link>
                    <Link to={`/${ADMIN_PATH}/services`} className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:border-gold transition-colors">
                        <h3 className="font-bold text-charcoal dark:text-white mb-2">{t.admin.manage.services.title}</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.admin.manage.services.desc}</p>
                    </Link>
                </div>

                {loading ? (
                    <p className="text-zinc-500 dark:text-zinc-400">Loading...</p>
                ) : (
                    <>
                        <h3 className="text-lg font-bold text-charcoal dark:text-white mb-4">{t.admin.overview}</h3>
                        <div className="grid sm:grid-cols-3 gap-6 mb-10">
                            <StatCard label={t.admin.stats.projects} stat={stats.projects} t={t} />
                            <StatCard label={t.admin.stats.team} stat={stats.team} t={t} />
                            <StatCard label={t.admin.stats.services} stat={stats.services} t={t} />
                        </div>

                        <div
                            className={`rounded-lg border p-5 mb-10 flex items-center justify-between ${failedLogins24h > 0
                                ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                                : "bg-white border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
                                }`}
                        >
                            <div>
                                <p className="font-bold text-charcoal dark:text-white">{t.admin.security.title}</p>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {failedLogins24h === 0
                                        ? t.admin.security.none
                                        : `${failedLogins24h} ${t.admin.security.some}`}
                                </p>
                            </div>
                            {failedLogins24h > 0 && (
                                <span className="text-red-600 dark:text-red-400 text-2xl font-bold">{failedLogins24h}</span>
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-charcoal dark:text-white mb-4">{t.admin.recentActivity}</h3>
                        {recentActivity.length === 0 ? (
                            <p className="text-zinc-500 dark:text-zinc-400">{t.admin.noActivity}</p>
                        ) : (
                            <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 divide-y divide-zinc-100 dark:divide-zinc-700">
                                {recentActivity.map((item) => (
                                    <div key={item.id} className="px-5 py-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`text-xs font-semibold px-2 py-1 rounded-full ${typeBadgeColor[item.type]}`}
                                            >
                                                {t.admin.types[item.type]}
                                            </span>
                                            <p className="text-charcoal dark:text-white font-medium">{item.label}</p>
                                        </div>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 shrink-0 ml-4">
                                            {formatDateTime(item.created_at, locale)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function StatCard({ label, stat, t }) {
    const draftCount = stat.total - stat.published;
    return (
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">{label}</p>
            <p className="text-3xl font-bold text-charcoal dark:text-white mb-2">{stat.total}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {stat.published} {t.admin.stats.published}
                </span>
                {draftCount > 0 && (
                    <>
                        {" "}
                        · <span className="text-amber-600 dark:text-amber-400 font-semibold">
                            {draftCount} {t.admin.stats.draft}
                        </span>
                    </>
                )}
            </p>
        </div>
    );
}