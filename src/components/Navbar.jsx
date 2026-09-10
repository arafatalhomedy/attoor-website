import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import images from "../assets";
import { Languages } from "lucide-react";
import { useLanguage } from "../context/languageContext";
import { useAdminTheme } from "../context/adminThemeContext";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { language, toggleLanguage, t } = useLanguage();
    const { theme, toggleTheme } = useAdminTheme();

    const leftLinks = [
        { label: t.nav.home, href: "#home" },
        { label: t.nav.about, href: "#about" },
        { label: t.nav.team, href: "#team" },

    ];

    const rightLinks = [
        { label: t.nav.projects, href: "#projects" },
        { label: t.nav.services, href: "#services" },
        { label: t.nav.contact, href: "#contact" },
    ];

    return (
        <header className="sticky top-0 z-50 bg-charcoal dark:bg-black border-b-2 border-gold">
            <div className="max-w-6xl mx-auto px-6 h-20 grid grid-cols-2 lg:grid-cols-3 items-center">
                <nav className="hidden lg:flex items-center gap-8">
                    {leftLinks.map((link) => (
                        <a key={link.label} href={link.href} className="text-sm text-stone-300 hover:text-gold">
                            {link.label}
                        </a>
                    ))}
                </nav>

                <a href="#home" className="flex items-center gap-2 justify-self-start lg:justify-self-center">
                    <img src={images.logo} alt="Attoor logo" className="w-10 h-10 rounded-full object-cover" />
                    <span className="text-lg font-bold text-stone-50">Attoor.CEGS</span>
                </a>

                <div className="hidden lg:flex items-center justify-end gap-8">
                    {rightLinks.map((link) => (
                        <a key={link.label} href={link.href} className="text-sm text-stone-300 hover:text-gold">
                            {link.label}
                        </a>
                    ))}
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle dark mode"
                        className="flex items-center gap-1 text-sm text-stone-300 hover:text-gold"
                    >
                        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1 text-sm text-stone-300 hover:text-gold"
                    >
                        <Languages className="w-4 h-4" />
                        {language === "en" ? "AR" : "EN"}
                    </button>

                </div>

                <button
                    className="lg:hidden justify-self-end text-stone-100"
                    onClick={() => setOpen(!open)}
                    aria-label={open ? "Close menu" : "Open menu"}
                >
                    {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {open && (
                <nav className="lg:hidden bg-charcoal dark:bg-black border-t border-zinc-700 px-6 py-4 flex flex-col gap-4">
                    {[...leftLinks, ...rightLinks].map((link) => (

                        <a key={link.label}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="text-stone-200 text-sm hover:text-gold transition-colors duration-200"
                        >
                            {link.label}
                        </a>

                    ))}
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle dark mode"
                        className="flex items-center gap-1 text-sm text-stone-300 hover:text-gold"
                    >
                        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {theme === "dark" ? "Light mode" : "Dark mode"}
                    </button>
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1 text-sm text-stone-300 hover:text-gold"
                    >
                        <Languages className="w-4 h-4" />
                        {language === "en" ? "AR" : "EN"}
                    </button>

                </nav >
            )
            }
        </header >
    );
}