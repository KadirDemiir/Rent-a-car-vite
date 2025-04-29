import { useEffect, useState, useRef } from "react";

export default function CarIndexPhotos(){
    
    const photos = ["volvo-xc90.png", "volvo-xc90-2.png"];
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
        }, 3000);
    };

    const nextPhoto = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
        startInterval();
    };

    const prevPhoto = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
        startInterval();
    };

    return(
        <div className="h-80 flex items-center justify-center relative bg-white rounded-2xl border-1 border-blue-600">
            <img
            src={`/storage/cars/${photos[currentIndex]}`}
            alt="Car Photo"
            className="h-60 rounded-lg object-cover"
            />
            <button
                onClick={prevPhoto}
                className="absolute left-4 text-blue-600 text-7xl  cursor-pointer"
            >
                ‹
            </button>

            <button
                onClick={nextPhoto}
                className="absolute flex items-center justify-center right-4 text-blue-600 text-7xl  cursor-pointer"
            >
                ›
            </button>
        </div>
    );
}