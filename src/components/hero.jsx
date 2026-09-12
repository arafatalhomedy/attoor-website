import images from "../assets";
import ImageCarousel from "./imageCarousel";
import { useLanguage } from "../context/languageContext";
import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function Hero() {
    const { t } = useLanguage();

    return (
        <section id="home" className="relative bg-transparent py-24">
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

                {/* HERO TEXT */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.p
                        className="text-gold text-sm font-semibold tracking-wide mb-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.2,
                        }}
                    >
                        {t.hero.tagline}
                    </motion.p>

                    <motion.h1
                        className="text-4xl md:text-5xl font-bold text-charcoal dark:text-white leading-tight"
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.3,
                        }}
                    >
                        {t.hero.headline}
                    </motion.h1>

                    <motion.p
                        className="mt-5 text-zinc-600 dark:text-zinc-300 max-w-md leading-relaxed"
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.5,
                        }}
                    >
                        {t.hero.body}
                    </motion.p>

                    <motion.a
                        href="#projects"
                        className="mt-8 inline-block bg-gold hover:bg-[#c69228] text-charcoal font-bold px-8 py-3 rounded-full transition-all duration-300 shadow-lg shadow-gold/10 hover:scale-105"
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.7,
                        }}
                        whileHover={{
                            scale: 1.05,
                        }}
                        whileTap={{
                            scale: 0.97,
                        }}
                    >
                        {t.hero.cta}
                    </motion.a>
                </motion.div>

                {/* HERO IMAGE */}
                <motion.div
                    className="relative justify-self-center md:justify-self-end w-full max-w-2xl group"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 1,
                        ease: "easeOut",
                        delay: 0.2,
                    }}
                >
                    {/* Accent glow behind carousel */}
                    <motion.div
                        className="absolute -inset-4 bg-gold/10 rounded-2xl rotate-3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 1,
                            delay: 0.4,
                        }}
                    ></motion.div>

                    <ImageCarousel
                        images={[
                            images.work1,
                            images.work2,
                            images.work3,
                            images.work4,
                            images.work5,
                            images.work6,
                        ]}
                        interval={2000}
                        className="relative w-full h-96 shadow-2xl -rotate-2 transition-transform duration-500 group-hover:scale-105 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700/60"
                    />

                    {/* Badge Box */}
                    <motion.div
                        className="absolute -bottom-6 -left-6 bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-700/80 rounded-xl shadow-2xl px-5 py-3 flex items-center gap-3"
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            duration: 0.7,
                            delay: 1,
                            ease: "easeOut",
                        }}
                    >
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />

                        <div className="text-xs">
                            <p className="font-bold text-charcoal dark:text-white text-sm">
                                150+ Projects
                            </p>

                            <p className="text-zinc-500 dark:text-zinc-400">
                                Completed on time
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}