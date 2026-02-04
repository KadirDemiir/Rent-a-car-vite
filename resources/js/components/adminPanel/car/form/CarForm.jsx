import React, { useRef } from "react";
import CarDetailForm from "./CarDetailForm.jsx";
import CarPricingForm from "./CarPricingForm.jsx";
import CarPhotoForm from "./CarPhotoForm.jsx";
import {useTranslation} from "react-i18next";

export default function CarForm({ car = null, mode, onSubmit }) {
    const {t} = useTranslation();
    const detailRef = useRef();
    const pricingRef = useRef();
    const photoRef = useRef();

    const handleSubmit = () => {
        let combined = new FormData();
        combined.append('mode', mode);
        if (mode === "create") {
            const detailData = detailRef.current.submit();
            const pricingData = pricingRef.current.submit();
            const photoData = photoRef.current.submit();
            if (!detailData || !pricingData || !photoData) return;
            for (let pair of detailData.entries()) combined.append(pair[0], pair[1]);
            for (let pair of pricingData.entries()) combined.append(pair[0], pair[1]);
            for (let pair of photoData.entries()) combined.append(pair[0], pair[1]);
        } else if (mode === "edit") {
            const detailData = detailRef.current.submit();
            if (detailData)
                for (let pair of detailData.entries()) combined.append(pair[0], pair[1]);
        } else if (mode === "pricing") {
            const pricingData = pricingRef.current.submit();
            if (pricingData)
                for (let pair of pricingData.entries()) combined.append(pair[0], pair[1]);
        } else if (mode === "photo") {
            const photoData = photoRef.current.submit();
            if (photoData)
                for (let pair of photoData.entries()) combined.append(pair[0], pair[1]);
        }
        if (combined.entries().next().done) return;
        onSubmit(combined);
    };

    return (
        <div className={`w-full max-w-full`}>
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
                <button type="submit" onClick={handleSubmit} className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-xl cursor-pointer">
                    {t("adminpanel.car.car_modify.save")}
                </button>
            </div>
        </div>
    );
}
