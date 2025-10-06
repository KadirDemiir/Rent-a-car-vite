import {useState} from "react";
import CampaignCard from "../../websites/campaignsCard/CampaignCard.jsx";
import {Link} from "@inertiajs/react";

export default function CampaignLanguage({campaigns, lang}){
    const [camp, setCamp] = useState(() => campaigns.filter(cm => cm.title[lang.code] && cm.content[lang.code]));
    return(
        <div className={`w-full grid grid-cols-2`}>
            {campaigns.map((cmp, index) => {
                const cmT = JSON.parse(cmp.title);
                const cmC = JSON.parse(cmp.content);
                if (!cmT?.[lang.code]?.trim() || !cmC?.[lang.code]?.trim()) {
                return(
                        <div className={`border-4 border-red-600 rounded-lg`} key={index}>
                            <div className={`w-full font-semibold text-red-600 pl-2`}>Title and Content Required For: {lang.code}</div>
                            <Link href={`/adminpanel/campaigns/${cmp.id}?lang=${lang.code}`}>
                                <CampaignCard campaign={cmp} isAdmin={true} currentLang={lang.code}/>
                            </Link>
                        </div>
                    );
                }
            })}
        </div>
    );
}
