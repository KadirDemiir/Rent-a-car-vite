import {useRef, useCallback, useMemo} from 'react';
import NavBar from '../components/websites/Navbar.jsx';
import SearchReservationForm from '../components/websites/SearchReservationForm.jsx';
import {useTranslation} from "react-i18next";
import CarCard from "../components/websites/carCards/CarCard.jsx";
import {ChevronLeft, ChevronRight, MapPin, ArrowRight} from 'lucide-react';
import {Link} from "@inertiajs/react";
import MetaData from "../components/websites/MetaData.jsx";

const BG_IMAGE = "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop";

const FEATURES = [
    {title: "7/24 Canlı Destek", desc: "Her an yanınızdayız.", icon: "🎧"},
    {title: "Yeni Model Filo", desc: "Daima temiz ve bakımlı araçlar.", icon: "✨"},
    {title: "Adrese Teslim", desc: "Aracınız kapınıza gelsin.", icon: "📍"},
    {title: "Gizli Ücret Yok", desc: "Sürpriz ödemelerle karşılaşmayın.", icon: "🛡️"},
];

export default function Home({locations, carGroups}) {
    const {t, i18n} = useTranslation();
    const sliderRef = useRef(null);

    const scroll = useCallback((direction) => {
        if (sliderRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            sliderRef.current.scrollBy({left: scrollAmount, behavior: 'smooth'});
        }
    }, []);

    const getName = useCallback((loc) => {
        try {
            const parsed = JSON.parse(loc.name);
            return parsed[i18n.language] || parsed.en || loc.name;
        } catch (e) {
            return loc.name;
        }
    }, [i18n.language]);

    const renderedLocations = useMemo(() => locations?.slice(0, 4) || [], [locations]);

    return (
        <>
            <MetaData/>
            <div className="w-full bg-gray-50 min-h-screen flex flex-col font-sans">
                <div className="relative w-full h-dvh flex flex-col shrink-0">
                    <div className="absolute inset-0 z-0">
                        <img
                            src={BG_IMAGE}
                            alt="Araç Kiralama"
                            className="w-full h-full object-cover"
                            fetchpriority="high"
                        />
                        <div className="absolute inset-0 bg-black/60 md:bg-black/50"></div>
                    </div>

                    <div className="relative z-10 w-full h-full flex flex-col">
                        <div className="shrink-0">
                            <NavBar/>
                        </div>

                        <div
                            className="grow flex flex-col items-center justify-center md:justify-center px-4 pb-6 gap-2 md:gap-8">
                            <div className="text-center w-full max-w-4xl mx-auto shrink-0">
                                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-md">
                                    Yolculuğun <span className="text-red-500">Ayrıcalıklı</span> Hali
                                </h1>
                                <p className="hidden md:block mt-4 text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto drop-shadow-md">
                                    Konforlu, güvenli ve ekonomik araç kiralama deneyimi.
                                </p>
                            </div>

                            <div className="w-full max-w-6xl mx-auto shrink-0 min-h-[180px]">
                                <div className="origin-top">
                                    <SearchReservationForm locations={locations} home={true}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-16 md:py-24 bg-white relative z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-base text-red-600 font-bold tracking-wide uppercase">Ayrıcalıklar</h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                Neden Bizi Seçmelisiniz?
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {FEATURES.map((feature, index) => (
                                <div key={index}
                                     className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 group text-center md:text-left">
                                    <div
                                        className="text-4xl mb-4 bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-sm mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="py-16 bg-white relative z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Popüler Araçlar</h2>
                                <p className="text-gray-500 mt-2">En çok tercih edilen modellerimizi inceleyin.</p>
                            </div>

                            <div className="hidden md:flex items-center gap-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => scroll('left')}
                                        className="p-2 rounded-full border border-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-95"
                                        aria-label="Önceki araçlar"
                                    >
                                        <ChevronLeft size={20}/>
                                    </button>
                                    <button
                                        onClick={() => scroll('right')}
                                        className="p-2 rounded-full border border-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-95"
                                        aria-label="Sonraki araçlar"
                                    >
                                        <ChevronRight size={20}/>
                                    </button>
                                </div>
                                <div className="h-6 w-px bg-gray-300 mx-2"></div>
                                <Link href={`/${i18n.language}/${t('address.cars')}`}
                                      className="text-red-600 font-semibold hover:text-red-700 transition-colors whitespace-nowrap">
                                    Tüm Filoyu Gör →
                                </Link>
                            </div>
                        </div>

                        <div className="relative group">
                            <button
                                onClick={() => scroll('left')}
                                className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 backdrop-blur text-gray-800 rounded-full shadow-lg border border-gray-100 hover:bg-white -ml-3"
                                aria-label="Önceki"
                            >
                                <ChevronLeft size={24}/>
                            </button>

                            <div
                                ref={sliderRef}
                                className="flex gap-6 overflow-x-auto pb-10 snap-x scroll-none whitespace-nowrap scrollbar-hide"
                            >
                                {carGroups.map((car, index) => (
                                    <div
                                        key={car.id || index}
                                        className="
                                        shrink-0 snap-center h-full
                                        w-[85%]
                                        md:w-[calc(50%-12px)]
                                        lg:w-[calc(33.333%-16px)]
                                    "
                                    >
                                        <CarCard car={car}/>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => scroll('right')}
                                className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 backdrop-blur text-gray-800 rounded-full shadow-lg border border-gray-100 hover:bg-white -mr-3"
                                aria-label="Sonraki"
                            >
                                <ChevronRight size={24}/>
                            </button>
                        </div>

                        <div className="mt-4 text-center md:hidden">
                            <a href="#"
                               className="inline-block px-6 py-3 border border-red-600 text-red-600 font-semibold rounded-lg">
                                Tüm Filoyu Gör
                            </a>
                        </div>
                    </div>
                </div>

                <div className="py-16 bg-white relative z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Popüler Lokasyonlar</h2>
                                <p className="text-gray-500 mt-2">Kiralama yapabileceğiniz en popüler noktalar.</p>
                            </div>
                            <a href="#"
                               className="hidden md:flex items-center gap-1 text-red-600 font-semibold hover:text-red-700 transition-colors">
                                Tümünü Gör <ArrowRight size={18}/>
                            </a>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {renderedLocations.map((loc, index) => (
                                <div key={loc.id || index}
                                     className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-md">
                                    <img
                                        src={`/storage/${loc.photo_path}`}
                                        alt={getName(loc)}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div
                                        className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <div className="flex items-center gap-2 mb-1">
                                            <MapPin size={18} className="text-red-500"/>
                                            <span className="font-bold text-lg line-clamp-1">{getName(loc)}</span>
                                        </div>
                                        <span
                                            className="text-sm text-gray-300 pl-6 group-hover:text-white transition-colors flex items-center gap-1">
                                        Detayları Gör <ArrowRight size={14}
                                                                  className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"/>
                                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-center md:hidden">
                            <a href="#"
                               className="inline-block px-6 py-3 border border-red-600 text-red-600 font-semibold rounded-lg">
                                Tüm Lokasyonları Gör
                            </a>
                        </div>
                    </div>
                </div>

                <div className="py-20 bg-white relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="w-full lg:w-1/2 relative">
                                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
                                        alt="Ofisimiz ve Ekibimiz"
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div
                                    className="absolute -bottom-6 -right-6 w-48 h-48 bg-gray-100 rounded-3xl -z-10"></div>
                                <div className="absolute -top-6 -left-6 w-48 h-48 bg-red-50 rounded-3xl -z-10"></div>

                                <div
                                    className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 hidden md:block">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-red-600 text-white p-3 rounded-xl">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-gray-900">10+</p>
                                            <p className="text-sm text-gray-600 font-medium">Yıllık Tecrübe</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full lg:w-1/2">
                                <h2 className="text-base text-red-600 font-bold tracking-wide uppercase mb-2">Biz
                                    Kimiz?</h2>
                                <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                                    Yolculuğunuzun <br/>
                                    <span
                                        className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-red-800">Güvenilir Partneri</span>
                                </h3>

                                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                    Sektördeki 10 yılı aşkın tecrübemizle, araç kiralama deneyimini sadece bir "ulaşım"
                                    aracı olmaktan çıkarıp, konfor ve güvenle harmanlanmış bir hizmete dönüştürüyoruz.
                                </p>

                                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                    Geniş araç filomuz, 7/24 destek hattımız ve şeffaf fiyat politikamızla, hem bireysel
                                    hem de kurumsal müşterilerimize kusursuz bir yolculuk vaat ediyoruz. Sizin için
                                    sadece en iyisini sunuyoruz.
                                </p>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                        <span className="font-semibold text-gray-800">Müşteri Odaklılık</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                        <span className="font-semibold text-gray-800">Sürdürülebilirlik</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                        <span className="font-semibold text-gray-800">Güvenilirlik</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                        <span className="font-semibold text-gray-800">Yenilikçilik</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-20 bg-gray-900 text-white relative z-20">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-12">3 Adımda Kolay Kiralama</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            <div
                                className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-700/50 -z-10"></div>

                            <div className="relative">
                                <div
                                    className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center text-3xl mx-auto border-4 border-gray-900 mb-6 shadow-lg z-10">
                                    📅
                                </div>
                                <h4 className="text-xl font-bold mb-2">Tarih Seç</h4>
                                <p className="text-gray-400">Alış ve dönüş tarihlerinizi belirleyin.</p>
                            </div>
                            <div className="relative">
                                <div
                                    className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center text-3xl mx-auto border-4 border-gray-900 mb-6 shadow-lg z-10">
                                    🚘
                                </div>
                                <h4 className="text-xl font-bold mb-2">Aracını Beğen</h4>
                                <p className="text-gray-400">İhtiyacınıza en uygun aracı seçin.</p>
                            </div>
                            <div className="relative">
                                <div
                                    className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-3xl mx-auto border-4 border-gray-900 mb-6 shadow-lg z-10">
                                    🔑
                                </div>
                                <h4 className="text-xl font-bold mb-2">Yola Çık</h4>
                                <p className="text-gray-400">Aracınızı teslim alın ve keyfini sürün.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="bg-white border-t border-gray-200 py-8">
                    <div
                        className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">© 2026 Tüm Hakları Saklıdır.</p>
                        <div className="flex gap-4">
                            <span className="w-8 h-5 bg-gray-200 rounded"></span>
                            <span className="w-8 h-5 bg-gray-200 rounded"></span>
                            <span className="w-8 h-5 bg-gray-200 rounded"></span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
