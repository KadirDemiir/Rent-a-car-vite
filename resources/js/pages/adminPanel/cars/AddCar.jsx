import Navbar from "../../../components/adminPanel/navbar/Navbar";
import CarForm from "../../../components/adminPanel/car/form/CarForm.jsx";
import {useTranslation} from "react-i18next";
import axios from "axios";
import {useState} from "react";
import {reloadTranslations} from "../../../i18n.js";

export default function AddCars() {
    const {t, i18n} = useTranslation();
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const onSubmit = (data) => {
        if (data instanceof FormData) {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            axios.post("/adminpanel/car/add", data, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            })
                .then(res => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    if (res.data.success) {
                        setSuccess("Added Succesfully");
                        setError(null);
                    } else if (res.data.error) {
                        setError(res.data.error);
                        setSuccess(null);
                    }
                    localStorage.removeItem('i18n_config_cache');
                    reloadTranslations(i18n.language)

                })
                .catch(err => {
                    if (err.response?.status === 422) {
                        const validationErrors = err.response.data.errors;
                        const firstError = Object.values(validationErrors)[0][0];
                        setError(firstError);
                    } else {
                        setError(err.response?.data?.error || err.message);
                    }
                    setSuccess(null);
                });
        }
    };

    return (
        <div className="w-full">
            <Navbar >
                <h3>{t("adminpanel.add_car.add_car")}</h3>
                <hr />
                {success && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                        <p>{error}</p>
                    </div>
                )}
                <div className="w-[90%] m-8 shadow-lg p-4">
                    <CarForm mode="create" onSubmit={onSubmit} />
                </div>
            </Navbar>
            <div className="w-full h-50"></div>
        </div>
    );
}

