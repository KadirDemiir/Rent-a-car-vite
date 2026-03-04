import CampaignTextEditor from "./ContentEditor.jsx";
import {useTranslation} from "react-i18next";
export default function AddCampaignInfo({image, title, titleOnChange, slug, slugOnChange, handleImageChange, content, setOnChange, currLan}){
    const {t} = useTranslation();
    return(
        <>
            <label className="block text-lg font-semibold mb-2 text-gray-700">
                {t("adminpanel.pricing.add_campaign.campaign_title")}
            </label>
            <input
                type="text"
                value={title ?? ""}
                onChange={titleOnChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                placeholder={t("adminpanel.pricing.add_campaign.enter_a_campaign_title")}
            />

            <label className="block text-lg font-semibold mb-2 text-gray-700">
                {t("adminpanel.pricing.add_campaign.campaign_slug")}
            </label>
            <input
                type="text"
                value={slug ?? ""}
                onChange={slugOnChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                placeholder={t("adminpanel.pricing.add_campaign.enter_a_campaign_slug")}
            />

            <label className="block text-lg font-semibold mb-2 text-gray-700">
                {t("adminpanel.pricing.add_campaign.campaign_cover_photo")}:
            </label>
            {image && (
                <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[50%] mb-4">
                    <img src={image} alt="Kapak Fotoğrafı" className="w-full h-auto max-h-[400px] object-contain rounded-lg shadow" />
                </div>
            )}

            <div className="py-4">
                <input type="file" accept="image/*" id="file-upload" onChange={handleImageChange} className="hidden"/>
                <label htmlFor="file-upload" className="cursor-pointer bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded-lg transition duration-200 inline-block">
                    {t("adminpanel.pricing.add_campaign.add_photo")}
                </label>
            </div>
            <CampaignTextEditor content={content ?? ""} setContent={setOnChange} currLan={currLan}/>
        </>
    );
}
