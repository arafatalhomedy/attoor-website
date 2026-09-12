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
  const [refreshing, setRefreshing] = useState(false);

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

    const { data: updateData, error: updateError } =
      await supabase.auth.updateUser({
        data: {
          avatar_url: urlData.publicUrl,
        },
      });

    if (!updateError) {
      setUser(updateData.user);
    }

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

      supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("published", true),

      supabase.from("team_members").select("*", { count: "exact", head: true }),

      supabase
        .from("team_members")
        .select("*", { count: "exact", head: true })
        .eq("published", true),

      supabase.from("services").select("*", { count: "exact", head: true }),

      supabase
        .from("services")
        .select("*", { count: "exact", head: true })
        .eq("published", true),

      supabase
        .from("projects")
        .select("id, title_en, title_ar, created_at")
        .order("created_at", { ascending: false })
        .limit(5),

      supabase
        .from("team_members")
        .select("id, name_en, name_ar, created_at")
        .order("created_at", { ascending: false })
        .limit(5),

      supabase
        .from("services")
        .select("id, title_en, title_ar, created_at")
        .order("created_at", { ascending: false })
        .limit(5),

      supabase
        .from("login_attempts")
        .select("*", { count: "exact", head: true })
        .eq("success", false)
        .gte(
          "created_at",
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        ),
    ]);

    setStats({
      projects: {
        total: projectsRes.count || 0,
        published: projectsPublishedRes.count || 0,
      },

      team: {
        total: teamRes.count || 0,
        published: teamPublishedRes.count || 0,
      },

      services: {
        total: servicesRes.count || 0,
        published: servicesPublishedRes.count || 0,
      },
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
    setRefreshing(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate(`/${ADMIN_PATH}/login`);
  };

  const avatarUrl = user?.user_metadata?.avatar_url;

  const initials = user?.email ? user.email[0].toUpperCase() : "?";

  const locale = language === "ar" ? "ar-EG" : undefined;

  const totalContent =
    stats.projects.total + stats.team.total + stats.services.total;

  const totalPublished =
    stats.projects.published + stats.team.published + stats.services.published;

  const publishRate =
    totalContent > 0 ? Math.round((totalPublished / totalContent) * 100) : 0;

  const projectActivity = recentActivity
    .filter((item) => item.type === "Project")
    .slice(0, 5);

  const teamActivity = recentActivity
    .filter((item) => item.type === "Team")
    .slice(0, 5);

  const serviceActivity = recentActivity
    .filter((item) => item.type === "Service")
    .slice(0, 5);

  return (
    <div
      className="min-h-screen bg-cream dark:bg-zinc-950 transition-colors duration-500"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* NAVBAR */}
      <div className="sticky top-0 z-50 bg-charcoal/95 dark:bg-black/95 backdrop-blur-xl border-b border-zinc-800/80 px-4 sm:px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 items-center justify-center text-gold font-black">
            A
          </div>

          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">
              {t.admin.title}
            </h1>

            <p className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-stone-500">
              Control Center
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="text-xs font-semibold bg-white/10 hover:bg-white/20 active:scale-95 text-white px-3 py-2 rounded-lg transition-all duration-200"
          >
            {language === "en" ? "AR" : "EN"}
          </button>

          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="text-xs font-semibold bg-white/10 hover:bg-white/20 active:scale-95 text-white px-3 py-2 rounded-lg transition-all duration-200"
          >
            {theme === "dark" ? `☀️ ${t.admin.light}` : `🌙 ${t.admin.dark}`}
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <label
              className="relative cursor-pointer group"
              title="Click to change photo"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Admin"
                  className="w-8 h-8 rounded-full object-cover border border-gold/40 group-hover:border-gold transition-colors"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gold text-charcoal flex items-center justify-center text-sm font-bold shadow-inner">
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
                <span className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-[8px] text-white">
                  ...
                </span>
              )}
            </label>

            <span className="text-xs font-medium text-stone-300 hidden lg:inline max-w-[180px] truncate">
              {user?.email}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs font-semibold bg-white/10 hover:bg-red-500/20 hover:text-red-300 active:scale-95 text-white px-3.5 py-2 rounded-lg transition-all duration-200 ml-1"
          >
            {t.admin.logout}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 animate-[fadeInUp_0.5s_ease-out]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold font-bold mb-2">
              Admin Panel
            </p>

            <h2 className="text-3xl sm:text-4xl font-black text-charcoal dark:text-white tracking-tight">
              {t.admin.dashboard}
            </h2>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Manage your website content and monitor activity.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="self-start sm:self-auto inline-flex items-center gap-2 text-xs font-bold bg-charcoal dark:bg-white text-white dark:text-charcoal px-4 py-2.5 rounded-xl hover:bg-gold hover:text-charcoal dark:hover:bg-gold transition-all duration-300 active:scale-95 disabled:opacity-50"
          >
            <span className={refreshing ? "animate-spin inline-block" : ""}>
              ↻
            </span>

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          <ManagementCard
            to={`/${ADMIN_PATH}/projects`}
            title={t.admin.manage.projects.title}
            desc={t.admin.manage.projects.desc}
            icon="◈"
            number={stats.projects.total}
            delay="0ms"
          />

          <ManagementCard
            to={`/${ADMIN_PATH}/team`}
            title={t.admin.manage.team.title}
            desc={t.admin.manage.team.desc}
            icon="♙"
            number={stats.team.total}
            delay="100ms"
          />

          <ManagementCard
            to={`/${ADMIN_PATH}/services`}
            title={t.admin.manage.services.title}
            desc={t.admin.manage.services.desc}
            icon="◇"
            number={stats.services.total}
            delay="200ms"
          />
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* OVERVIEW */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-charcoal dark:text-white">
                  {t.admin.overview}
                </h3>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Your website content at a glance
                </p>
              </div>

              <div className="hidden sm:block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {totalContent} total items
              </div>
            </div>

            {/* STAT CARDS */}
            <div className="grid sm:grid-cols-3 gap-5 mb-8">
              <StatCard
                label={t.admin.stats.projects}
                stat={stats.projects}
                t={t}
                icon="◈"
                delay="0ms"
              />

              <StatCard
                label={t.admin.stats.team}
                stat={stats.team}
                t={t}
                icon="♙"
                delay="100ms"
              />

              <StatCard
                label={t.admin.stats.services}
                stat={stats.services}
                t={t}
                icon="◇"
                delay="200ms"
              />
            </div>

            {/* CONTENT OVERVIEW */}
            <div className="bg-white/80 dark:bg-zinc-900/80 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-6 mb-8 backdrop-blur-md shadow-sm animate-[fadeInUp_0.6s_ease-out]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h3 className="font-bold text-charcoal dark:text-white">
                    Content Overview
                  </h3>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Published content across your website
                  </p>
                </div>

                <div className="text-2xl font-black text-gold">
                  {publishRate}%
                </div>
              </div>

              <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold/70 via-gold to-yellow-300 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${publishRate}%`,
                  }}
                />
              </div>

              <div className="flex justify-between mt-3 text-xs">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {totalPublished} published
                </span>

                <span className="text-zinc-500 dark:text-zinc-400">
                  {totalContent - totalPublished} draft
                </span>
              </div>
            </div>

            {/* SECURITY */}
            <div
              className={`rounded-2xl border p-5 sm:p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md transition-all duration-500 ${
                failedLogins24h > 0
                  ? "bg-red-500/10 border-red-500/30 dark:bg-red-950/20 dark:border-red-800/50 shadow-lg shadow-red-500/5"
                  : "bg-white/80 border-zinc-200/80 dark:bg-zinc-900/80 dark:border-zinc-800 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      failedLogins24h > 0 ? "bg-red-400" : "bg-emerald-400"
                    }`}
                  />

                  <span
                    className={`relative inline-flex rounded-full h-3 w-3 ${
                      failedLogins24h > 0 ? "bg-red-500" : "bg-emerald-500"
                    }`}
                  />
                </span>

                <div>
                  <p className="font-bold text-charcoal dark:text-white">
                    {t.admin.security.title}
                  </p>

                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {failedLogins24h === 0
                      ? t.admin.security.none
                      : `${failedLogins24h} ${t.admin.security.some}`}
                  </p>
                </div>
              </div>

              {failedLogins24h > 0 ? (
                <span className="text-red-600 dark:text-red-400 text-2xl font-black px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
                  {failedLogins24h}
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  Secure
                </span>
              )}
            </div>

            {/* ================================= */}
            {/* RECENT ACTIVITY */}
            {/* ================================= */}

            <div className="mb-5 animate-[fadeInUp_0.6s_ease-out]">
              <h3 className="text-lg font-bold text-charcoal dark:text-white">
                {t.admin.recentActivity}
              </h3>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Latest updates organized by content type
              </p>
            </div>

            {/* ACTIVITY ANALYTICS */}
            <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-6">
              <ActivitySummary
                title="Projects"
                count={projectActivity.length}
                icon="◈"
                color="blue"
              />

              <ActivitySummary
                title="Team"
                count={teamActivity.length}
                icon="♙"
                color="purple"
              />

              <ActivitySummary
                title="Services"
                count={serviceActivity.length}
                icon="◇"
                color="amber"
              />
            </div>

            {/* ACTIVITY TABLES */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* PROJECT ACTIVITY */}
              <ActivityTable
                title="Project Activity"
                subtitle="Latest project updates"
                icon="◈"
                contentType="project"
                locale={locale}
                emptyText="No project activity"
                t={t}
              />

              {/* TEAM ACTIVITY */}
              <ActivityTable
                title="Team Activity"
                subtitle="Latest team member updates"
                icon="♙"
                contentType="team"
                locale={locale}
                emptyText="No team activity"
                t={t}
              />

              {/* SERVICE ACTIVITY */}
              <ActivityTable
                title="Service Activity"
                subtitle="Latest service updates"
                icon="◇"
                contentType="service"
                locale={locale}
                emptyText="No service activity"
                t={t}
              />

              {/* ACTIVITY SUMMARY */}
              <div className="bg-white/80 dark:bg-zinc-900/80 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 backdrop-blur-md shadow-sm overflow-hidden animate-[fadeInUp_0.6s_ease-out]">
                <div className="p-5 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 text-gold flex items-center justify-center">
                      ≋
                    </div>

                    <div>
                      <h4 className="font-bold text-charcoal dark:text-white">
                        Activity Summary
                      </h4>

                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Content distribution
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  <ActivityBar
                    title="Projects"
                    value={projectActivity.length}
                    total={Math.max(
                      projectActivity.length,
                      teamActivity.length,
                      serviceActivity.length,
                      1,
                    )}
                    icon="◈"
                    color="bg-blue-500"
                  />

                  <ActivityBar
                    title="Team"
                    value={teamActivity.length}
                    total={Math.max(
                      projectActivity.length,
                      teamActivity.length,
                      serviceActivity.length,
                      1,
                    )}
                    icon="♙"
                    color="bg-purple-500"
                  />

                  <ActivityBar
                    title="Services"
                    value={serviceActivity.length}
                    total={Math.max(
                      projectActivity.length,
                      teamActivity.length,
                      serviceActivity.length,
                      1,
                    )}
                    icon="◇"
                    color="bg-amber-500"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ANIMATIONS */}
      <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
    </div>
  );
}

/* ================================= */
/* MANAGEMENT CARD */
/* ================================= */

function ManagementCard({ to, title, desc, icon, number, delay }) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden bg-white/80 dark:bg-zinc-900/80 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-6 backdrop-blur-md shadow-sm hover:shadow-xl hover:border-gold/50 transition-all duration-500 hover:-translate-y-1 transform-gpu animate-[fadeInUp_0.6s_ease-out_both]"
      style={{
        animationDelay: delay,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/0 to-transparent group-hover:via-gold transition-all duration-500" />

      <div className="absolute -right-10 -top-10 w-24 h-24 bg-gold/5 rounded-full blur-2xl group-hover:bg-gold/10 transition-all duration-500" />

      <div className="relative flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-lg group-hover:bg-gold group-hover:text-charcoal transition-all duration-300">
          {icon}
        </div>

        <span className="text-2xl font-black text-zinc-200 dark:text-zinc-800 group-hover:text-gold/30 transition-colors">
          {number}
        </span>
      </div>

      <h3 className="relative font-bold text-charcoal dark:text-white mt-5 mb-2 group-hover:text-gold transition-colors">
        {title}
      </h3>

      <p className="relative text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
        {desc}
      </p>

      <div className="relative flex items-center gap-1 mt-5 text-xs font-bold text-gold opacity-70 group-hover:opacity-100 group-hover:gap-2 transition-all duration-300">
        Manage
        <span>→</span>
      </div>
    </Link>
  );
}

/* ================================= */
/* STAT CARD */
/* ================================= */

function StatCard({ label, stat, t, icon, delay }) {
  const draftCount = stat.total - stat.published;

  const percentage =
    stat.total > 0 ? Math.round((stat.published / stat.total) * 100) : 0;

  return (
    <div
      className="group relative overflow-hidden bg-white/80 dark:bg-zinc-900/80 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-6 backdrop-blur-md shadow-sm hover:shadow-lg hover:border-gold/40 transition-all duration-500 transform-gpu animate-[fadeInUp_0.6s_ease-out_both]"
      style={{
        animationDelay: delay,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/0 to-transparent group-hover:via-gold transition-all duration-500" />

      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {label}
          </p>

          <p className="text-4xl font-black text-charcoal dark:text-white mt-1 tracking-tight">
            {stat.total}
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 text-gold flex items-center justify-center text-lg group-hover:bg-gold group-hover:text-charcoal transition-all duration-300">
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
          Published
        </span>

        <span className="text-[11px] font-bold text-gold">{percentage}%</span>
      </div>

      <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gold rounded-full transition-all duration-1000"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
          {stat.published} {t.admin.stats.published}
        </span>

        {draftCount > 0 && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
            {draftCount} {t.admin.stats.draft}
          </span>
        )}
      </div>
    </div>
  );
}

/* ================================= */
/* ACTIVITY SUMMARY CARD */
/* ================================= */

function ActivitySummary({ title, count, icon, color }) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    purple:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    amber:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  };

  return (
    <div className="bg-white/80 dark:bg-zinc-900/80 rounded-xl sm:rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-3 sm:p-5 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <div
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-sm sm:text-base border ${colorClasses[color]}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            {title}
          </p>

          <p className="text-xl sm:text-2xl font-black text-charcoal dark:text-white">
            {count}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================= */
/* ACTIVITY TABLE */
/* ================================= */

function ActivityTable({
  title,
  subtitle,
  icon,
  contentType,
  locale,
  emptyText,
  t,
}) {
  const [filter, setFilter] = useState("30days");
  const [activityItems, setActivityItems] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  const badgeColors = {
    project:
      "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
    team: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
    service:
      "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  };

  const actionLabel = {
    created: { en: "added", ar: "أضيف" },
    updated: { en: "edited", ar: "عُدّل" },
    deleted: { en: "deleted", ar: "حُذف" },
  };

  const actionColor = {
    created: "text-emerald-600 dark:text-emerald-400",
    updated: "text-blue-600 dark:text-blue-400",
    deleted: "text-red-600 dark:text-red-400",
  };

  const getDateRange = (selectedFilter) => {
    const now = new Date();
    let start = new Date(now);
    let end = new Date(now);

    if (selectedFilter === "today") {
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(end.getDate() + 1);
    }

    if (selectedFilter === "7days") {
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() + 1);
    }

    if (selectedFilter === "30days") {
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() + 1);
    }

    if (selectedFilter === "thisMonth") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    if (selectedFilter === "lastMonth") {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return { start: start.toISOString(), end: end.toISOString() };
  };

  const fetchActivity = async (selectedFilter) => {
    setActivityLoading(true);

    const { start, end } = getDateRange(selectedFilter);

    const { data, error } = await supabase
      .from("activity_log")
      .select("id, action, label_en, label_ar, created_at")
      .eq("content_type", contentType)
      .gte("created_at", start)
      .lt("created_at", end)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`Error loading ${contentType} activity:`, error);
      setActivityItems([]);
      setActivityLoading(false);
      return;
    }

    setActivityItems(data || []);
    setActivityLoading(false);
  };

  useEffect(() => {
    fetchActivity(filter);
  }, [filter]);

  const totalUpdates = activityItems.length;

  return (
    <div className="bg-white/80 dark:bg-zinc-900/80 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 backdrop-blur-md shadow-sm overflow-hidden animate-[fadeInUp_0.6s_ease-out]">
      <div className="p-5 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-base border ${badgeColors[contentType]}`}
            >
              {icon}
            </div>
            <div>
              <h4 className="font-bold text-charcoal dark:text-white">
                {title}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-[10px] sm:text-xs font-semibold bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-gold transition-all cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="thisMonth">This month</option>
              <option value="lastMonth">Last month</option>
            </select>

            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${badgeColors[contentType]}`}
            >
              {activityLoading ? "Loading..." : `${totalUpdates} updates`}
            </span>
          </div>
        </div>
      </div>

      {activityLoading ? (
        <div className="p-8 space-y-4 animate-pulse">
          <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
          <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
          <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
        </div>
      ) : activityItems.length === 0 ? (
        <div className="p-8 text-center">
          <div className="text-2xl opacity-40 mb-2">◌</div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {emptyText}
          </p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-[45px_1fr_auto] gap-3 px-5 py-3 bg-zinc-50/80 dark:bg-zinc-950/40 text-[10px] uppercase tracking-wider font-bold text-zinc-400">
            <span>#</span>
            <span>Activity</span>
            <span>Date</span>
          </div>

          {activityItems.map((item, index) => {
            const label =
              locale === "ar-EG"
                ? item.label_ar || item.label_en
                : item.label_en || item.label_ar;

            return (
              <div
                key={item.id}
                className="grid grid-cols-[45px_1fr_auto] gap-3 items-center px-5 py-4 border-t border-zinc-100 dark:border-zinc-800/70 hover:bg-gold/5 transition-all duration-300 group animate-[fadeInUp_0.4s_ease-out_both]"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="text-xs font-black text-zinc-300 dark:text-zinc-700 group-hover:text-gold transition-colors">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-charcoal dark:text-white truncate group-hover:text-gold transition-colors">
                    {label || "-"}
                  </p>
                  <span
                    className={`inline-flex mt-1 text-[9px] font-bold ${actionColor[item.action]}`}
                  >
                    {locale === "ar-EG"
                      ? actionLabel[item.action].ar
                      : actionLabel[item.action].en}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-[10px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                    {formatDateTime(item.created_at, locale)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ================================= */
/* ACTIVITY BAR */
/* ================================= */

function ActivityBar({ title, value, total, icon, color }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-gold text-sm">{icon}</span>

          <span className="text-xs font-semibold text-charcoal dark:text-white">
            {title}
          </span>
        </div>

        <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
          {value}
        </span>
      </div>

      <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

/* ================================= */
/* LOADING SKELETON */
/* ================================= */

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid sm:grid-cols-3 gap-5">
        <div className="h-36 bg-zinc-200/60 dark:bg-zinc-900/60 rounded-2xl" />
        <div className="h-36 bg-zinc-200/60 dark:bg-zinc-900/60 rounded-2xl" />
        <div className="h-36 bg-zinc-200/60 dark:bg-zinc-900/60 rounded-2xl" />
      </div>

      <div className="h-32 bg-zinc-200/60 dark:bg-zinc-900/60 rounded-2xl" />

      <div className="h-24 bg-zinc-200/60 dark:bg-zinc-900/60 rounded-2xl" />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="h-64 bg-zinc-200/60 dark:bg-zinc-900/60 rounded-2xl" />
        <div className="h-64 bg-zinc-200/60 dark:bg-zinc-900/60 rounded-2xl" />
        <div className="h-64 bg-zinc-200/60 dark:bg-zinc-900/60 rounded-2xl" />
        <div className="h-64 bg-zinc-200/60 dark:bg-zinc-900/60 rounded-2xl" />
      </div>
    </div>
  );
}
