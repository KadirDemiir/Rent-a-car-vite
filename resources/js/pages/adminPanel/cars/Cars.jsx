import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import {router} from "@inertiajs/react";

export default function Cars({cars}){
    const handleClick = (id) => {
        router.visit(`/adminpanel/cars/${id}`)
    };

    console.log(cars);
    return(
        <div className="w-full">
            < Navbar />
            <div className="pl-64 pt-24 w-full">
                <div className="w-full flex items-center justify-center bg-red-50">
                    Filtrele
                </div>

                <div className="mt-8 mr-4">
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Plaka</th>
                            <th className="border px-4 py-2">Marka</th>
                            <th className="border px-4 py-2">Model</th>
                            <th className="border px-4 py-2">Yıl</th>
                            <th className="border px-4 py-2">Vites</th>
                            <th className="border px-4 py-2">Segment</th>
                            <th className="border px-4 py-2">Araç Tipi</th>
                            <th className="border px-4 py-2">Yakıt Tipi</th>
                            <th className="border px-4 py-2">Bagaj Kapasitesi</th>

                        </tr>
                        </thead>
                        <tbody>
                            {cars && cars.map((car) => (
                            <tr key={car.id} onClick={() => handleClick(car.id)} className="cursor-pointer">
                                <td className="border px-4 py-2">{car.license_plate}</td>
                                <td className="border px-4 py-2">{car.brand}</td>
                                <td className="border px-4 py-2">{car.model}</td>
                                <td className="border px-4 py-2">{car.year}</td>
                                <td className="border px-4 py-2">{car.transmission_type}</td>
                                <td className="border px-4 py-2">{car.segment}</td>
                                <td className="border px-4 py-2">{car.body_type}</td>
                                <td className="border px-4 py-2">{car.fuel_type}</td>
                                <td className="border px-4 py-2">{car.trunk_capacity}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    );
}
