import { useLanguage } from "../context/languageContext";

export default function ProjectCard({ project }) {
    const { language } = useLanguage();

    return (
        <div className="bg-white rounded-lg overflow-hidden border border-zinc-200 hover:shadow-lg transition-shadow group">
            <div className="overflow-hidden h-56">
                <img
                    src={project.image}
                    alt={language === "ar" ? project.title_ar : project.title_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>
            <div className="p-5">
                <span className="inline-block text-xs font-semibold text-gold uppercase tracking-wide mb-2">
                    {project.category}
                </span>
                <h3 className="text-lg font-bold text-charcoal mb-1">
                    {language === "ar" ? project.title_ar : project.title_en}
                </h3>
                <p className="text-sm text-zinc-600">
                    {language === "ar" ? project.description_ar : project.description_en}
                </p>
            </div>
        </div>
    );
}