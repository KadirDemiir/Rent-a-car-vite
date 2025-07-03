import { useState } from "react";
import CarPhoto from "./CarPhoto.jsx";

export default function CarPhotoUpload({ closeModal }) {
    const [photos, setPhotos] = useState([]);
    const [coverIndex, setCoverIndex] = useState(null);

    const handleChange = (next, cover) => {
        setPhotos(next);
        setCoverIndex(cover);
    };

    const handleSave = () => {
        const files = photos.map((p) => p.file);
        const cover = coverIndex !== null ? photos[coverIndex].file : null;

        console.log("Seçilenler:", files);
        console.log("Kapak:", cover);
        closeModal();
    };

    return (
        <div className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6">
            <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-black"
            >
                &times;
            </button>

            <div className="">
                <CarPhoto maxFiles={4} onChange={handleChange} />
            </div>

            <div className="text-right pt-4">
                <button
                    onClick={handleSave}
                    disabled={photos.length === 0}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    Kaydet
                </button>
            </div>
        </div>
    );
}
