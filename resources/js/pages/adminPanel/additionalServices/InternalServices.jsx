import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import Confirm from "../../../components/Confirm.jsx";
import { useState } from "react";
import {useTranslation} from "react-i18next";
import axios from "axios";
import LanguageProgress from "../../../components/adminPanel/LanguageProgress.jsx";

export default function InternalServices({services, languages}) {
    const [langOpt, setLangOpt] = useState(() => languages.map(l => ({label: l.name, value: l.code})));
    const [updatedServices, setUpdatedServices] = useState(services);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const {t} = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState();
    const [lang, setLang] = useState(langOpt[0]?.value || "tr");
    const [formError, setFormError] = useState();
    const [name, setName] = useState(() => (
        Object.fromEntries(langOpt.map(l => [l.value, ""]))
    ));
    const [description,  setDescription] = useState(() => (
        Object.fromEntries(langOpt.map(l => [l.value, ""]))
    ));

    const languageProgress = () => {
        const totalFields = langOpt.length * 2;
        const filledFields = langOpt.filter(l => 
            name[l.value]?.trim() && description[l.value]?.trim()
        ).length * 2;
        return Math.round((filledFields / totalFields) * 100);
    };

    const isLanguageFilled = (langValue) => {
        return name[langValue]?.trim() && description[langValue]?.trim();
    };

    const onConfirmAction = (confirm) => {
        if (!confirm)
            setIsModalOpen(false);
        else {
            const id = selectedService.id;
            axios.delete(`/adminpanel/internal-services`, {
                data: {
                    id: id
                }
            })
                .then(response => {
                    setIsModalOpen(false);
                    setSelectedService("");
                    if (response.data.success) {
                        setSuccess("Deleted Succesfully");
                        setUpdatedServices(response.data.services);
                    }
                    else setError("Something Went Wrong");
                })
                .catch(error => {
                    console.error('Hata:', error.res.error);
                });
        }
    }
    const handleAddNew = () => {
        if (langOpt.some(l => !name[l.value]?.trim() || !description[l.value]?.trim()) ) {
            setFormError("Lütfen Her Dil İçin Servis İsmi Ve Açıklaması Giriniz.");
            return;
        }
        const data = new FormData();
        data.append('name', JSON.stringify(name));
        data.append('description', JSON.stringify(description));
        axios.post('/adminpanel/internal-services', data)
            .then(response => {
                if(response.data.success) setSuccess("added succesfully");
                else setError("something went wrong");
                setUpdatedServices(response.data.services);

            })
            .catch(error => {
                console.error(error);
            })

    }

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <Navbar>
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">{t("adminpanel.pricing.adding_services.internal_services.internal_services")}</h3>
                    
                    {error && <div className="mb-4 border-l-4 border-red-500 bg-red-50 text-red-700 p-4 rounded">{error}</div>}
                    {formError && <div className="mb-4 border-l-4 border-red-500 bg-red-50 text-red-700 p-4 rounded">{formError}</div>}
                    {success && <div className="mb-4 border-l-4 border-green-500 bg-green-50 text-green-700 p-4 rounded">{success}</div>}
                    
                    {/* Services Table Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-semibold text-gray-900">{t("adminpanel.pricing.adding_services.internal_services.internal_services")}</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">{t("adminpanel.pricing.adding_services.internal_services.internal_services")}</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">{t("adminpanel.pricing.adding_services.external_services.description")}</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">{t("adminpanel.pricing.adding_services.internal_services.operations")}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {updatedServices?.map((im, index) => {
                                        const serviceName = JSON.parse(im.name);
                                        const serviceDescription = JSON.parse(im.description);
                                        return(
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{serviceName["tr"]}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{serviceDescription["tr"]}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <button 
                                                        onClick={() => {setSelectedService(im); setIsModalOpen(true)}} 
                                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                                                    >
                                                        {t("adminpanel.pricing.adding_services.internal_services.operations")}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {updatedServices?.length === 0 && (
                                <div className="px-6 py-8 text-center text-gray-500">
                                    {t("adminpanel.pricing.adding_services.internal_services.internal_services")}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Add New Service Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-semibold text-gray-900">{t("adminpanel.pricing.adding_services.internal_services.add_new_services")}</h2>
                        </div>
                        <div className="p-6">
                            <div className="max-w-2xl mx-auto space-y-4">
                                <LanguageProgress langOpt={langOpt} calculateProgress={languageProgress} isLanguageFilled={isLanguageFilled} lang={lang} setLang={setLang}/>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t("adminpanel.pricing.adding_services.internal_services.enter_a_new_service")}</label>
                                    <input 
                                        value={name[lang]} 
                                        onChange={(e) => {
                                            setName(prev => ({
                                                ...prev,
                                                [lang]: e.target.value
                                            }))
                                        }} 
                                        type="text" 
                                        placeholder={t("adminpanel.pricing.adding_services.internal_services.enter_a_new_service")} 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t("adminpanel.pricing.adding_services.internal_services.enter_a_new_service_description")}</label>
                                    <input 
                                        value={description[lang]} 
                                        onChange={(e) => {
                                            setDescription(prev => ({
                                                ...prev,
                                                [lang]: e.target.value
                                            }))
                                        }} 
                                        type="text" 
                                        placeholder={t("adminpanel.pricing.adding_services.internal_services.enter_a_new_service_description")} 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="pt-4">
                                    <button 
                                        onClick={handleAddNew} 
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
                                    >
                                        {t("adminpanel.pricing.adding_services.internal_services.save")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Navbar>

            {isModalOpen && (
                <Confirm message={t("adminpanel.pricing.adding_services.internal_services.operations")} confirm={onConfirmAction}/>
            )}
        </div>
    );
}
