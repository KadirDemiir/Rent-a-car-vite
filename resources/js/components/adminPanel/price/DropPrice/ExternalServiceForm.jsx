import Input from "../Input.jsx";
import {useEffect, useState} from "react";
import SelectOptions from "../../../websites/filterSelectors/SelectOptions.jsx";
import Confirm from "../../../Confirm.jsx";
import { router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import {useCurrency} from "../../../../providers/CurrencyContext.jsx";
import LanguageProgress from "../../LanguageProgress.jsx";

export default function ExternalServiceForm({ service, close, onSubmit, languages = [] }) {
    console.log(service?.extra_service_prices);
    const { t } = useTranslation();
    const [lang, setLang] = useState(languages[0]?.value ?? '');
    const {currencies, calculateTotal} = useCurrency();
    const [currency, setCurrency] = useState(service?.extra_service_prices[0]?.currency_id ?? currencies[1]?.id ?? '');
    const [inputErrors, setInputErrors] = useState({});
    const [formError, setFormError] = useState();
    const [name, setName] = useState(service?.name ? JSON.parse(service.name) : {});
    const [description, setDescription] = useState(service?.description ? JSON.parse(service.description) : {});
    const [stock, setStock] = useState(service?.stock || "");
    const [maxLimit, setMaxLimit] = useState(service?.max_limit || "");
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [pricingTiers, setPricingTiers] = useState(null);

    useEffect(() => {
        if (!service?.extra_service_prices) {
            setPricingTiers([
                {min_days:1, max_days:3, price: "", label_key:"1-3_days_price"},
                {min_days:4, max_days:7, price: "", label_key:"4-7_days_price"},
                {min_days:8, max_days:15, price:"", label_key:"8-15_days_price"},
                {min_days:16, max_days:999, price: "", label_key:"more_than_15_days_price"}
            ]);
            return;
        };
        const getP = (min, max) => {
            return service.extra_service_prices.find(e => e.min_days === min && e.max_days === max)?.price;
        };
        setPricingTiers([
            {min_days:1, max_days:3, price: getP(1,3), label_key:"1-3_days_price"},
            {min_days:4, max_days:7, price:getP(4,7), label_key:"4-7_days_price"},
            {min_days:8, max_days:15, price:getP(8,15), label_key:"8-15_days_price"},
            {min_days:16, max_days:999, price:getP(16,999), label_key:"more_than_15_days_price"}
        ]);
    }, [service, calculateTotal]);

    const handlePriceChange = (i, v) => setPricingTiers(p => {
        const n = [...p];
        n[i] = { ...n[i], price: v };
        return n;
    });

    const deleteService = (confirm) => {
        if (!confirm) {
            setConfirmModalOpen(false);
            return 0;
        } else {
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
        if (hasAnyError) {
            setFormError("Lütfen Tüm Alanları İstenen Şekilde Doldurunuz.");
            return;
        }

        if ((Object.values(name).some(val => val === "" || val === null) || (Object.values(description).some(val => val === "" || val === null)))) {
            setFormError("Lütfen Tüm Dil Seçenekleri İçin Servis Adını ve Açıklamasını Giriniz");
            return;
        }

        if (pricingTiers.some(tier => tier.price === "")) {
            setFormError("Lütfen tüm fiyat aralıklarını doldurunuz.");
            return;
        }

        if (stock === "" || maxLimit === "") {
            setFormError("Lütfen stok ve limit alanlarını doldurunuz.");
            return;
        }

        const formData = new FormData();
        formData.append("name", JSON.stringify(name));
        formData.append("description", JSON.stringify(description));
        formData.append("stock", stock);
        formData.append("max_limit", maxLimit);
        formData.append("currency", currency);
        formData.append("pricing", JSON.stringify(pricingTiers.map(({ label_key, ...rest }) => rest)));

        if (service)
            formData.append("id", service.id);

        onSubmit(formData);
    }

    const filledLanguageCount = languages.reduce((count, language) => {
        const langCode = language.value;
        const isFilled = name[langCode] && description[langCode];
        return count + (isFilled ? 1 : 0);
    }, 0);

    const progressPercentage = languages.length > 0 ? Math.round((filledLanguageCount / languages.length) * 100) : 0;


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formError && <div className={`border-l-12 border-red-600 bg-red-400 text-white col-span-2 p-2 text-sm`}>{formError}</div>}

            <div className={`col-span-2`}>
                <LanguageProgress langOpt={languages} calculateProgress={() => progressPercentage} isLanguageFilled={(langValue) => name[langValue]?.trim() && description[langValue]?.trim()} lang={lang} setLang={setLang} />
            </div>
            <Input
                label={t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.service_name")}
                value={name[lang] ?? ""}
                onChange={(e) => {
                    setName(prev => ({ ...prev, [lang]: e.target.value }))
                }}
            />

            <Input
                label={t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.service_description")}
                value={description[lang] ?? ""}
                onChange={(e) => {
                    setDescription(prev => ({ ...prev, [lang]: e.target.value }))
                }}
            />

            <div className={`col-span-2`}>
                <SelectOptions options={currencies.map(c => ({label: `${c.code.toUpperCase()} ${c.symbol}`, value: c.id}))} value={[currency]} onChange={(e) => setCurrency(e)} options_name={t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.currency")} />
            </div>

            {pricingTiers?.map((tier, index) => (
                <Input
                    key={index}
                    name={`tier-${index}`}
                    label={t(`adminpanel.pricing.adding_services.external_services.add_new_service_modal.${tier.label_key}`)}
                    type="number"
                    value={tier.price}
                    onChange={(e) => handlePriceChange(index, e.target.value)}
                    error={inputErrors}
                    setError={setInputErrors}
                />
            ))}

            <Input name="stock" label={t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.stock")} type="number" value={stock} onChange={(e) => setStock(e.target.value)} error={inputErrors} setError={setInputErrors} />
            <Input name="limit" label={t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.max_limit")} type="number" value={maxLimit} onChange={(e) => setMaxLimit(e.target.value)} error={inputErrors} setError={setInputErrors} />

            <div className={`col-span-2 flex items-center justify-between gap-4`}>
                <div className={``}>
                    {service && <button onClick={() => setConfirmModalOpen(true)} className={`rounded-lg bg-red-500 text-white hover:bg-red-600 py-2 px-4 cursor-pointer`}>Sil</button>}
                </div>
                <div className={`flex gap-4`}>
                    <button type="button" onClick={close} className={`rounded-lg bg-gray-500 text-white hover:bg-gray-600 py-2 px-4 cursor-pointer`}>{t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.cancel")}</button>
                    <button type="button" onClick={handleSubmit} className={`rounded-lg bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 cursor-pointer`}>{service ? t("adminpanel.pricing.adding_services.external_services.update_service_modal.save") : t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.save")}</button>
                </div>
            </div>
            {confirmModalOpen && <Confirm message="Servisi Silmek İStediğinize Emin Misiniz?" confirm={deleteService} />}
        </div>
    );
}
