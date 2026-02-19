export default function CampaignCard({campaign, isAdmin, currentLang}){
    const titleObj = typeof campaign.title === 'string' ? JSON.parse(campaign.title) : campaign.title;
    const contentObj = typeof campaign.content === 'string' ? JSON.parse(campaign.content) : campaign.content;

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="relative bg-white rounded-lg overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-md group">
            {/* Status Badge - Only for Admin */}
            {isAdmin && (
                <div className="absolute top-3 left-3 z-10">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                        campaign.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}>
                        {campaign.status}
                    </div>
                </div>
            )}

            {/* Image Container */}
            <div className="relative w-full h-40 md:h-48 overflow-hidden bg-gray-100">
                <img
                    src={`/storage/${campaign.photo_path}`}
                    alt={titleObj?.[currentLang] || "Campaign"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                />
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col p-3 md:p-4 space-y-2 md:space-y-3">
                {/* Date Range */}
                {campaign.start_date && campaign.end_date && (
                    <div className="text-xs md:text-sm text-gray-500 font-medium">
                        {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
                    </div>
                )}

                {/* Title */}
                <h3 className="text-sm md:text-base font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {titleObj?.[currentLang] || "Untitled Campaign"}
                </h3>

                {/* Description Preview */}
{/*                {contentObj?.[currentLang] && (
                    <div
                        className="rte-content text-gray-600 text-xs md:text-sm line-clamp-2 flex-1"
                        dangerouslySetInnerHTML={{ __html: contentObj[currentLang] }}
                    />
                )}*/}

                {/* Footer Action */}
                <div className="pt-2 md:pt-3 border-t border-gray-100 text-blue-600 font-medium text-xs md:text-sm group-hover:text-blue-700 transition-colors duration-200">
                    View Details →
                </div>
            </div>
        </div>
    );
}
