import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import CampaignForm from "../../../components/adminPanel/campaign/CampaignForm.jsx";
import {Link} from "@inertiajs/react"
import {useTranslation} from "react-i18next";
import SuccessMessage from "../../../components/SuccessMessage.jsx";

export default function Campaign({campaign, success, languages}) {
    const titleObj = typeof campaign.title === 'string' ? JSON.parse(campaign.title) : campaign.title;
    const {t, i18n} = useTranslation();
    return (
        <div className="w-full min-h-screen bg-gray-100">
            <Navbar >
                <h3 className="text-3xl font-bold mb-4">✏️ Kampanya Düzenle</h3>
                <div className={`p-4`}>
                    <SuccessMessage message={success} />
                    <Link href={`/${i18n.language}/${t('address.adminpanel')}/${t('address.campaigns')}`}  className={`font-extrabold`}>Kampanyalar/</Link>/<span>{titleObj["tr"]}</span>
                </div>
                <CampaignForm mode="edit" campaign={campaign} languages={languages}/>
            </Navbar>
        </div>
    );
}
