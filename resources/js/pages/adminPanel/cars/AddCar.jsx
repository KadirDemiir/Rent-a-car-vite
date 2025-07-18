import Navbar from "../../../components/adminPanel/navbar/Navbar";
import CarForm from "../../../components/adminPanel/car/form/CarForm.jsx";
import { router } from "@inertiajs/react";

export default function AddCars({error, success}) {

    const onSubmit = (data) => {
        if (data instanceof FormData) {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            router.post("/adminpanel/car/add", data, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            });
        }
    };

    return (
        <div className="w-full">
            <Navbar />
            <div className="pl-64 pt-24 pr-4 w-full">
                <h3>Araç Ekle</h3>
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
                    <CarForm mode="create" onSubmit={onSubmit}/>
                </div>
            </div>
            <div className="w-full h-50"></div>
        </div>
    );
}
