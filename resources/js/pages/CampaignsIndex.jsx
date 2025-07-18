import Navbar from "../components/websites/Navbar.jsx";
import { useTranslation } from "react-i18next";

export default function CampaignsIndex({ campaign }) {
    const { i18n } = useTranslation();
    const currentLang = i18n.language.split("-")[0];
    const titleObj = typeof campaign.title === 'string' ? JSON.parse(campaign.title) : campaign.title;
    const contentObj = typeof campaign.content === 'string' ? JSON.parse(campaign.content) : campaign.content;

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="max-w-5xl mx-auto mt-10 bg-white shadow-xl rounded-2xl overflow-hidden">
                <h1 className="text-2xl font-semibold px-8 pt-6 text-gray-800">
                    {titleObj[currentLang]}
                </h1>

                <div className="w-full h-72 overflow-hidden mt-4">
                    <img
                        src={`/storage/${campaign.photo_path}`}
                        alt="Campaign Banner"
                        className="w-full h-full object-contain"
                    />
                </div>

                <div className="px-8 py-6 text-gray-700 text-base leading-relaxed">
                    {campaign.content ? (
                        <div dangerouslySetInnerHTML={{ __html: contentObj[currentLang] }} />
                    ) : (
                        <p>İçerik bulunamadı.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
