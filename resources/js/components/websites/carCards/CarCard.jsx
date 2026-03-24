import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../../providers/CurrencyContext.jsx';
import {
    Fuel,
    Settings2,
    Users,
    Briefcase,
    ShieldCheck,
    ArrowRight,
    TrendingDown
} from 'lucide-react';

export default function CarCard({ car }) {
    const { t, i18n } = useTranslation();
    const { calculateTotal, current } = useCurrency();
    const name = JSON.parse(car.name)?.[i18n.language];
    const coverPhoto = car.photos?.find(c => c.is_cover === 1) || car.photos?.[0];
    const currencySymbol = current?.symbol || '$';


    const rawPrice = calculateTotal(car.daily_price || 0);
    const currentPrice = rawPrice.toFixed(2);

    const rawOldPrice = rawPrice * 1.15;
    const oldPrice = rawOldPrice.toFixed(2);

    const savings = (rawOldPrice - rawPrice).toFixed(0);

    const depositAmount = calculateTotal(car.deposit || 0).toFixed(0);

    return (
        <div className="group relative flex flex-col w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 cursor-pointer">

            <div className="relative w-full aspect-16/10 bg-gray-50 overflow-hidden">
                <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 text-[10px] sm:text-xs font-bold text-gray-700 bg-white/90 backdrop-blur-md rounded-full shadow-sm uppercase tracking-wider border border-gray-200">
                        {t(`segment.${car.segment_id}`) || 'Araç'}
                    </span>
                </div>

                <div className="absolute top-3 right-3 z-10">
                    <span className="px-2 py-1 text-[10px] font-bold text-white bg-emerald-500 rounded-lg shadow-sm flex items-center gap-1">
                        <TrendingDown size={12} />
                    </span>
                </div>

                <div className="w-full h-full flex items-center justify-center p-6 transition-transform duration-500">
                    <img
                        src={`/storage/${coverPhoto?.photo_path}`}
                        alt={name}
                        className="w-full h-full object-contain drop-shadow-md"
                        loading="lazy"
                    />
                </div>
            </div>

            <div className="flex-1 p-5 flex flex-col">

                <div className="mb-4">
                    <h3 className="text-gray-900 text-lg sm:text-xl font-bold leading-tight  transition-colors line-clamp-1">
                        {name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-gray-400 capitalize">
                            {t(`body_type.${car.body_type_id}`)}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between gap-2 mb-6">
                    <FeatureItem icon={Settings2} label={t(`transmission.${car.transmission_id}`)} />
                    <FeatureItem icon={Fuel} label={t(`fuel.${car.fuel_id}`)} />
                    <FeatureItem icon={Users} label={`${car.seat_count}`} />
                    {/*<FeatureItem icon={Briefcase} label={`${car.trunk_capacity}L`} />*/}
                </div>


                <div className="w-full h-px bg-gray-100 mb-4 mt-auto"></div>


                <div className="flex items-end justify-end gap-2">


{/*                    <div className="flex flex-col">


                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs text-gray-400 line-through decoration-gray-300">
                                {currencySymbol}{oldPrice}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                -{currencySymbol}{savings}
                            </span>
                        </div>


                        <div className="flex items-baseline gap-0.5 text-emerald-600 font-extrabold text-2xl leading-none">
                            <span className="text-sm font-semibold align-top mt-1">{currencySymbol}</span>
                            {currentPrice}
                        </div>


                        <span className="text-[10px] text-gray-400 font-medium mt-1">
                            {t('website.car.daily_price') || 'Günlük Kiralama'}
                        </span>
                    </div>*/}


                    <button className="flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all hover:bg-emerald-600 shadow-lg hover:shadow-emerald-600/20 active:scale-95 whitespace-nowrap">
                        {t('website.searchReservation.rent_now') || 'Kirala'}
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}


function FeatureItem({ icon: Icon, label }) {
    return (
        <div className="flex items-center gap-0 group/item overflow-hidden">
            <div className="shrink-0 p-1.5 bg-gray-50 rounded-lg text-gray-400 group-hover/item:text-emerald-500 group-hover/item:bg-emerald-50 transition-colors">
                <Icon size={16} strokeWidth={2} />
            </div>
            <span className="text-xs sm:text-sm text-gray-600 font-medium truncate capitalize">
                {label}
            </span>
        </div>
    );
}
