import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../context/languageContext";
import { serviceIcons } from "../lib/servicesIcons";
import { motion, AnimatePresence } from "motion/react";

const PAGE_SIZE = 6;

export default function Services() {
  const { language, t } = useLanguage();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchServices();

    const channel = supabase
      .channel("services_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "services" },
        () => {
          fetchServices();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (!error) setServices(data || []);
    setLoading(false);
  };

  const totalPages = Math.ceil(services.length / PAGE_SIZE);

  useEffect(() => {
    if (page > 0 && page >= totalPages) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, page]);

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  if (loading) {
    return (
      <motion.section
        id="services"
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

  if (services.length === 0) return null;

  const visibleServices = services.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  const isFirstPage = page === 0;
  const isLastPage = page === totalPages - 1;

  const PrevIcon = language === "ar" ? ChevronRight : ChevronLeft;
  const NextIcon = language === "ar" ? ChevronLeft : ChevronRight;

  return (
    <motion.section
      id="services"
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
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-gold text-sm font-semibold tracking-wide mb-2 uppercase"
          >
            {t.services.tagline}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: "easeOut",
            }}
            className="text-3xl md:text-4xl font-bold text-charcoal dark:text-white"
          >
            {t.services.headline}
          </motion.h2>
        </div>

        <div className="relative">
          {totalPages > 1 && (
            <motion.button
              type="button"
              onClick={goPrev}
              disabled={isFirstPage}
              aria-label="Previous services"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="hidden xl:flex items-center justify-center absolute top-1/2 -translate-y-1/2 -left-16 w-11 h-11 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white/90 dark:bg-zinc-800/90 shadow-md text-charcoal dark:text-white hover:bg-gold hover:text-charcoal hover:border-gold transition-colors duration-300 disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-zinc-800 disabled:hover:text-charcoal dark:disabled:hover:text-white disabled:cursor-not-allowed z-20"
            >
              <PrevIcon />
            </motion.button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
              }}
              className="grid md:grid-cols-3 gap-8"
            >
              {visibleServices.map((service, index) => {
                const title =
                  language === "ar" ? service.title_ar : service.title_en;

                const description =
                  language === "ar"
                    ? service.description_ar
                    : service.description_en;

                const Icon =
                  serviceIcons[service.icon_name] || serviceIcons.Building2;

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                      transition: { duration: 0.15, ease: "easeOut" },
                    }}
                    className="bg-white/95 dark:bg-zinc-900/95 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 hover:border-gold hover:shadow-xl transition-colors duration-200"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.15 + index * 0.1,
                      }}
                      className="w-12 h-12 rounded-full bg-gold/10 dark:bg-gold/20 flex items-center justify-center mb-4"
                    >
                      <Icon className="w-6 h-6 text-gold" />
                    </motion.div>

                    <h3 className="text-lg font-bold text-charcoal dark:text-white mb-2 text-left">
                      {title}
                    </h3>

                    <p className="text-sm text-zinc-600 dark:text-zinc-400 text-left leading-relaxed">
                      {description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {totalPages > 1 && (
            <motion.button
              type="button"
              onClick={goNext}
              disabled={isLastPage}
              aria-label="Next services"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="hidden xl:flex items-center justify-center absolute top-1/2 -translate-y-1/2 -right-16 w-11 h-11 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white/90 dark:bg-zinc-800/90 shadow-md text-charcoal dark:text-white hover:bg-gold hover:text-charcoal hover:border-gold transition-colors duration-300 disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-zinc-800 disabled:hover:text-charcoal dark:disabled:hover:text-white disabled:cursor-not-allowed z-20"
            >
              <NextIcon />
            </motion.button>
          )}
        </div>

        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.6,
              delay: 0.3,
            }}
            className="flex items-center justify-center gap-6 mt-10"
          >
            <motion.button
              type="button"
              onClick={goPrev}
              disabled={isFirstPage}
              aria-label="Previous services"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="flex xl:hidden items-center justify-center w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 text-charcoal dark:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <PrevIcon />
            </motion.button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => setPage(i)}
                  aria-label={`Go to services page ${i + 1}`}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === page
                      ? "w-6 bg-gold"
                      : "w-2 bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500"
                  }`}
                />
              ))}
            </div>

            <motion.button
              type="button"
              onClick={goNext}
              disabled={isLastPage}
              aria-label="Next services"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="flex xl:hidden items-center justify-center w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 text-charcoal dark:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <NextIcon />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}

function ChevronLeft() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
