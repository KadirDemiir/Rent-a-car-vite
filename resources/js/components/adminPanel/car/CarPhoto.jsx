import { useState, useRef } from "react";

export default function CarPhoto({defPhotos, maxFiles = 4, onChange }) {
    console.log("defPhotos:", defPhotos);
    const [photos, setPhotos] = useState(() =>
        (defPhotos || []).map((p) => ({
            file: null,
            url: p.url ? p.url : `/storage/${p.photo_path}`,
        }))
    );
    const [coverIndex, setCoverIndex] = useState(() =>
        (defPhotos || []).findIndex((p) => p.is_cover)
    );
    const fileInputRef = useRef();

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const available = maxFiles - photos.length;

        if (files.length > available) {
            alert(`En fazla ${available} fotoğraf seçebilirsiniz.`);
            e.target.value = "";
            return;
        }

        const added = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        const next = [...photos, ...added];
        setPhotos(next);
        e.target.value = "";
        onChange?.(next, coverIndex);
    };


    const handleDelete = (index) => {
        setPhotos((prev) => {
            URL.revokeObjectURL(prev[index].url);
            const next = prev.filter((_, i) => i !== index);
            onChange?.(next, coverIndex === index ? null : coverIndex > index ? coverIndex - 1 : coverIndex);
            return next;
        });

        setCoverIndex((prev) => {
            if (prev === index) return null;
            if (prev > index) return prev - 1;
            return prev;
        });
    };


    const selectCover = (i) => {
        setCoverIndex(i);
        onChange?.(photos, i);
    };


    const triggerPicker = () => {
        if (photos.length < maxFiles) fileInputRef.current.click();
    };

    return (
        <div className="space-y-3 bg-white">
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={photos.length >= maxFiles}
            />

            <div
                onClick={triggerPicker}
                className={`flex items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer text-sm ${
                    photos.length >= maxFiles
                        ? "border-gray-300 text-gray-400 bg-gray-100"
                        : "border-gray-400 text-gray-700 hover:bg-gray-50"
                }`}
            >
                {photos.length >= maxFiles
                    ? `Maksimum ${maxFiles} fotoğraf yüklendi`
                    : "Fotoğraf eklemek için tıklayın"}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: maxFiles }).map((_, i) => {
                    const p = photos[i];
                    return p ? (
                        <div
                            key={i}
                            className={`relative rounded overflow-hidden border ${
                                coverIndex === i ? "ring-2 ring-gray-700" : ""
                            }`}
                        >
                            <img
                                src={p.url}
                                alt={`preview-${i}`}
                                className="object-cover w-full h-24 cursor-pointer"
                                onClick={() => selectCover(i)}
                                title="Kapak olarak ayarla"
                            />
                            <button
                                type="button"
                                onClick={() => handleDelete(i)}
                                className="absolute top-0 right-0 text-white bg-black bg-opacity-60 px-1 text-xs"
                            >
                                ×
                            </button>
                            {coverIndex === i && (
                                <div className="absolute bottom-0 left-0 bg-gray-700 text-white text-[10px] px-1 w-full text-center">
                                    Kapak
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            key={`empty-${i}`}
                            className="flex items-center justify-center h-24 text-gray-300 border border-dashed rounded"
                        >
                            Boş
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
