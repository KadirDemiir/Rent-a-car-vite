import {useRef, useCallback} from 'react';
import NavBar from '../components/websites/Navbar.jsx';
import SearchReservationForm from '../components/websites/SearchReservationForm.jsx';
import {useTranslation} from "react-i18next";
import CarCard from "../components/websites/carCards/CarCard.jsx";
import {ChevronLeft, ChevronRight, MapPin} from 'lucide-react';
import {Link} from "@inertiajs/react";
import MetaData from "../components/websites/MetaData.jsx";

const BG_IMAGE = "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop";

export default function Home({locations, carGroups, sections}) {
    const {t, i18n} = useTranslation();
    const sliderRef = useRef(null);

    const scroll = useCallback((direction) => {
        if (sliderRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            sliderRef.current.scrollBy({left: scrollAmount, behavior: 'smooth'});
        }
    }, []);

    const getTranslatedText = useCallback((data) => {
        if (!data) return "";
        try {
            const parsed = typeof data === 'string' ? JSON.parse(data) : data;
            return parsed[i18n.language] || parsed.tr || Object.values(parsed)[0] || "";
        } catch (e) {
            return data;
        }
    }, [i18n.language]);

    const renderSection = (section) => {
        if (!section.is_active) return null;

        const title = getTranslatedText(section.title);
        const content = getTranslatedText(section.content);
        const desc = section.description?.toLowerCase() || "";

        if (section.is_default && desc === "cars") {
            return (
                <section key={section.id} className="py-16 md:py-24 bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">{title}</h2>
                                <p className="text-gray-500 mt-2 text-lg">{content}</p>
                            </div>
                            <div className="hidden md:flex items-center gap-4">
                                <div className="flex gap-2">
                                    <button onClick={() => scroll('left')}
                                            className="p-2 rounded-full border border-gray-300 hover:bg-red-600 hover:text-white transition-all">
                                        <ChevronLeft size={20}/></button>
                                    <button onClick={() => scroll('right')}
                                            className="p-2 rounded-full border border-gray-300 hover:bg-red-600 hover:text-white transition-all">
                                        <ChevronRight size={20}/></button>
                                </div>
                                <Link href={`/${i18n.language}/${t('address.cars')}`}
                                      className="text-red-600 font-bold hover:underline ml-4">Tüm Filo →</Link>
                            </div>
                        </div>
                        <div ref={sliderRef} className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
                            {carGroups.map((car, idx) => (
                                <div key={car.id || idx}
                                     className="shrink-0 snap-center w-[85%] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                                    <CarCard car={car}/>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            );
        }

        if (section.is_default && desc === "locations" ) {
            return (
                <section key={section.id} className="py-16 md:py-24 bg-gray-50 border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">{title}</h2>
                                <p className="text-gray-500 mt-2 text-lg">{content}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {locations?.slice(0, 4).map((loc, idx) => (
                                <div key={loc.id || idx}
                                     className="group relative h-72 rounded-3xl overflow-hidden shadow-lg">
                                    <img src={`/storage/${loc.photo_path}`} alt={getTranslatedText(loc.name)}
                                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                                    <div
                                        className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={20} className="text-red-500"/>
                                            <span className="font-bold text-xl">{getTranslatedText(loc.name)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            );
        }

        if(!section.is_default)
        {
            return (
                <section key={section.id} className="py-16 md:py-24 bg-white border-b border-gray-100 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">{title}</h2>
                        <div
                            className="campaign-content w-full"
                            dangerouslySetInnerHTML={{__html: content}}
                        />
                    </div>
                </section>
            );
        }
    };

    return (
        <>
            <MetaData/>
            <div className="w-full flex flex-col min-h-screen">
                {/* DEĞİŞİKLİK 1: h-dvh ve overflow-hidden kaldırıldı, sadece min-h-dvh bırakıldı */}
                <header className="relative w-full min-h-dvh flex flex-col shrink-0">
                    <div className="absolute inset-0 z-0 h-full w-full">
                        <img
                            src={BG_IMAGE}
                            alt="Araç Kiralama"
                            // DEĞİŞİKLİK 2: object-center yapıldı ki her durumda ortalansın
                            className="w-full h-full object-cover object-center"
                            fetchpriority="high"
                        />
                        <div className="absolute inset-0 bg-black/60 md:bg-black/50"></div>
                    </div>

                    {/* DEĞİŞİKLİK 3: h-full kaldırıldı, grow eklendi */}
                    <div className="relative z-10 w-full grow flex flex-col">
                        <div className="shrink-0">
                            <NavBar/>
                        </div>

                        {/* DEĞİŞİKLİK 4: overflow-hidden kaldırıldı, padding artırıldı (py-16 md:py-24) */}
                        <div
                            className="grow flex flex-col items-center justify-center px-4 py-16 md:py-24 gap-2 md:gap-8">
                            <div className="text-center w-full max-w-4xl mx-auto shrink-0">
                                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-md">
                                    Yolculuğun <span className="text-red-500">Ayrıcalıklı</span> Hali
                                </h1>
                                <p className="hidden md:block mt-4 text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto drop-shadow-md">
                                    Konforlu, güvenli ve ekonomik araç kiralama deneyimi.
                                </p>
                            </div>

                            <div className="w-full max-w-6xl mx-auto shrink-0">
                                <div className="origin-top">
                                    <SearchReservationForm locations={locations} home={true}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex flex-col w-full">
                    {sections?.map(section => renderSection(section))}
                </main>

                <footer className="bg-gray-900 text-white py-12">
                    <div
                        className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-gray-400">© 2026 Tüm Hakları Saklıdır.</p>
                        <div className="flex gap-6">
                            <Link href="#" className="hover:text-red-500 transition-colors">Hakkımızda</Link>
                            <Link href="#" className="hover:text-red-500 transition-colors">İletişim</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
