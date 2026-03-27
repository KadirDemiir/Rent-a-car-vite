import axios from "axios";
import { useTranslation } from "react-i18next";

export default function ReservationAction({updateData, closeModal, res }) {
    const { i18n } = useTranslation();
    const handleApprove = async () => {
        const confirm = window.confirm(`${res.name} ${res.surname} adlı kişinin rezervasyonunu onaylamak istediğinize emin misiniz?`);
        if (confirm) {
            try {
                const response = await axios.post(`/reservation/approve/${res.id}`, {
                    lang: i18n.language    
                });
                updateData();
                alert(`Rezervasyon onaylandı: ${res.name} ${res.surname}`);
                console.log(response.data.success);
                closeModal();

            } catch (error) {
                if (error.response?.status === 422) {
                    alert(error.response.data.error);
                } else if (error.response?.status === 405) {
                    console.error("Metot hatası: Laravel rotası PATCH mi POST mu kontrol et!");
                } else {
                    console.error("Bir hata oluştu:", error.message);
                }
            }
        }
    };

    const handleReject = async () => {
        try {
            const response = await axios.post(`/reservation/reject/${res.id}`, {lang: i18n.language});
            updateData();
            console.log(response.data.success);
            closeModal();

        } catch (error) {
            if (error.response?.status === 422) {
                alert(error.response.data.error);
            } else if (error.response?.status === 405) {
                console.error("Metot hatası: Laravel rotası PATCH mi POST mu kontrol et!");
            } else {
                console.error("Bir hata oluştu:", error.message);
            }
        }
    };

    return (
        <div className="flex items-center justify-end gap-3">
            <button onClick={() => handleReject()} className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 cursor-pointer">
                İptal Et
            </button>

            <button onClick={() => handleApprove()} className="group flex items-center gap-2 px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium text-sm shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 transition-all duration-200 active:scale-95 cursor-pointer">
                Onayla
                <svg className="w-4 h-4 text-green-100 group-hover:text-green-50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </button>
        </div>
    );
}
