import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import Td from "../../../components/adminPanel/table/Td.jsx";
import Confirm from "../../../components/Confirm.jsx";
import { useState } from "react";
import SelectedOptions from "../../../components/websites/filterSelectors/SelectOptions.jsx";
import {useTranslation} from "react-i18next";
import axios from "axios";

const langOpt = [{label: "Türkçe", value: "tr"}, {label: "İngilizce", value: "en"}];
export default function InternalServices({services}) {
    const [updatedServices, setUpdatedServices] = useState(services);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const {t} = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState();
    const [lang, setLang] = useState("tr");
    const [formError, setFormError] = useState();
    const [name, setName] = useState(() => (
        Object.fromEntries(langOpt.map(l => [l.value, ""]))
    ));
    const [description,  setDescription] = useState(() => (
        Object.fromEntries(langOpt.map(l => [l.value, ""]))
    ));
    const TDclass = "border border-gray-500 px-4 py-2";

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
                    else serError("Something Went Wrong");
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
        <div className="w-full min-h-screen">
            <Navbar >
                <h3 className="text-2xl font-extrabold">{t("adminpanel.pricing.adding_services.internal_services.internal_services")}</h3>
                <hr /><br />
                {error && <div className={`border-l-12 border-red-600 bg-red-400 text-white p-2`}>{error}</div>}
                {formError && <div className={`border-l-12 border-red-600 bg-red-400 text-white p-2`}>{formError}</div>}
                {success && <div className={`border-l-12 border-green-600 bg-green-400 text-white p-2`}>{success}</div>}
                <div>
                    <h2 className={`text-xl font-bold p-2`}>{t("adminpanel.pricing.adding_services.internal_services.internal_services")}</h2>
                    <table className="w-full table-auto">
                        <thead>
                        <tr>
                            <Td contents={[t("adminpanel.pricing.adding_services.internal_services.internal_services"), t("adminpanel.pricing.adding_services.external_services.description"), t("adminpanel.pricing.adding_services.internal_services.operations")]} cls={TDclass} as={"th"} />
                        </tr>
                        </thead>
                        <tbody>
                        {updatedServices?.map((im, index) => {
                            const name = JSON.parse(im.name);
                            const description = JSON.parse(im.description);
                            return(
                            <tr key={index}>
                                <Td contents={[name["tr"], description["tr"]]} cls={TDclass} as={"td"} />
                                <Td
                                    contents={[
                                        <button key={index} onClick={() => {setSelectedService(im); setIsModalOpen(true)}} className="bg-red-500 px-6 rounded-xl text-white cursor-pointer hover:bg-red-600">
                                            Sil
                                        </button>
                                    ]}
                                    cls={TDclass}
                                    as={"td"}
                                />
                            </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div><br /><br /><hr/><br/><br/>
                <h2 className={`text-xl font-bold p-4`}>{t("adminpanel.pricing.adding_services.internal_services.add_new_services")}</h2>
                <div className={`flex items-center justify-center`}>

                <div className="flex flex-col items-center justify-center gap-2 w-[60%]">
                    <SelectedOptions options={langOpt} value={lang} onChange={(e) => setLang(e)} options_name={t("adminpanel.pricing.adding_services.internal_services.select_language")}/>
                    <input value={name[lang]} onChange={(e) => {
                        setName(prev => ({
                            ...prev,
                            [lang]: e.target.value
                        }))
                    }} type="text" placeholder={t("adminpanel.pricing.adding_services.internal_services.enter_a_new_service")} className="pl-2 outline-none w-full border border-blue-500 py-2 rounded-xl"/>
                    <input value={description[lang]} onChange={(e) => {
                        setDescription(prev => ({
                            ...prev,
                            [lang]: e.target.value
                        }))
                    }} type="text" placeholder={t("adminpanel.pricing.adding_services.internal_services.enter_a_new_service_description")} className="pl-2 outline-none w-full border border-blue-500 py-2 rounded-xl"/>
                    <button onClick={handleAddNew} className="bg-blue-500 py-2 px-8 rounded-xl text-white hover:bg-blue-600 cursor-pointer">
                        {t("adminpanel.pricing.adding_services.internal_services.save")}
                    </button>
                </div>
                </div>
            </Navbar>

            {isModalOpen && (
                <Confirm message="Hizmeti Silmek İstediğinizden Emin Misiniz" confirm={onConfirmAction}/>
            )}
        </div>
    );
}
