import images from "../assets";
import ImageCarousel from "./imageCarousel";
import { useLanguage } from "../context/languageContext";
import { CheckCircle2 } from "lucide-react";

export default function Hero() {
    const { t } = useLanguage();

    return (
        <section id="home" className="relative bg-transparent py-24">
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <p className="text-gold text-sm font-semibold tracking-wide mb-3">
                        {t.hero.tagline}
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-charcoal dark:text-white leading-tight">
                        {t.hero.headline}
                    </h1>

                    <p className="mt-5 text-zinc-600 dark:text-zinc-300 max-w-md leading-relaxed">
                        {t.hero.body}
                    </p>

                    <a
                        href="#projects"
                        className="mt-8 inline-block bg-gold hover:bg-[#c69228] text-charcoal font-bold px-8 py-3 rounded-full transition-all duration-300 shadow-lg shadow-gold/10 hover:scale-105"
                    >
                        {t.hero.cta}
                    </a>
                </div>

                <div className="relative justify-self-center md:justify-self-end w-full max-w-2xl group">
                    {/* Accent glow behind carousel */}
                    <div className="absolute -inset-4 bg-gold/10 rounded-2xl rotate-3"></div>

                    <ImageCarousel
                        images={[images.work1, images.work2, images.work3, images.work4, images.work5, images.work6]}
                        interval={2000}
                        className="relative w-full h-96 shadow-2xl -rotate-2 transition-transform duration-500 group-hover:scale-105 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700/60"
                    />

                    {/* Badge Box (Light & Dark theme aware) */}
                    <div className="absolute -bottom-6 -left-6 bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-700/80 rounded-xl shadow-2xl px-5 py-3 flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                        <div className="text-xs">
                            <p className="font-bold text-charcoal dark:text-white text-sm">150+ Projects</p>
                            <p className="text-zinc-500 dark:text-zinc-400">Completed on time</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}