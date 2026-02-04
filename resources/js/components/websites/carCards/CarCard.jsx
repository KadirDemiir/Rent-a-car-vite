import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../../providers/CurrencyContext.jsx';
import { 
    Fuel, 
    Settings2, 
    Users, 
    Briefcase, 
    ShieldCheck, 
    ArrowRight 
} from 'lucide-react';

export default function CarCard({ car }) {
    const { t } = useTranslation();
    const { calculateTotal, current } = useCurrency();

    // Yardımcı: İlk harfi büyütme (CSS capitalize daha performanslıdır ama JS tarafında gerekirse)
    const formatText = (key, params = {}) => {
        const text = t(key, params);
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    // Kapak fotoğrafını bul
    const coverPhoto = car.photos.find(c => c.is_cover === 1) || car.photos[0];

    // Depozito Hesabı
    const depositAmount = calculateTotal(car.deposit).toFixed(2);
    const currencySymbol = current?.symbol || '$';

    return (
        <div className="group relative flex flex-col w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            
            <div className="relative w-full aspect-[16/10] bg-gray-50 overflow-hidden">
                <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 text-xs font-bold text-white bg-gray-700/90 backdrop-blur-md rounded-full shadow-sm uppercase tracking-wider">
                        {t(`segment.${car.segment_id}`)}
                    </span>
                </div>

                <div className="w-full h-full flex items-center justify-center p-6 transition-transform duration-500 group-hover:scale-110">
                    <img 
                        src={`/storage/${coverPhoto?.photo_path}`} 
                        alt={`${t(car.brand_key.key)} ${t(car.model_key.key)}`}
                        className="w-full h-full object-contain drop-shadow-lg"
                        loading="lazy"
                    />
                </div>
            </div>

            <div className="flex-1 p-5 flex flex-col">
                {/* Marka & Model */}
                <div className="mb-4">
                    <h3 className="text-gray-900 text-xl font-bold leading-tight group-hover:text-gray-700 transition-colors">
                        {t(car.brand_key.key)} <span className="font-normal text-gray-600">{t(car.model_key.key)}</span>
                    </h3>
                    <p className="text-sm text-gray-400 mt-1 capitalize">
                        {t(`body_type.${car.body_type_id}`)}
                    </p>
                </div>

                {/* Özellikler Grid Yapısı */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
                    {/* Vites */}
                    <FeatureItem icon={Settings2} label={t(`transmission.${car.transmission_id}`)} />
                    {/* Yakıt */}
                    <FeatureItem icon={Fuel} label={t(`fuel.${car.fuel_id}`)} />
                    {/* Koltuk */}
                    <FeatureItem icon={Users} label={`${car.seat_count} ${t('website.car.seat_count')}`} />
                    {/* Bagaj (Dynamic Translation Key yapısını basitleştirdim) */}
                    <FeatureItem icon={Briefcase} label={`${car.trunk_capacity}L`} />
                </div>

                {/* Ayırıcı Çizgi */}
                <div className="w-full h-px bg-gray-100 mb-4"></div>

                {/* --- ALT KISIM: FİYAT & BUTON --- */}
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                            {t('website.car.requirements.deposit')}
                        </span>
                        <div className="flex items-center gap-1 text-gray-900 font-bold text-lg">
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                            <span>{currencySymbol}{Number(depositAmount).toFixed(2)}</span>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-gray-700 hover:gap-3 shadow-md hover:shadow-gray-500/30">
                        {t('website.searchReservation.rent_now') || 'Kirala'}
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Küçük bir alt bileşen (Kod tekrarını önlemek için)
function FeatureItem({ icon: Icon, label }) {
    return (
        <div className="flex items-center gap-2 text-gray-600 group/item">
            <div className="p-1.5 bg-gray-50 rounded-lg text-gray-400 group-hover/item:text-blue-500 group-hover/item:bg-blue-50 transition-colors">
                <Icon size={16} strokeWidth={2} />
            </div>
            <span className="text-xs sm:text-sm font-medium truncate capitalize">
                {label}
            </span>
        </div>
    );
}