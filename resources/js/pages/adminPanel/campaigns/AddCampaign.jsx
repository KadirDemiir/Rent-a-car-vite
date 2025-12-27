import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import CampaignForm from "../../../components/adminPanel/campaign/CampaignForm.jsx";
import {router} from "@inertiajs/react";
import {useTranslation} from "react-i18next";

export default function AddCampaign({languages, success, error }) {

    const {t} = useTranslation();
    const onSubmit = (data) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        router.post('/adminpanel/campaign/add', data, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
            },
        });
    };

    return (
        <div className="w-full min-h-screen bg-gray-100">
            <Navbar >
                <h3 className="text-3xl font-bold mb-4">✏️ {t("adminpanel.pricing.add_campaign.add_campaign")}</h3>
                {success && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
                        <p>{success}</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                        <p>{error}</p>
                    </div>
                )}
                <CampaignForm mode="add" onSubmit={onSubmit} languages={languages}/>
            </Navbar>
        </div>
    );
}
