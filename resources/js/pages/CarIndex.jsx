import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import Navbar from '../components/websites/Navbar.jsx';
import CarIndexCard from '../components/websites/carIndex/CarIndexCard.jsx';

export default function CarIndex({car}){
    return(
        <div>
            < Navbar />
            <div className="w-[90%] mt-16 mx-auto">
                <div className="text-gray-600 text-[16px] font-medium">
                    <Link href="/" className="hover:text-black ">Home</Link> / <Link href="/cars" className="hover:text-black">Cars</Link> / <span className="text-black">{car.brand} {car.model}</span>
                </div>
                <div className="font-bold text-[24px]">{car.brand} {car.model} {car.fuel_type} {car.transmission_type}</div><br />
                < CarIndexCard car={car}/>
            </div>
        </div>
    );
}
