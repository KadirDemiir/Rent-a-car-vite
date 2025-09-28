import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import CampaignCard from "./CampaignCard.jsx";

export default function CampaignsCards({ campaigns, isAdmin=false }) {
    const { i18n } = useTranslation();
    const currentLang = i18n.language;
    if (!campaigns || campaigns.length === 0) {
        return <p>No campaigns available.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
            {campaigns.map((campaign) => {
                return(
                    <Link
                        href={isAdmin ? `/adminpanel/campaigns/${campaign.id}` : `/campaigns/${campaign.id}`}
                        className="col-span-1 rounded-2xl bg-white shadow-md"
                        key={campaign.id}
                    >
                        <CampaignCard campaign={campaign} isAdmin={isAdmin} currentLang={currentLang}/>
                    </Link>
                    );
            })}
        </div>
    );
}
