export default function ReservationCarInfo({
    className = "",
    segmentLabel,
    title,
    features = [],
    requirements = [],
}) {
    return (
        <div className={`col-span-1 md:col-span-6 lg:col-span-5 flex flex-col items-center justify-between gap-4 p-1 ${className}`}>
            <div className="flex items-center gap-4 flex-wrap justify-center text-center">
                {segmentLabel && (
                    <span className="text-blue-700 font-bold bg-blue-100 px-3 py-1 rounded-full text-sm">
                        {segmentLabel}
                    </span>
                )}
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            </div>

            {features.length > 0 && (
                <div className="flex flex-wrap gap-3 justify-center">
                    {features.map((item, index) => (
                        <div key={index} className="flex flex-col items-center justify-center p-2 rounded-xl w-20 shadow-xl">
                            {item.icon}
                            <span className="text-sm text-gray-600 text-center">{item.label}</span>
                        </div>
                    ))}
                </div>
            )}

            {requirements.length > 0 && (
                <div className="flex flex-wrap gap-3 justify-center">
                    {requirements.map((item, index) => (
                        <div key={index} className="flex flex-col items-center justify-center p-2 rounded-xl w-24 shadow-2xl">
                            {item.icon}
                            <span className="text-sm text-gray-600 text-center">{item.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

