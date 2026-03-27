import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import CarDetailForm from "../../../components/adminPanel/car/form/CarDetailForm.jsx";
import CarPricingForm from "../../../components/adminPanel/car/form/CarPricingForm.jsx";
import CarPhotoForm from "../../../components/adminPanel/car/form/CarPhotoForm.jsx";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useState, useRef } from "react";
import {router} from "@inertiajs/react";
import SuccessMessage from "../../../components/SuccessMessage.jsx";
export default function AddCarGroup({ locations = [] }) {
    const { t, i18n } = useTranslation();
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const detailRef = useRef(null);
    const pricingRef = useRef(null);
    const photoRef = useRef(null);
    const topRef = useRef(null);

    const handleSubmit = () => {
        console.log(1);
        setError("");
        setSuccess("");

        const detailData = detailRef.current?.submit();
        const pricingData = pricingRef.current?.submit();
        const photoData = photoRef.current?.submit();
        console.log(2);
        if (!detailData || !pricingData || !photoData) return;
        console.log(3);
        const formData = new FormData();
        detailData.forEach((value, key) => formData.append(key, value));
        pricingData.forEach((value, key) => formData.append(key, value));
        photoData.forEach((value, key) => formData.append(key, value));

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        axios.post("/adminpanel/car-groups", formData, {
                headers: { "X-CSRF-TOKEN": csrfToken, "Accept": "application/json" },
            })
            .then((res) => {
                if (res.data.success && res.data.redirect_slug) {
                    setSuccess(t("adminpanel.car_group.created") || "CarGroup group created successfully.");
                    setError(null);
                    setTimeout(() => {
                        const base = `/${i18n.language}/${t("address.adminpanel")}/${t("address.car_groups")}`;
                        router.visit(`${base}/${res.data.redirect_slug}`);
                    }, 1500);
                } else {
                    setError(res.data.error || "An error occurred.");
                }
                if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            })
            .catch((err) => {
                const msg = err.response?.data?.errors
                    ? Object.values(err.response.data.errors).flat().join(" ")
                    : err.response?.data?.error || err.message;
                setError(msg);
                setSuccess(null);
                if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            });
    };

    return (
        <div className="w-full">
            <Navbar>
                <h3 ref={topRef} className="text-xl font-bold text-gray-900">
                    {t("adminpanel.car_group.add_car_group") || "Add CarGroup Group"}
                </h3>
                <hr className="my-4" />
                <SuccessMessage message={success} />
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                        <p>{error}</p>
                    </div>
                )}
                <div className="w-full space-y-8 shadow-lg p-6 rounded-xl bg-white border border-gray-200">
                    <CarDetailForm ref={detailRef} car={{}} groupOnly />
                    {/*<VehicleListForm ref={vehiclesRef} locations={locations} />*/}
                    <CarPricingForm ref={pricingRef} car={{}} ddopen={true} />
                    <CarPhotoForm car={{}} ref={photoRef} />
                    <div className="pt-4">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl cursor-pointer transition"
                        >
                            {t("adminpanel.car_group.create_group") || "Create CarGroup Group"}
                        </button>
                    </div>
                </div>
            </Navbar>
            <div className="w-full h-12" />
        </div>
    );
}
