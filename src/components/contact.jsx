import { useLanguage } from "../context/languageContext";

export default function Contact() {
    const { t } = useLanguage();

    return (
        <section
            id="contact"
            className="relative bg-transparent py-24"
        >
            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <div className="mb-14 text-center">
                    <p className="text-gold text-sm font-semibold tracking-wide mb-2 uppercase">
                        {t.contact.tagline}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-charcoal dark:text-white">
                        {t.contact.headline}
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
                        {t.contact.intro}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-start">
                    {/* Contact Information */}
                    <div className="bg-white/95 dark:bg-zinc-900/95 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
                        <h3 className="mb-8 text-2xl font-semibold text-charcoal dark:text-white">
                            {t.contact.formTitle}
                        </h3>

                        <div className="space-y-7">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold bg-gold/10 dark:bg-gold/20">
                                    <span className="text-xl text-gold">📍</span>
                                </div>
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
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold bg-gold/10 dark:bg-gold/20">
                                    <span className="text-xl text-gold">✉</span>
                                </div>
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
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form
                        action="https://api.web3forms.com/submit"
                        method="POST"
                        className="bg-white/95 dark:bg-zinc-900/95 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-5"
                    >
                        <input
                            type="hidden"
                            name="access_key"
                            value="0ba0add4-bb53-4f98-80a3-daa9cf5e707b"
                        />

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <input
                                name="name"
                                type="text"
                                placeholder={t.contact.namePlaceholder}
                                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-charcoal dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition focus:border-gold dark:focus:border-gold"
                            />
                            <input
                                name="email"
                                type="email"
                                placeholder={t.contact.emailPlaceholder}
                                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-charcoal dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition focus:border-gold dark:focus:border-gold"
                            />
                        </div>

                        <input
                            name="phone"
                            type="tel"
                            placeholder={t.contact.phonePlaceholder}
                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-charcoal dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition focus:border-gold dark:focus:border-gold"
                        />

                        <input
                            name="subject"
                            type="text"
                            placeholder={t.contact.subjectPlaceholder}
                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-charcoal dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition focus:border-gold dark:focus:border-gold"
                        />

                        <textarea
                            name="message"
                            rows="6"
                            placeholder={t.contact.messagePlaceholder}
                            className="w-full resize-none rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-charcoal dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition focus:border-gold dark:focus:border-gold"
                        ></textarea>

                        <button
                            type="submit"
                            className="w-full sm:w-auto rounded-lg bg-gold px-8 py-3 font-semibold text-charcoal transition duration-300 hover:bg-[#b98218] hover:text-white shadow-md"
                        >
                            {t.contact.send}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}