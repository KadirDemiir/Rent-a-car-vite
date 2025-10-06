import Input from "../Input.jsx";
import {useEffect, useState} from "react";
import SelectOptions from "../../../websites/filterSelectors/SelectOptions.jsx";
import Confirm from "../../../Confirm.jsx";
import {router} from "@inertiajs/react";
import {useTranslation} from "react-i18next";
const langOpt = [{ label: "Türkçe", value: "tr" }, { label: "İngilizce", value: "en" }];
export default function ExternalServiceForm({service, close, onSubmit}){
    const {t} = useTranslation();
    const [lang, setLang] = useState("tr");
    const [inputErrors, setInputErrors] = useState({});
    const [currency, setCurrency] = useState("eur");
    const [formError, setFormError] = useState();
    const [name, setName] = useState(service?.name ? JSON.parse(service.name) :  {});
    const [description, setDescription] = useState(service?.description ? JSON.parse(service.description) : {})
    const [oneThreeDayPrice, setOneThreeDayPrice] = useState(service?.one_three_day_price || "");
    const [fourSevenDayPrice, setFourSevenDayPrice] = useState(service?.four_seven_day_price || "");
    const [eightFifteenDayPrice, setEightFifteenDayPrice] = useState(service?.eight_fifteen_day_price || "");
    const [moreThanFifteenDayPrice, setMoreThanFifteenDayPrice] = useState(service?.more_than_fifteen_day_price || "");
    const [stock, setStock] = useState(service?.stock || "");
    const [maxLimit, setMaxLimit] = useState(service?.max_limit || "");
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    useEffect(() => {
        if (!service?.name) {
            setName(Object.fromEntries(langOpt.map(l => [l.value, ""])));
            setDescription(Object.fromEntries(langOpt.map(l => [l.value, ""])));
        }
    }, []);

    const deleteService = (confirm) => {
        if(!confirm){
            setConfirmModalOpen(false);
            return;
        }else{
            const id = service.id;
            router.post("/admin/extra-services", {
                id,
                _method: "delete",
            });
            close();
            setConfirmModalOpen(false);
        }
    }
    const handleSubmit = () => {
        setFormError("");
        const hasAnyError = Object.values(inputErrors).some(val => val !== null && val !== "");
        if (hasAnyError){
            setFormError("Lütfen Tüm Alanları İstenen Şekilde Doldurunuz.");
            return;
        }
        if((Object.values(name).some(val => val === "" || val === null) || (Object.values(description).some(val => val === "" || val === null)))){
            setFormError("Lütfen Tüm Dil Seçenekleri İçin Servis Adını ve Açıklamasını Giriniz");
            return;
        }
        if (oneThreeDayPrice === "" || fourSevenDayPrice === "" || eightFifteenDayPrice === "" || moreThanFifteenDayPrice === "" || stock === "" || maxLimit === "") {
            setFormError("Lütfen tüm fiyat ve stok alanlarını doldurunuz.");
            return;
        }
        const formData = new FormData();
        formData.append("name", JSON.stringify(name));
        formData.append("description", JSON.stringify(description));
        formData.append("one_three_day_price", oneThreeDayPrice);
        formData.append("four_seven_day_price", fourSevenDayPrice);
        formData.append("eight_fifteen_day_price", eightFifteenDayPrice);
        formData.append("more_than_fifteen_day_price", moreThanFifteenDayPrice);
        formData.append("stock", stock);
        formData.append("max_limit", maxLimit);
        formData.append("currency", currency);
        if(service)
            formData.append("id", service.id);
        onSubmit(formData);
    }
    return(
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formError && <div className={`border-l-12 border-red-600 bg-red-400 text-white col-span-2 p-2 text-sm`}>{formError}</div>}
            <div className={`col-span-2`}><SelectOptions options={langOpt} options_name={t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.select_language")} value={lang} onChange={(e) => setLang(e)}/></div>
            <Input label={t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.service_name")} value={name[lang] ?? ""} onChange={(e) => {
                setName(prev => ({
                    ...prev,
                    [lang]: e.target.value,
                }))
            }} />
            <Input label={t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.service_description")} value={description[lang] ?? ""} onChange={(e) => {
                setDescription(prev => ({
                    ...prev,
                    [lang]: e.target.value,
                }))
            }} />
            <div className={`col-span-2`}><SelectOptions options={[{label:"TL",value:"try"},{label:"Euro",value:"eur"}]} value={currency|| "try"} onChange={(e)=>setCurrency(e)} options_name={t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.currency")}/></div>
            <Input name="on-three" label={t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.1-3_days_price")} type="number" value={oneThreeDayPrice || ""} onChange={(e) => setOneThreeDayPrice(e.target.value)} error={inputErrors} setError={setInputErrors}/>
            <Input name="four-seven" label={t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.4-7_days_price")} type="number" value={fourSevenDayPrice || ""} onChange= {(e) => setFourSevenDayPrice(e.target.value)}  error={inputErrors} setError={setInputErrors}/>
            <Input name="eight-fifteen" label={t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.8-15_days_price")} type="number" value={eightFifteenDayPrice || ""} onChange={(e) => setEightFifteenDayPrice(e.target.value)}  error={inputErrors} setError={setInputErrors}/>
            <Input name="moreThanFifteen" label={t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.more_than_15_days_price")} type="number" value={moreThanFifteenDayPrice || ""} onChange={(e) => setMoreThanFifteenDayPrice(e.target.value)}  error={inputErrors} setError={setInputErrors}/>
            <Input name="stock" label={t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.stock")} type="number" value={stock} onChange={(e) => setStock(e.target.value)} error={inputErrors} setError={setInputErrors}/>
            <Input name="limit" label={t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.max_limit")} type="number" value={maxLimit} onChange={(e) => setMaxLimit(e.target.value)} error={inputErrors} setError={setInputErrors}/>
            {/*<Input label="Mevcut Sayı" type="number" value={currentCount} onChange={(e) => setCurrentCount(e.target.value)} />*/}
            <div className={`col-span-2 flex items-center justify-between gap-4`}>
                <div className={``}>
                    {service && <button onClick={() => setConfirmModalOpen(true)} className={`rounded-lg bg-red-500 text-white hover:bg-red-600 py-2 px-4 cursor-pointer`}>Sil</button> }
                </div>
                <div className={`flex gap-4`}>
                    <button type="button" onClick={close} className={`rounded-lg bg-gray-500 text-white hover:bg-gray-600 py-2 px-4 cursor-pointer`}>{t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.cancel")}</button>
                    <button type="button" onClick={handleSubmit} className={`rounded-lg bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 cursor-pointer`}>{service ? t("adminpanel.pricing.adding_services.external_services.update_service_modal.save") : t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.cancel")}</button>
                </div>
            </div>
            {confirmModalOpen && <Confirm message="Servisi Silmek İStediğinize Emin Misiniz?" confirm={deleteService} />}
        </div>
    );
}
