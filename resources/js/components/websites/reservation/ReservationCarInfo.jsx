export default function ReservationCarInfo({
    className = "",
    segmentLabel,
    title,
    features = [],
    requirements = [],
}) {
    return (
        <div className={`col-span-1 md:col-span-6 lg:col-span-5 flex flex-col justify-center gap-3 ${className}`}>
            <div className="flex items-center gap-3">
                {segmentLabel && (
                    <span className="px-2.5 py-1 text-[10px] font-bold text-gray-700 bg-gray-50 rounded-md uppercase tracking-wider border border-gray-200">
                        {segmentLabel}
                    </span>
                )}
            </div>
            
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{title}</h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                {features.map((item, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                        <span className="text-gray-400">{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>

            {requirements.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                    {requirements.map((item, index) => (
                        <div key={index} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 rounded-lg border border-amber-100">
                            <span className="text-amber-600">{item.icon}</span>
                            <span className="text-xs text-amber-700 font-medium">{item.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

