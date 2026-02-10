import React from "react";

export default function ReservationCarPhoto({ className = "", photoSrc, alt, priority = false }) {
    const fallbackSrc = "/storage/svg/car-placeholder.svg";
    const resolvedSrc = photoSrc || fallbackSrc;

    return (
        <div className={`col-span-1 sm:col-span-4 md:col-span-3 lg:col-span-3 ${className}`}>
            <div className="relative w-full h-full min-h-[160px] sm:min-h-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center group sm:aspect-[4/3]">
                <img
                    src={resolvedSrc}
                    alt={alt}
                    width="400"
                    height="300"
                    className="w-full h-full object-contain p-2 sm:p-3 transition-all duration-500 group-hover:scale-105"
                    loading={priority ? "eager" : "lazy"}
                    decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
            </div>
        </div>
    );
}
