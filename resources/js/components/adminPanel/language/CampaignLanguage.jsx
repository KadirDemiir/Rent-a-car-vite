import {useState} from "react";
import CampaignCard from "../../websites/campaignsCard/CampaignCard.jsx";
import {Link} from "@inertiajs/react";
import {useTranslation} from "react-i18next";
import { AlertTriangle, ExternalLink } from "lucide-react";

export default function CampaignLanguage({campaigns, lang}){
    const {t, i18n} = useTranslation();
    return(
        <div className="w-full space-y-6">
            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {campaigns.map((cmp, index) => {
                    const cmT = JSON.parse(cmp.title);
                    const cmC = JSON.parse(cmp.content);
                    const isMissing = !cmT?.[lang.code]?.trim() || !cmC?.[lang.code]?.trim();

                    return(
                        <Link key={index} href={`/${i18n.language}/${t('address.adminpanel')}/${t('address.campaigns')}/${cmp.id}`} className="block group">
                            <div className={`relative h-full rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                                isMissing
                                    ? 'border-red-300 bg-red-50/50 shadow-red-100 hover:shadow-red-200'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                            } shadow-sm hover:shadow-md`}>
                                {/* Missing Content Warning */}
                                {isMissing && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-red-50/95 to-red-100/95 backdrop-blur-sm z-20 p-4">
                                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-3">
                                            <AlertTriangle size={28} className="text-red-500" />
                                        </div>
                                        <div className="text-center">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs sm:text-sm font-semibold rounded-full">
                                                {lang.code.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Campaign Card */}
                                <div className="relative">
                                    <CampaignCard campaign={cmp} isAdmin={true} currentLang={lang.code}/>
                                    
                                    {/* Hover overlay for link indication */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-200">
                                            <ExternalLink size={20} className="text-gray-700" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Empty State */}
            {campaigns.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={32} className="text-gray-400" />
                    </div>
                </div>
            )}
        </div>
    );
}
