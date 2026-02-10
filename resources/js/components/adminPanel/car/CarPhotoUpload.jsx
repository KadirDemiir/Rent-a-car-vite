import CarForm from "./form/CarForm.jsx";
import axios from "axios";

export default function CarPhotoUpload({ car, closeModal, setCar, setSuccess }) {
    const submitHandler = (data) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        axios.post(`/adminpanel/car_groups/${car.id}`, data, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
            }
        })
            .then((res) => {
                closeModal();
                setSuccess("Başarıyla güncellendi");
                setCar(res.data.car);
                setTimeout(() => setSuccess(""), 10000);
            }).catch(e => console.error(e.response?.data?.error));
    };

    return (
        <>
            <button onClick={closeModal} className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-black">&times;</button>
            <CarForm mode="photo" car={car} onSubmit={submitHandler} />
        </>
    );
}
