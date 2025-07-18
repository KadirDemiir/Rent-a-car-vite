import { router } from "@inertiajs/react";
import CarForm from "./form/CarForm.jsx";

export default function CarPhotoUpload({car, closeModal, }) {

    const submitHandler = (data) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        router.post(`/adminpanel/cars/${car.id}`, data, {
            heading: {
                'X-CSRF-TOKEN': csrfToken,
            },
            onSuccess: () => {
                closeModal();
                router.reload({
                    preserveScroll: true
                });
            },
            onError: () => {
                closeModal();
            }
        })
    };

    return (
        <div className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6">
            <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-black"
            >
                &times;
            </button>

            < CarForm mode="photo" car={car} onSubmit={submitHandler}/>

        </div>
    );
}
