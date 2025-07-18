import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

export default function CampaignsCard({ campaigns, isAdmin=false }) {
    console.log(campaigns);
    const { i18n } = useTranslation();
    const currentLang = i18n.language;
    if (!campaigns || campaigns.length === 0) {
        return <p>No campaigns available.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
            {campaigns.map((campaign) => {
                const titleObj = typeof campaign.title === 'string' ? JSON.parse(campaign.title) : campaign.title;
                return (
                    <Link
                        href={isAdmin ? `/adminpanel/campaigns/${campaign.id}` : `/campaigns/${campaign.id}`}
                        className="col-span-1 rounded-2xl bg-white shadow-md"
                        key={campaign.id}
                    >
                        {isAdmin && (
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-md mb-2">
                                <div className={`${campaign.status === 'active' ? "text-green-500" : "text-red-500"} font-semibold`}>
                                    {campaign.status}
                                </div>
                                <button
                                    onClick={() => handleEdit(campaign.id)} className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 cursor-pointer">
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
                                {titleObj[currentLang] || "No Title"}
                            </h3>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
