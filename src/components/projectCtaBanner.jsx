import { Link } from "react-router-dom";
import { useLanguage } from "../context/languageContext";

export default function ProjectCtaBanner() {
    const { t } = useLanguage();

    return (
        <section className="bg-charcoal py-16">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {t.projectCta.headline}
                </h2>
                <p className="text-stone-300 mb-8 max-w-xl mx-auto">
                    {t.projectCta.body}
                </p>
                <Link
                    to="/#contact"
                    className="inline-block bg-gold hover:opacity-90 text-charcoal font-semibold px-8 py-3 rounded-full transition-opacity"
                >
                    {t.projectCta.button}
                </Link>
            </div>
        </section>
    );
}