import { Link } from "@inertiajs/react";
import { Edit, Calendar, TrendingUp, ArrowRight } from 'lucide-react';

export default function CampaignCard({campaign, isAdmin, currentLang}){
    const titleObj = typeof campaign.title === 'string' ? JSON.parse(campaign.title) : campaign.title;
    const contentObj = typeof campaign.content === 'string' ? JSON.parse(campaign.content) : campaign.content;
    
    // Format dates if available
    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group h-full flex flex-col">
            {/* Status Badge - Only for Admin */}
            {isAdmin && (
                <div className="absolute top-4 left-4 z-10">
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm ${
                        campaign.status === 'active' 
                            ? 'bg-green-500/90 text-white' 
                            : 'bg-red-500/90 text-white'
                    }`}>
                        {campaign.status}
                    </div>
                </div>
            )}

            {/* Edit Button - Only for Admin */}
            {isAdmin && (
                <div className="absolute top-4 right-4 z-10">
                    <button className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-110">
                        <Edit className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Image Container with Overlay */}
            <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                    src={`/storage/${campaign.photo_path}`}
                    alt={titleObj?.[currentLang] || "Campaign"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating Action Badge */}
                <div className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col p-6">
                {/* Date Range */}
                {campaign.start_date && campaign.end_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">
                            {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
                        </span>
                    </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    {titleObj?.[currentLang] || "Untitled Campaign"}
                </h3>

                {/* Description Preview */}
                {contentObj?.[currentLang] && (
                    <div 
                        className="rte-content text-gray-600 text-sm"
                        dangerouslySetInnerHTML={{ __html: contentObj[currentLang] }}
                    />
                )}

                {/* Call to Action */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                        View Details
                    </span>
                    <TrendingUp className="w-5 h-5 text-blue-600 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
    );
}
