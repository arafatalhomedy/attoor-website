import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import images from "../assets";
import { Languages } from "lucide-react";
import { useLanguage } from "../context/languageContext";
import { useAdminTheme } from "../context/adminThemeContext";
import { motion, AnimatePresence } from "motion/react";

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
        <motion.header
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="sticky top-0 z-50 bg-charcoal dark:bg-black border-b-2 border-gold"
        >
            <div className="max-w-6xl mx-auto px-6 h-20 grid grid-cols-2 lg:grid-cols-3 items-center">

                <nav className="hidden lg:flex items-center gap-8">
                    {leftLinks.map((link, index) => (
                        <motion.a
                            key={link.label}
                            href={link.href}
                            initial={{ opacity: 0, y: -15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: 0.2 + index * 0.1
                            }}
                            whileHover={{ y: -2 }}
                            className="text-sm text-stone-300 hover:text-gold"
                        >
                            {link.label}
                        </motion.a>
                    ))}
                </nav>

                <motion.a
                    href="#home"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.6,
                        delay: 0.2,
                        ease: "easeOut"
                    }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 justify-self-start lg:justify-self-center"
                >
                    <img
                        src={images.logo}
                        alt="Attoor logo"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-lg font-bold text-stone-50">
                        Attoor.CEGS
                    </span>
                </motion.a>

                <div className="hidden lg:flex items-center justify-end gap-8">
                    {rightLinks.map((link, index) => (
                        <motion.a
                            key={link.label}
                            href={link.href}
                            initial={{ opacity: 0, y: -15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: 0.3 + index * 0.1
                            }}
                            whileHover={{ y: -2 }}
                            className="text-sm text-stone-300 hover:text-gold"
                        >
                            {link.label}
                        </motion.a>
                    ))}

                    <motion.button
                        onClick={toggleTheme}
                        aria-label="Toggle dark mode"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                        whileHover={{ scale: 1.15, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center gap-1 text-sm text-stone-300 hover:text-gold"
                    >
                        {theme === "dark" ? (
                            <Sun className="w-4 h-4" />
                        ) : (
                            <Moon className="w-4 h-4" />
                        )}
                    </motion.button>

                    <motion.button
                        onClick={toggleLanguage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.7 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 text-sm text-stone-300 hover:text-gold"
                    >
                        <Languages className="w-4 h-4" />
                        {language === "en" ? "AR" : "EN"}
                    </motion.button>
                </div>

                <motion.button
                    className="lg:hidden justify-self-end text-stone-100"
                    onClick={() => setOpen(!open)}
                    aria-label={open ? "Close menu" : "Open menu"}
                    whileTap={{ scale: 0.9 }}
                >
                    {open ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </motion.button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.nav
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="lg:hidden bg-charcoal dark:bg-black border-t border-zinc-700 px-6 py-4 flex flex-col gap-4 overflow-hidden"
                    >
                        {[...leftLinks, ...rightLinks].map((link, index) => (
                            <motion.a
                                key={link.label}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.05
                                }}
                                whileHover={{ x: 5 }}
                                className="text-stone-200 text-sm hover:text-gold transition-colors duration-200"
                            >
                                {link.label}
                            </motion.a>
                        ))}

                        <motion.button
                            onClick={toggleTheme}
                            aria-label="Toggle dark mode"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: 0.3
                            }}
                            className="flex items-center gap-1 text-sm text-stone-300 hover:text-gold"
                        >
                            {theme === "dark" ? (
                                <Sun className="w-4 h-4" />
                            ) : (
                                <Moon className="w-4 h-4" />
                            )}
                            {theme === "dark" ? "Light mode" : "Dark mode"}
                        </motion.button>

                        <motion.button
                            onClick={toggleLanguage}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: 0.35
                            }}
                            className="flex items-center gap-1 text-sm text-stone-300 hover:text-gold"
                        >
                            <Languages className="w-4 h-4" />
                            {language === "en" ? "AR" : "EN"}
                        </motion.button>
                    </motion.nav>
                )}
            </AnimatePresence>
        </motion.header>
    );
}