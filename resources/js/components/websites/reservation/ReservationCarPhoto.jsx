export default function ReservationCarPhoto({className = "", photoSrc, alt}) {
    const fallbackSrc = "/storage/svg/car-placeholder.svg";
    const resolvedSrc = photoSrc || fallbackSrc;

    return (
        <div className={`col-span-1 md:col-span-4 lg:col-span-2 flex items-center justify-center p-4 ${className}`}>
            <div className="w-full p-2">
                <img
                    src={resolvedSrc}
                    alt={alt}
                    className="w-full object-contain h-40"
                    loading="lazy"
                />
            </div>
        </div>
    );
}

