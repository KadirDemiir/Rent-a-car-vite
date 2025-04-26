import Navbar from '../components/Navbar';
import CarCard from '../components/carCards/carCard';
import { usePage } from '@inertiajs/react';

export default function Car() {
    const { cars } = usePage().props;

    return (
        <div>
            < Navbar />
            <div className="mt-8 w-full grid grid-cols-3 justify-items-center gap-6">
                {cars.map((car) => (
                    < CarCard key={car.id} car={car} />
                ))}
            </div>
        </div>
    ); 
}