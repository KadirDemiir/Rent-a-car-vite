import ReservationAction from "./ReservationAction.jsx";
import { useTranslation } from "react-i18next";
import {useCurrency} from "../../../providers/CurrencyContext.jsx";
import {useState} from "react";

const DetailItem = ({ label, value, className = "" }) => (
    <div className={`flex flex-col py-2 border-b border-gray-100 last:border-0 ${className}`}>
        <dt className="text-xs font-medium text-gray-500 local-uppercase tracking-wider mb-1">{label}</dt>
        <dd className="text-sm font-semibold text-gray-900 break-words">{value || "-"}</dd>
    </div>
);

export default function ShowResCard({ res, updateData, closeModal, curr, past }) {
    console.log(res);
    const { t, i18n } = useTranslation();
    const {calculateTotal, current} = useCurrency();
    const formatDate = (date) => {
        return new Date(date).toLocaleString("tr-TR", {
            day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
        }).replace(/\./g, " / ");
    };

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        if (s === 'paid') return 'bg-green-100 text-green-700 border-green-200';
        if (s === 'failed') return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 transition-all">
            <div className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col relative">

                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {t("adminpanel.reservation.reservation_modal.reservation_detail")}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">ID: #{res.id}</p>
                    </div>
                    <button
                        onClick={() => closeModal()}
                        className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 bg-gray-50/50 grow">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-center gap-2 mb-4 pb-2 border-b border-gray-100">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </div>
                                {/*<h3 className="font-bold text-gray-800">{t("adminpanel.reservation.reservation_modal.name")}</h3>*/}
                            </div>
                            <dl className="flex flex-col gap-1">
                                <DetailItem label={t("adminpanel.reservation.reservation_modal.name")} value={res.name} />
                                <DetailItem label={t("adminpanel.reservation.reservation_modal.surname")} value={res.surname} />
                                <DetailItem label={t("adminpanel.reservation.reservation_modal.email")} value={res.email} />
                                <DetailItem label={t("adminpanel.reservation.reservation_modal.phone_number")} value={res.phone_number} />
                                <DetailItem label={t("adminpanel.reservation.reservation_modal.address")} value={res.address} className={`max-h-50 overflow-auto scroll-y-auto`}/>
                            </dl>
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-center items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                {/*<h3 className="font-bold text-gray-800">Seyahat Detayları</h3>*/}
                            </div>
                            <dl className="flex flex-col gap-1">
                                <DetailItem label={t("adminpanel.reservation.reservation_modal.pick_up_date")} value={formatDate(res.pickup_datetime)} />
                                <DetailItem label={t("adminpanel.reservation.reservation_modal.pick_up_location")} value={res.pickup_location.name} />
                                <DetailItem label={t("adminpanel.reservation.reservation_modal.return_date")} value={formatDate(res.return_datetime)} />
                                <DetailItem label={t("adminpanel.reservation.reservation_modal.return_location")} value={res.return_location.name} />
                                <DetailItem label={t("adminpanel.reservation.reservation_modal.notes", "Notes")} value={res.notes} className="bg-yellow-50/50 p-2 rounded mt-2 border-none h-50 overflow-auto scroll-y-auto" />
                            </dl>
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                            <div className="flex justify-center items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                {/*<h3 className="font-bold text-gray-800">Ödeme Bilgileri</h3>*/}
                            </div>
                            <dl className="flex flex-col gap-1 grow">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <dt className="text-xs font-medium text-gray-500 uppercase">{t("adminpanel.reservation.reservation_modal.payment_status")}</dt>
                                    <dd className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyle(res.payment_status)}`}>
                                        {res.payment_status}
                                    </dd>
                                </div>
                                <DetailItem label={t("adminpanel.reservation.reservation_modal.payment_method")} value={res.payment_type} />
                                <DetailItem label={t("adminpanel.reservation.reservation_modal.extra_price")} value={res.extras_total} />
                                <DetailItem label={t("adminpanel.reservation.reservation_modal.drop_price", "Drop Price")} value={res.drop_price} />
                                <DetailItem label={t("adminpanel.reservation.reservation_modal.day*daily_price", "Day x fDaily Price")} value={`${res.rental_days} x ${calculateTotal(res.daily_price)} ${current.symbol}`} />
                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <dt className="text-xs font-medium text-gray-500 uppercase mb-1">{t("adminpanel.reservation.reservation_modal.total_price")}</dt>
                                    <dd className="text-2xl font-bold text-gray-900">{`${calculateTotal(res.total_price)} ${current.symbol}`}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                            <div className="flex justify-center items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                                    </svg>
                                </div>
                            </div>
                            <dl className="flex flex-col gap-1 grow">
                                {res.extras?.map((e, index) => {
                                    const names = JSON.parse(e.extra.name);
                                    return (
                                        <DetailItem key={e.id || index} label={names[i18n.language] || names['tr']} value={`${e.quantity} x ${calculateTotal(e.price)} ${current.symbol}`}/>
                                    );
                                })}
                            </dl>
                        </div>
                    </div>
                </div>
                {curr && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                        <ReservationAction closeModal={closeModal} updateData={updateData} res={res} />
                    </div>
                )}x
            </div>
        </div>
    );
}
