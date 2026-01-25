import {useState} from "react";
import CampaignCard from "../../websites/campaignsCard/CampaignCard.jsx";
import {Link} from "@inertiajs/react";

export default function CampaignLanguage({campaigns, lang}){
    return(
        <div className="w-full space-y-4 md:space-y-6">
            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {campaigns.map((cmp, index) => {
                    const cmT = JSON.parse(cmp.title);
                    const cmC = JSON.parse(cmp.content);
                    const isMissing = !cmT?.[lang.code]?.trim() || !cmC?.[lang.code]?.trim();

                    return(
                        <Link key={index} href={`/adminpanel/campaigns/${cmp.id}?lang=${lang.code}`} className="block">
                            <div className={`relative h-full rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                isMissing 
                                    ? 'border-red-300 bg-red-50 ring-1 ring-red-200' 
                                    : 'border-gray-200 bg-white hover:shadow-lg'
                            }`}>
                                {/* Missing Content Warning */}
                                {isMissing && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-red-50/90 backdrop-blur-sm z-20">
                                        <div className="text-center px-4">
                                            <div className="text-red-600 font-semibold mb-1 text-sm md:text-base">
                                                Title and Content Required For: {lang.code}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Campaign Card */}
                                <CampaignCard campaign={cmp} isAdmin={true} currentLang={lang.code}/>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
