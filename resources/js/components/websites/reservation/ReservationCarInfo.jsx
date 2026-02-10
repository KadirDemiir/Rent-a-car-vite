export default function ReservationCarInfo({
    className = "",
    segmentLabel,
    title,
    features = [],
    requirements = [],
}) {
    return (
        <div className={`col-span-1 sm:col-span-8 md:col-span-5 lg:col-span-5 flex flex-col justify-center gap-2 sm:gap-3 ${className}`}>
            <div className="flex items-center gap-2 sm:gap-3">
                {segmentLabel && (
                    <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold text-gray-700 bg-gray-50 rounded-md uppercase tracking-wider border border-gray-200">
                        {segmentLabel}
                    </span>
                )}
            </div>

            <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight line-clamp-2">{title}</h2>

            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1.5 sm:gap-y-2 text-xs sm:text-sm text-gray-600">
                {features.map((item, index) => (
                    <div key={index} className="flex items-center gap-1 sm:gap-1.5">
                        <span className="text-gray-400 [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5">{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>

            {requirements.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                    {requirements.map((item, index) => (
                        <div key={index} className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-amber-50 rounded-lg border border-amber-100">
                            <span className="text-amber-600 [&>svg]:w-3.5 [&>svg]:h-3.5 sm:[&>svg]:w-4 sm:[&>svg]:h-4">{item.icon}</span>
                            <span className="text-[10px] sm:text-xs text-amber-700 font-medium">{item.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

