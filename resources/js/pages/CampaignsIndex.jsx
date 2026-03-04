import Navbar from "../components/websites/Navbar.jsx";
import {useTranslation} from "react-i18next";
import SideTitlePreview from "../components/websites/SideTitlePreview.jsx";

export default function CampaignsIndex({campaign}) {
    const {i18n} = useTranslation();
    const currentLang = i18n.language.split("-")[0];
    const titleObj = typeof campaign.title === 'string' ? JSON.parse(campaign.title) : campaign.title;
    const contentObj = typeof campaign.content === 'string' ? JSON.parse(campaign.content) : campaign.content;

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar/>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    <main className="w-full lg:w-[75%]">
                        <article className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100">
                            <h1 className="text-3xl md:text-4xl font-bold px-6 md:px-8 pt-8 text-gray-900 leading-tight">
                                {titleObj[currentLang]}
                            </h1>

                            <div className="w-full aspect-video md:aspect-[21/9] lg:aspect-[3/1] overflow-hidden mt-6 bg-gray-100">
                                <img
                                    src={`/storage/${campaign.photo_path}`}
                                    alt={titleObj[currentLang]}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                    loading="lazy"
                                />
                            </div>

                            <div className="px-6 md:px-8 py-8 text-gray-800 text-base md:text-lg leading-relaxed">
                                {campaign.content ? (
                                    <div
                                        className="campaign-content wysiwyg-content wrap-break-words"
                                        dangerouslySetInnerHTML={{__html: contentObj[currentLang]}}
                                    />
                                ) : (
                                    <p>İçerik bulunamadı.</p>
                                )}
                            </div>
                        </article>
                    </main>

                    <aside className="w-full lg:w-[25%]">
                        <SideTitlePreview currentId={campaign.id} href={`/get-campaign-titles`} addressName={`address.campaigns`}/>
                    </aside>

                </div>
            </div>
        </div>
    );
}
