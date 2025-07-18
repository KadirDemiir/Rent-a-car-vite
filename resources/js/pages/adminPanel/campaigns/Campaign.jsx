import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import CampaignForm from "../../../components/adminPanel/campaign/CampaignForm.jsx";
import {Link} from "@inertiajs/react"

export default function Campaign({campaign, success}) {
    const onSubmit = () =>{};
    const titleObj = typeof campaign.title === 'string' ? JSON.parse(campaign.title) : campaign.title;
    return (
        <div className="w-full min-h-screen bg-gray-100">
            <Navbar />
            <div className="pl-64 pt-24 pr-4">
                <h3 className="text-3xl font-bold mb-4">✏️ Kampanya Düzenle</h3>
                <div className={`p-4`}>
                    {success && <><div className={`py-2 pl-4 bg-green-500 border-l-8 border-green-600 text-white`}>{success}</div></> }
                    <Link href="/adminpanel/campaigns"  className={`font-extrabold`}>Kampanyalar</Link>/<span>{titleObj["en"]}</span>
                </div>
                <CampaignForm mode="edit" campaign={campaign} onSubmit={onSubmit} />
            </div>
        </div>
    );
}
