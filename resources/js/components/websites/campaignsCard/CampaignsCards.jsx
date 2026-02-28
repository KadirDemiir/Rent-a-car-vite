import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import CampaignCard from "./CampaignCard.jsx";
import { AlertCircle, TrendingUp } from 'lucide-react';

export default function CampaignsCards({ campaigns, isAdmin = false }) {
    const {t, i18n } = useTranslation();
    const currentLang = i18n.language;

    if (!campaigns || campaigns.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Campaigns Available</h3>
                <p className="text-gray-500 text-center max-w-md">
                    We're working on exciting offers for you. Check back soon!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Badge */}
            {!isAdmin && campaigns.length > 0 && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4 text-gray-700" />
                    <span className="font-medium">{campaigns.length} Active {campaigns.length === 1 ? 'Campaign' : 'Campaigns'}</span>
                </div>
            )}

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {campaigns.map((campaign, index) => (
                    <Link
                        href={isAdmin ? `/${i18n.language}/${t('address.adminpanel')}/${t('address.campaigns')}/${campaign.id}` : `/${i18n.language}/${t('address.campaigns')}/${campaign.id}`}
                        key={campaign.id}
                        className="group"
                        style={{
                            animationDelay: `${index * 100}ms`,
                            animation: 'fadeInUp 0.6s ease-out forwards',
                            opacity: 0
                        }}
                    >
                        <CampaignCard
                            campaign={campaign}
                            isAdmin={isAdmin}
                            currentLang={currentLang}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}
