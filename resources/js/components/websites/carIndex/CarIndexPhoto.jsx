import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarIndexPhotos({photos, alt}){
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        startInterval();
        return () => clearInterval(intervalRef.current);
    }, []);

    const startInterval = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
        }, 4000);
    };

    const nextPhoto = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
        startInterval();
    };

    const prevPhoto = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
        startInterval();
    };

    const goToPhoto = (index) => {
        setCurrentIndex(index);
        startInterval();
    };

    if (!photos || photos.length === 0) {
        return <div className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>;
    }

    return(
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            {/* DEĞİŞİKLİKLER BURADA YAPILDI:
                1. bg-gray-100 yerine bg-gray-50 (daha modern, açık gri bir zemin).
                2. flex items-center justify-center: İçindeki görseli dikey ve yatay olarak ortalar.
                3. p-6 sm:p-8: Görselin etrafına belirgin bir iç boşluk bırakır. Bu sayede görsel %100 yer kaplamaz, "içeride" durur.
            */}
            <div className="relative aspect-[16/9] bg-gray-50 flex items-center justify-center p-6 sm:p-8 group">
                <img
                    src={`/storage/${photos[currentIndex].photo_path}`}
                    alt={alt}
                    className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
                
                <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>

                <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
            </div>
            
            <div className="flex justify-center gap-2 p-4 bg-white">
                {photos.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToPhoto(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentIndex 
                                ? 'bg-gray-700 w-6' 
                                : 'bg-gray-300 w-2 hover:bg-gray-400'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}