import { useEffect, useState } from "react";

export default function ImageCarousel({ images, interval = 3500, className = "" }) {
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images.length, interval, isPaused]);

    return (
        <div
            className={`relative overflow-hidden rounded-lg ${className}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {images.map((src, i) => (
                <img
                    key={src}
                    src={src}
                    alt=""
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"
                        }`}
                />
            ))}

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                    <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${i === index ? "bg-gold" : "bg-white/60"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}