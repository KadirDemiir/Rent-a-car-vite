import ReservationAction from "./ReservationAction.jsx";
import { useTranslation } from "react-i18next";

const DetailItem = ({ label, value, className = "" }) => (
    <div className={`flex flex-col py-2 border-b border-gray-100 last:border-0 ${className}`}>
        <dt className="text-xs font-medium text-gray-500 local-uppercase tracking-wider mb-1">{label}</dt>
        <dd className="text-sm font-semibold text-gray-900 wrap-break-words">{value || "-"}</dd>
    </div>
);

export default function ShowResCard({ res, updateData, closeModal, curr, past }) {
    console.log(res);
    const { t, i18n } = useTranslation();
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

    const discountedDailyPrice = () => {
        if (!res?.daily_price) return 0;
        const price = Number(res.daily_price);
        const amount = Number(res.discount_amount) || 0;
        if (res.discount_type === "fixed")
            return Math.max(0, price - amount);
        if (res.discount_type === "percentage")
            return price * (1 - amount);
        return price;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 transition-all">
            <div className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col relative">

                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {t("adminpanel.reservation.reservation_modal.reservation_detail")}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">ID: #{res.reference_code}</p>
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
                                <div className="p-2 bg-gray-50 text-gray-700 rounded-lg">
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

                        {/* CarGroup Info Card */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-center items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m10 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                    </svg>
                                </div>
                            </div>

                            {res.carGroup?.photos?.length > 0 && (
                                <div className="mb-4 rounded-lg overflow-hidden h-32 w-full bg-gray-100">
                                    <img
                                        src={`/storage/${res.carGroup?.photos.find(p => p.is_cover)?.photo_path || res.carGroup?.photos[0]?.photo_path}`}
                                        alt="CarGroup"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <dl className="flex flex-col gap-1">
                                {(() => {
                                    const getTrans = (val) => {
                                        if (!val) return '-';
                                        if (typeof val === 'object') return val[i18n.language] || val['en'] || Object.values(val)[0] || '-';
                                        try {
                                            const parsed = JSON.parse(val);
                                            return parsed[i18n.language] || parsed['en'] || Object.values(parsed)[0] || '-';
                                        } catch (e) {
                                            return val;
                                        }
                                    };
                                    return (
                                        <>
                                           {/* <DetailItem label="ID" value={`#${res.id || '-'}`} />*/}
                                            <DetailItem label={t("adminpanel.car_group")} value={getTrans(res.car_group.name)} />
                                            {res.assigned_vehicle &&
                                                <>
                                                    <span className={`font-extrabold`}>Assigned Car</span><hr className={`border-gray-200`}/>
                                                    <DetailItem label={t("adminpanel.car.car_modify.edit_car_information.brand")} value={`${t(res.assigned_vehicle?.brandKey?.key)} ${t(res.assigned_vehicle?.modelKey?.key)} ${res.assigned_vehicle?.exact_year}`} />
                                                    <DetailItem label={t("adminpanel.car.list.license_plate") || "Plaka"} value={res.assigned_vehicle?.plate_number ?? '—'} />
                                                    {/*<DetailItem label={t("adminpanel.car.car_modify.edit_car_information.model")} value={t(res.carGroup?.modelKey?.key)} />*/}
                                                    {/*<DetailItem label={t("adminpanel.car.car_modify.edit_car_information.year") || "Yıl"} value={res.assignedVehicle?.exact_year ?? '—'} />*/}
                                                </>
                                            }
                                            {/*<DetailItem label={t("adminpanel.car.car_modify.edit_car_information.fuel_type") || "Yakıt"} value={t(`fuel.${res.car_group?.fuel_id}`)} />*/}
                                        </>
                                    );
                                })()}
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
                                <DetailItem label={t("adminpanel.reservation.reservation_modal.extra_price")} value={`${(res.extras_total * res.exchange_rate).toFixed(2)} ${res.currency.symbol}`} />
                                <DetailItem label={t("adminpanel.reservation.reservation_modal.payment_method")} value={res.payment_type} />
                                <DetailItem label={t("adminpanel.reservation.reservation_modal.drop_price", "Drop Price")} value={`${(res.drop_price * res.exchange_rate).toFixed(2)} ${res.currency.symbol}`} />
                                <DetailItem label={t("adminpanel.reservation.reservation_modal.day*daily_price", "Day x Daily Price")} value={`${res.rental_days} x ${((discountedDailyPrice() ) * res.exchange_rate)} ${res.currency.symbol}`} />
                                {res?.online_discount_amount > 0 && <DetailItem label={t("adminpanel.reservation.reservation_modal.online_discount_amount", "Online Discount Amount")} value={`% ${res.online_discount_amount * 100}`} />}
                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <dt className="text-xs font-medium text-gray-500 uppercase mb-1">{t("adminpanel.reservation.reservation_modal.total_price")}</dt>
                                    <dd className="text-2xl font-bold text-gray-900">{`${(res.total_price * res.exchange_rate).toFixed(2)} ${res.currency.symbol}`}</dd>
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
                                        <DetailItem key={e.id || index} label={names[i18n.language] || names['tr']} value={`${e.quantity} x ${(e.price * res.exchange_rate).toFixed(2)} ${res.currency.symbol}`}/>
                                    );
                                })}
                            </dl>
                        </div>
                    </div>
                </div>
                {res.status === 'pending' && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                        <ReservationAction closeModal={closeModal} updateData={updateData} res={res} />
                    </div>
                )}
            </div>
        </div>
    );
}
