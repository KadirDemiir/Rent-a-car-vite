export default function ReservationCarPhoto({className = "", photoSrc, alt}) {
    const fallbackSrc = "/storage/svg/car-placeholder.svg";
    const resolvedSrc = photoSrc || fallbackSrc;

    return (
        <div className={`col-span-1 md:col-span-4 lg:col-span-2 ${className}`}>
            <div className="relative w-full h-full min-h-[160px] bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl overflow-hidden flex items-center justify-center group">
                <img
                    src={resolvedSrc}
                    alt={alt}
                    className="w-full h-auto max-h-40 object-contain p-3 transition-all duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
            </div>
        </div>
    );
}

