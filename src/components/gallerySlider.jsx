import { useEffect, useState } from "react";

export default function GallerySlider({ images, interval = 2000 }) {
    const [startIndex, setStartIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused || images.length <= 3) return;

        const timer = setInterval(() => {
            setStartIndex((prev) => (prev + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images.length, interval, isPaused]);

    const visible = [0, 1, 2].map((offset) => images[(startIndex + offset) % images.length]);

    return (
        <div onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            <div className="grid sm:grid-cols-3 gap-4">
                {visible.map((photo, i) => (
                    <div key={i} className="relative overflow-hidden rounded-lg h-48 bg-zinc-100">
                        {images.map((img, imgIndex) => {
                            const isCurrentSlot = imgIndex === (startIndex + i) % images.length;
                            return (
                                <img
                                    key={img.id}
                                    src={img.image_url}
                                    alt=""
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isCurrentSlot ? "opacity-100" : "opacity-0"
                                        }`}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>

            {images.length > 3 && (
                <div className="flex justify-center gap-1.5 mt-4">
                    {images.map((_, i) => (
                        <span
                            key={i}
                            className={`w-2 h-2 rounded-full transition-colors ${i === startIndex ? "bg-gold" : "bg-zinc-300"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}