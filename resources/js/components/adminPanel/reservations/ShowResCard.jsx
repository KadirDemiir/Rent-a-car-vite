import ReservationAction from "./ReservationAction.jsx";
import {useTranslation} from "react-i18next";

export default function ShowResCard({ res, closeModal, isRes}) {
    const {t} = useTranslation();
    res.ekstraHizmetler = [
        { ad: "Bebek Koltuğu", tutar: "800₺" },
        { ad: "Navigasyon", tutar: "200₺" }
    ];

    const handleApprove = () => {
        const confirm = window.confirm(`${res.ad} ${res.soyad} adlı kişinin rezervasyonunu onaylamak istediğinize emin misiniz?`);
        if (confirm) {
            alert(`Rezervasyon onaylandı: ${res.ad} ${res.soyad}`);
            closeModal();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
            <div className="bg-white w-[80%] max-h-[80vh] overflow-y-auto rounded-xl shadow-lg p-6 relative">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl cursor-pointer"
                >
                    &times;
                </button>
                <h2 className="text-xl font-bold mb-6">{t("adminpanel.reservation.reservation_modal.reservation_detail")}</h2>

                <div className="flex flex-col lg:flex-row gap-6">
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 flex-1">
                        <dt className="font-semibold">{t("adminpanel.reservation.reservation_modal.name")}</dt>
                        <dd>{res.ad}</dd>

                        <dt className="font-semibold">{t("adminpanel.reservation.reservation_modal.surname")}</dt>
                        <dd>{res.soyad}</dd>

                        <dt className="font-semibold">{t("adminpanel.reservation.reservation_modal.phone_number")}</dt>
                        <dd>{res.numara}</dd>

                        <dt className="font-semibold">{t("adminpanel.reservation.reservation_modal.pick_up_date")}</dt>
                        <dd>{res.alis}</dd>

                        <dt className="font-semibold">{t("adminpanel.reservation.reservation_modal.pick_up_location")}</dt>
                        <dd>{res.alisYeri}</dd>

                        <dt className="font-semibold">{t("adminpanel.reservation.reservation_modal.return_date")}</dt>
                        <dd>{res.iade}</dd>

                        <dt className="font-semibold">{t("adminpanel.reservation.reservation_modal.return_location")}</dt>
                        <dd>{res.iadeYeri}</dd>

                        <dt className="font-semibold">{t("adminpanel.reservation.reservation_modal.extra_price")}</dt>
                        <dd>{res.ekstra}</dd>

                        <dt className="font-semibold">{t("adminpanel.reservation.reservation_modal.total_price")}</dt>
                        <dd>{res.toplam}</dd>

                        <dt className="font-semibold">{t("adminpanel.reservation.reservation_modal.payment_method")}</dt>
                        <dd>{res.odemeYontemi}</dd>

                        <dt className="font-semibold">{t("adminpanel.reservation.reservation_modal.payment_status")}</dt>
                        <dd className="text-green-600 font-semibold">{res.odemeDurumu}</dd>
                    </dl>

                    {res.ekstraHizmetler?.length > 0 && (
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{t("adminpanel.reservation.reservation_modal.taken_extra_services")}</h3>
                            <dl className="space-y-2">
                                {res.ekstraHizmetler.map((hizmet, index) => (
                                    <div key={index} className="flex items-center gap-x-2">
                                        <dt className="font-medium">{hizmet.ad}</dt>
                                        <dd className="text-gray-700 text-sm">{hizmet.tutar}</dd>
                                    </div>
                                ))}
                            </dl>

                        </div>
                    )}
                </div>

                {isRes &&
                    <ReservationAction closeModal={closeModal} res={res}/>
                }
            </div>
        </div>
    );
}
