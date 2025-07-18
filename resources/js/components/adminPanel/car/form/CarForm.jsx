import React, { useRef } from "react";
import CarDetailForm from "./CarDetailForm.jsx";
import CarPricingForm from "./CarPricingForm.jsx";
import CarPhotoForm from "./CarPhotoForm.jsx";

export default function CarForm({ car = null, mode, onSubmit }) {
    const detailRef = useRef();
    const pricingRef = useRef();
    const photoRef = useRef();

    const handleSubmit = () => {
        let combined = new FormData();
        combined.append('mode', mode);
        if (mode === "create") {
            console.log("geldi");
            const detailData = detailRef.current.submit();
            const pricingData = pricingRef.current.submit();
            const photoData = photoRef.current.submit();

            if (!detailData || !pricingData || !photoData) return;

            for (let pair of detailData.entries()) combined.append(pair[0], pair[1]);
            for (let pair of pricingData.entries()) combined.append(pair[0], pair[1]);
            for (let pair of photoData.entries()) combined.append(pair[0], pair[1]);
            console.log("sdfsd");
        } else if (mode === "edit") {
            const detailData = detailRef.current.submit();
            if (detailData) {
                for (let pair of detailData.entries()) combined.append(pair[0], pair[1]);
            }
        } else if (mode === "pricing") {
            const pricingData = pricingRef.current.submit();
            if (pricingData) {
                for (let pair of pricingData.entries()) combined.append(pair[0], pair[1]);
            }
        } else if (mode === "photo") {
            const photoData = photoRef.current.submit();
            if (photoData) {
                for (let pair of photoData.entries()) combined.append(pair[0], pair[1]);
            }
        }
        if (combined.entries().next().done) return;
        onSubmit(combined);
    };

    return (
        <>
            {mode === "create" && (
                <>
                    <CarDetailForm car={car} ref={detailRef}/><br/>
                    <CarPricingForm car={car} ref={pricingRef} ddopen={true}/><br/>
                    <CarPhotoForm car={car} ref={photoRef} /><br/>
                </>
            )}

            {mode === "edit" && (
                <CarDetailForm car={car} ref={detailRef}/>
            )}

            {mode === "pricing" && (
                <CarPricingForm car={car} ref={pricingRef} />
            )}

            {mode === "photo" && (
                <CarPhotoForm defPhotos={car?.photos} ref={photoRef} />
            )}
            <div className="pt-4">
                <button type="submit" onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl cursor-pointer">
                    Kaydet
                </button>
            </div>
        </>
    );
}
