import { useLanguage } from "../context/languageContext";
import { motion } from "motion/react";

export default function Contact() {
    const { t } = useLanguage();

    return (
        <motion.section
            id="contact"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative bg-transparent py-24"
        >
            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <div className="mb-14 text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-gold text-sm font-semibold tracking-wide mb-2 uppercase"
                    >
                        {t.contact.tagline}
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: 0.7,
                            delay: 0.1,
                            ease: "easeOut"
                        }}
                        className="text-3xl md:text-4xl font-bold text-charcoal dark:text-white"
                    >
                        {t.contact.headline}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: 0.7,
                            delay: 0.2,
                            ease: "easeOut"
                        }}
                        className="mx-auto mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400"
                    >
                        {t.contact.intro}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-start">

                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                            duration: 0.9,
                            ease: "easeOut"
                        }}
                        className="bg-white/95 dark:bg-zinc-900/95 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl"
                    >
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                delay: 0.2,
                                ease: "easeOut"
                            }}
                            className="mb-8 text-2xl font-semibold text-charcoal dark:text-white"
                        >
                            {t.contact.formTitle}
                        </motion.h3>

                        <div className="space-y-7">

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.3,
                                    ease: "easeOut"
                                }}
                                className="flex items-start gap-4"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold bg-gold/10 dark:bg-gold/20"
                                >
                                    <span className="text-xl text-gold">📍</span>
                                </motion.div>

                                <div>
                                    <h4 className="mb-1 font-semibold text-charcoal dark:text-white">
                                        {t.contact.officeLabel}
                                    </h4>

                                    <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                                        {t.contact.officeAddress}
                                        <br />
                                        {t.contact.officeCity}
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.45,
                                    ease: "easeOut"
                                }}
                                className="flex items-start gap-4"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold bg-gold/10 dark:bg-gold/20"
                                >
                                    <span className="text-xl text-gold">✉</span>
                                </motion.div>

                                <div>
                                    <h4 className="mb-1 font-semibold text-charcoal dark:text-white">
                                        {t.contact.emailLabel}
                                    </h4>

                                    <a
                                        href="mailto:attoor2025@gmail.com"
                                        className="text-zinc-600 dark:text-zinc-400 transition hover:text-gold dark:hover:text-gold"
                                    >
                                        attoor2025@gmail.com
                                    </a>
                                </div>
                            </motion.div>

                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.form
                        action="https://api.web3forms.com/submit"
                        method="POST"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                            duration: 0.9,
                            delay: 0.15,
                            ease: "easeOut"
                        }}
                        className="bg-white/95 dark:bg-zinc-900/95 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-5"
                    >
                        <input
                            type="hidden"
                            name="access_key"
                            value="0ba0add4-bb53-4f98-80a3-daa9cf5e707b"
                        />

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <motion.input
                                name="name"
                                type="text"
                                placeholder={t.contact.namePlaceholder}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-charcoal dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition focus:border-gold dark:focus:border-gold"
                            />

                            <motion.input
                                name="email"
                                type="email"
                                placeholder={t.contact.emailPlaceholder}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-charcoal dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition focus:border-gold dark:focus:border-gold"
                            />
                        </div>

                        <motion.input
                            name="phone"
                            type="tel"
                            placeholder={t.contact.phonePlaceholder}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-charcoal dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition focus:border-gold dark:focus:border-gold"
                        />

                        <motion.input
                            name="subject"
                            type="text"
                            placeholder={t.contact.subjectPlaceholder}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-charcoal dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition focus:border-gold dark:focus:border-gold"
                        />

                        <motion.textarea
                            name="message"
                            rows="6"
                            placeholder={t.contact.messagePlaceholder}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="w-full resize-none rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-charcoal dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition focus:border-gold dark:focus:border-gold"
                        ></motion.textarea>

                        <motion.button
                            type="submit"
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                delay: 0.8,
                                ease: "easeOut"
                            }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full sm:w-auto rounded-lg bg-gold px-8 py-3 font-semibold text-charcoal transition duration-300 hover:bg-[#b98218] hover:text-white shadow-md"
                        >
                            {t.contact.send}
                        </motion.button>
                    </motion.form>
                </div>
            </div>
        </motion.section>
    );
}