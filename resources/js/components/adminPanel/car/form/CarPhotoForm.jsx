import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import {useTranslation} from "react-i18next";

const CarPhotoForm = forwardRef(({ defPhotos, maxFiles = 4, onSubmit }, ref) => {
    const {t} = useTranslation();
    const [photos, setPhotos] = useState(() =>
        (defPhotos || []).map((p) => ({
            file: null,
            url: p.url ? p.url : `/storage/${p.photo_path}`,
            photo_path: p.photo_path,
            is_cover: p.is_cover,
            car_id: p.car_id,
        }))
    );
    const [coverIndex, setCoverIndex] = useState(() =>
        (defPhotos || []).findIndex((p) => p.is_cover)
    );
    const fileInputRef = useRef();
    const [error, setError] = useState("");

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
            is_cover: false,
        }));
        const next = [...photos, ...added];
        setPhotos(next);
        e.target.value = "";
    };

    const handleDelete = (index) => {
        setPhotos((prev) => {
            URL.revokeObjectURL(prev[index].url);
            return prev.filter((_, i) => i !== index);
        });

        setCoverIndex((prev) => {
            if (prev === index) return null;
            if (prev > index) return prev - 1;
            return prev;
        });
    };

    const selectCover = (i) => {
        if (i === coverIndex) {
            setCoverIndex(null);
        } else {
            setCoverIndex(i);
        }
    };

    const triggerPicker = () => {
        if (photos.length < maxFiles) fileInputRef.current.click();
    };

    const handleSubmit = () => {
        setError("");
        const data = new FormData();
        let counter = 0;

        photos.forEach((p) => {
            if (p.file) {
                data.append("photos[]", p.file);
                data.append("existing_photos[]", p.photo_path || null);
                counter++;
            } else if (p.photo_path) {
                data.append("existing_photos[]", p.photo_path);
                data.append("photos[]", p.file || null);
            }
        });

        if (counter === 0 && photos.every(p => !p.photo_path)) {
            setError("Lütfen En az 1 Fotoğraf Giriniz");
            return;
        }

        if (coverIndex !== null && coverIndex >= 0)
            data.append("coverIndex", coverIndex);
        else
            data.append("coverIndex", 0);
        return data;
    };

    useImperativeHandle(ref, () => ({
        submit: handleSubmit
    }));

    return (
        <form onSubmit={handleSubmit} className="space-y-3 bg-white">
            {error && (
                <div className={`border-l-8 border-red-500 bg-red-300 text-white p-2 text-sm`}>{error}</div>
            )}
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
                        : "border-blue-400 text-blue-600 hover:bg-blue-50"
                }`}
            >
                {photos.length >= maxFiles
                    ? t("adminpanel.car.car_modify.edit_photos.max_{count}_photos_added", { count: maxFiles })
                    : t("adminpanel.car.car_modify.edit_photos.click_for_add_photo")}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: maxFiles }).map((_, i) => {
                    const p = photos[i];
                    return p ? (
                        <div
                            key={i}
                            className={`relative rounded overflow-hidden border ${
                                coverIndex === i ? "ring-2 ring-blue-500" : ""
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
                                <div className="absolute bottom-0 left-0 bg-blue-600 text-white text-[10px] px-1 w-full text-center">
                                    {t("adminpanel.car.car_modify.edit_photos.cover")}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            key={`empty-${i}`}
                            className="flex items-center justify-center h-24 text-gray-300 border border-dashed rounded"
                        >
                            {t("adminpanel.car.car_modify.edit_photos.empty")}
                        </div>
                    );
                })}
            </div>
        </form>
    );
});

export default CarPhotoForm;
