import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import ModifyCar from "../../../components/adminPanel/car/ModifyCar.jsx";
import CarReservations from "../../../components/adminPanel/car/CarReservations.jsx";
import IncomingGraph from "../../../components/adminPanel/car/IncomingGraph.jsx";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function Car({ id }) {
    const [car, setCar] = useState(null);
    const [reservations, setReservations] = useState(null);
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/get-car-information/${id}`);
            setCar(response.data.car);
            setReservations(response.data.car.reservations);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return <div className="p-4 text-center">Loading...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
    if (!car) return <div className="p-4 text-center">Car not found</div>;

    return (
        <div className="w-full">
            <Navbar>
                <div className="font-bold text-xl">
                    {car.license_plate} - {car.brand} {car.model} {car.fuel_type} {car.transmission_type} {car.year}
                </div>
                <hr className="my-4" />

                {success && (
                    <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
                        {success}
                    </div>
                )}

                <div className="w-full flex flex-col gap-16">
                    <ModifyCar car={car} setCar={setCar} setSuccess={setSuccess} />

                    <div className="max-h-[40vh] overflow-y-hidden">
                        <span className="font-bold">Araca Ait Rezervasyonlar </span>
                        <span className="text-sm text-gray-500">(Detaylar İçin Tıklayınız)</span>
                        <CarReservations updateData={fetchData} allReservations={reservations} past={false} />
                    </div>

                    <div className="max-h-[40vh] overflow-y-hidden">
                        <span className="font-bold">Araca Ait Geçmiş Rezervasyonlar </span>
                        <span className="text-sm text-gray-500">(Detaylar İçin Tıklayınız)</span>
                        <CarReservations updateData={fetchData} allReservations={reservations} current={false} />
                    </div>

                    <IncomingGraph />
                </div>
            </Navbar>
            <div className="w-full h-20"></div>
        </div>
    );
}
