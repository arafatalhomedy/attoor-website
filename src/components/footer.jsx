export default function Footer() {
    return (
        <footer className="bg-[#252525] text-white border-t border-[#444]">
            <div className="mx-auto max-w-6xl px-6 py-8">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Attoor. All Rights Reserved.
                    </p>

                    <div className="flex gap-3">
                        <a
                            href="#"
                            aria-label="Facebook"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#555] font-semibold text-gray-400 transition hover:border-gold hover:text-gold"
                        >
                            f
                        </a>
                        <a
                            href="#"
                            aria-label="LinkedIn"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#555] font-semibold text-gray-400 transition hover:border-gold hover:text-gold"
                        >
                            in
                        </a>
                        <a
                            href="#"
                            aria-label="Instagram"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#555] font-semibold text-gray-400 transition hover:border-gold hover:text-gold"
                        >
                            ◎
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}