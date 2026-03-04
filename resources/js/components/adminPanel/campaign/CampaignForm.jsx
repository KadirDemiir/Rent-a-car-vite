import { useEffect, useState } from "react";
import AddCampaignInfo from "./AddCampaignInfo.jsx";
import DiscountForm from "../price/DiscountForm.jsx";
import DateTimePickerComp from "../price/DateTimePickerComp.jsx";
import Confirm from "../../Confirm.jsx";
import {router, usePage} from "@inertiajs/react";
import {useTranslation} from "react-i18next";
import LanguageProgress from "../LanguageProgress.jsx";

export default function CampaignForm({languages, mode = "add", campaign = null, onSubmit }) {
    const {t} = useTranslation();
    const { url } = usePage();
    const params = new URLSearchParams(url.split('?')[1]);
    const lang = params.get('lang');
    const supportedLangs = languages?.map(lang => ({label: lang.name, value: lang.code}));
    const [currentLang, setCurrentLang] = useState(lang ?? languages?.[0].code);
    const [isDiscountOpen, setIsDiscountOpen] = useState(campaign?.discounts.length || false);
    const [title, setTitle] = useState(() =>
        languages.reduce((acc, lang) => {
            acc[lang.code] = "";
            return acc;}, []));
    const [slug, setSlug] = useState(() =>
        languages.reduce((acc, lang) => {
            acc[lang.code] = "";
            return acc;}, []));
    const [content, setContent] = useState(() =>
        languages.reduce((acc, lang) => {
        acc[lang.code] = "";
        return acc;}, []));
    const [discountTarget, setDiscountTarget] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [selectedDiscount, setSelectedDiscount] = useState("segment");
    const [confirmMessage, setConfirmMessage] = useState({});
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(() => {
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay;
    });
    const [dayDiscount, setDayDiscount] = useState([
        { min_day: "", max_day: "", discount_type: "fixed", currency: "try", discount_amount: "", day_error: "", amount_error: "" }
    ]);
    const [formErrors, setFormErrors] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        if (campaign) {
            try {
                setTitle(typeof campaign.title === "string" ? JSON.parse(campaign.title) : campaign.title);
                setSlug(campaign.slug || languages.reduce((acc, lang) => { acc[lang.code] = ""; return acc; }, {}));
                setContent(typeof campaign.content === "string" ? JSON.parse(campaign.content) : campaign.content);
                setImagePreview(`/storage/${campaign.photo_path}`);
                setStartDate(new Date(campaign.start_date));
                setEndDate(new Date(campaign.end_date));
                if (campaign.discounts.length > 0) {
                setSelectedDiscount(campaign.discounts[0].target_type);
                if(campaign.discounts[0].target_type === "segment") setDiscountTarget(campaign.discounts[0].segment_name);
                    setDayDiscount(
                        Array.isArray(campaign.discounts)
                            ? campaign.discounts.map(discount => ({
                                min_day: discount.min_days,
                                max_day: discount.max_days,
                                discount_type: discount.discount_type,
                                currency: discount.currency,
                                discount_amount: discount.discount_value,
                            }))
                            : []
                    );
                }
            } catch (error) {
                console.error("Kampanya verileri parse edilemedi:", error);
            }
        }
    }, [campaign]);

    useEffect(() => {
        if (endDate <= startDate) {
            const nextDay = new Date(startDate);
            nextDay.setDate(nextDay.getDate() + 1);
            setEndDate(nextDay);
        }
    }, [startDate]);

    const titleOnChange = (e) => setTitle((prev) => ({ ...prev, [currentLang]: e.target.value }));
    const slugOnChange = (e) => setSlug((prev) => ({ ...prev, [currentLang]: e.target.value }));
    const contentOnChange = (val) => setContent((prev) => ({ ...prev, [currentLang]: val }));
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setImageFile(file);
        }
    };

    const validateAndSubmit = () => {
        setFormErrors(null);
        if (supportedLangs.some(sl => !title[sl.value])) {
            setFormErrors("Lütfen her dil için kampanya başlığı oluşturun.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (supportedLangs.some(sl => !slug[sl.value])) {
            setFormErrors("Lütfen her dil için slug oluşturun.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (supportedLangs.some(sl => !content[sl.value])) {
            setFormErrors("Lütfen her dil için kampanya metni oluşturun.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        if (mode === "add" && !imageFile) {
            setFormErrors("Lütfen fotoğraf ekleyin.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const start_date = startDate.toISOString().split("T")[0];
        const end_date = endDate.toISOString().split("T")[0];

        const updatedDiscounts = dayDiscount.map(dd => {
            const newDD = { ...dd };
            if (!dd.min_day && !dd.max_day && !dd.discount_amount) return newDD;
            if (!dd.min_day) newDD.day_error = "Minimum gün boş olamaz.";
            if (!dd.max_day) newDD.day_error = (newDD.day_error || "") + "\nMaksimum gün boş olamaz.";
            if (!dd.discount_amount) newDD.amount_error = "İndirim tutarı boş olamaz.";
            return newDD;
        });

        setDayDiscount(updatedDiscounts);

        const validDiscounts = updatedDiscounts.filter(dd =>
            dd.min_day || dd.max_day || dd.discount_amount
        );
        const hasError = validDiscounts.some(dd => dd.day_error || dd.amount_error);
        if (hasError) {
            setFormErrors("Lütfen eksik veya hatalı indirim alanlarını düzeltin.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (isDiscountOpen && selectedDiscount === "segment" && !discountTarget) {
            setFormErrors("Lütfen bir segment seçiniz.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const formData = new FormData();
        formData.append("title", JSON.stringify(title));
        formData.append("slug", JSON.stringify(slug));
        formData.append("content", JSON.stringify(content));
        if (imageFile) formData.append("image", imageFile);
        formData.append("selectedDiscount", selectedDiscount);
        formData.append("start_date", start_date);
        formData.append("end_date", end_date);
        formData.append("dayDiscounts", JSON.stringify(validDiscounts));
        formData.append("hasDiscount", isDiscountOpen ? 1 : 0);
        formData.append("discountTarget", discountTarget ?? "");

        if (mode === "add") {
            onSubmit(formData);
        } else {
            formData.append("id", campaign.id);
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            router.post(`/adminpanel/campaigns/${campaign.id}`, formData, {
                headers: { 'X-CSRF-TOKEN': csrfToken },
            });
        }
    };

    const deleteCampaign = () => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        router.post('/adminpanel/campaigns', { id: campaign.id }, {
            headers: { 'X-CSRF-TOKEN': csrfToken }
        });
    };

    const handleConfirm = (confirm) => {
        setIsConfirmOpen(false);
        if (!confirm) {
            setConfirmMessage({});
            return;
        }
        if (confirmMessage.event === "delete") deleteCampaign();
        setConfirmMessage({});
    };

    const filledLanguageCount = languages?.reduce((count, language) => {
        const langCode = language.code;
        const isFilled = title[langCode] && slug[langCode] && content[langCode];
        return count + (isFilled ? 1 : 0);
    }, 0);

    const progressPercentage = languages?.length > 0 ? Math.round((filledLanguageCount / languages.length) * 100) : 0;

    return (
        <div className="w-full p-4 shadow-lg rounded-md bg-white">
            {formErrors && (
                <><p className="bg-red-400 border-l-8 border-red-600 text-white p-4">{formErrors}</p><br /></>
            )}
            {isConfirmOpen && <Confirm message={confirmMessage.message} confirm={handleConfirm} />}
            
            <LanguageProgress langOpt={supportedLangs} calculateProgress={() => progressPercentage} isLanguageFilled={(langValue) => title[langValue]?.trim() && slug[langValue]?.trim() && content[langValue]?.trim()} lang={currentLang} setLang={setCurrentLang} />

            <AddCampaignInfo titleOnChange={titleOnChange} title={title[currentLang]} slugOnChange={slugOnChange} slug={slug[currentLang]} handleImageChange={handleImageChange} image={imagePreview} content={content[currentLang]} setOnChange={contentOnChange} currLan={currentLang}/>

            <div className="mt-4">
                <button onClick={() => setIsDiscountOpen(!isDiscountOpen)} className={`py-2 w-36 ${isDiscountOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} flex items-center justify-center rounded-md text-white cursor-pointer`}>
                    {isDiscountOpen ? t("adminpanel.pricing.add_campaign.button.cancel_a_discount") : t("adminpanel.pricing.add_campaign.button.add_a_discount")}
                </button>
            </div>

            {isDiscountOpen && (
                <DiscountForm
                    currencies={campaign?.currencies ?? []}
                    segments={campaign?.segments ?? []}
                    selectedDiscount={selectedDiscount}
                    setSelectedDiscount={setSelectedDiscount}
                    dayDiscount={dayDiscount}
                    setDayDiscount={setDayDiscount}
                    segmentId={discountTarget}
                    setSegmentId={setDiscountTarget}
                    isDateTimeVisible={false}
                />
            )}

            <div className="w-full flex items-center gap-8 justify-center py-8">
                <DateTimePickerComp startDate={startDate} onchange={setStartDate} />
                <DateTimePickerComp startDate={endDate} onchange={setEndDate} start={false} />
            </div>

            <div className="flex justify-between items-center mt-6 text-sm text-gray-500 pr-16">
                {mode === 'edit' &&
                    <button
                        type="button"
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 cursor-pointer"
                        onClick={() => {
                            setConfirmMessage({
                                message: "Kampanyayı silmek istediğinize emin misiniz? Bağlı olan indirimler de silinecektir.",
                                event: "delete"
                            });
                            setIsConfirmOpen(true);
                        }}
                    >
                        Sil
                    </button>
                }

                <button
                    type="button"
                    className="bg-gray-700 hover:bg-gray-800 transition text-white px-4 py-2 rounded-md cursor-pointer"
                    onClick={validateAndSubmit}
                >
                    {mode === "edit" ? t("adminpanel.pricing.update_campaign.buttonsave") : t("adminpanel.pricing.add_campaign.button.save")}
                </button>
            </div>
        </div>
    );
}
