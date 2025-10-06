import {Link} from "@inertiajs/react";

export default function CampaignCard({campaign, isAdmin, currentLang}){
    const titleObj = typeof campaign.title === 'string' ? JSON.parse(campaign.title) : campaign.title;
    return (
        <>
            {isAdmin && (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-md mb-2">
                    <div className={`${campaign.status === 'active' ? "text-green-500" : "text-red-500"} font-semibold`}>
                        {campaign.status}
                    </div>
                    <button
                        className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                            <path d="M11 4h7a2 2 0 0 1 2 2v7"></path>
                            <path d="M16 3l5 5-9 9H7v-5l9-9z"></path>
                        </svg>
                        <span> Düzenle</span>
                    </button>
                </div>
            )}
            <img
                src={`/storage/${campaign.photo_path}`}
                alt={campaign.title?.[currentLang] || "Campaign"}
                className="rounded-t-2xl w-full h-80 object-contain"
            />
            <div className="mt-2 pt-4 px-4 pb-4 bg-blue-50 rounded-md">
                <h3 className="font-bold text-lg">
                    {titleObj?.[currentLang] || "No Title"}
                </h3>
            </div>
        </>
    );
}
