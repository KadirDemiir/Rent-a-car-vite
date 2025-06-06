import Navbar from '../components/websites/Navbar.jsx';
import CarCard from '../components/websites/carCards/CarCard.jsx';
import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

export default function Car() {
    const { cars } = usePage().props;

    return (
        <div>
            < Navbar />
            <div className="mt-8 w-full grid grid-cols-3 justify-items-center gap-6 bg-gray-50">
                {cars.map((car) => (
                    <Link key={car.id} href={`/cars/${car.id}`}>
                        < CarCard key={car.id} car={car} />
                    </Link>
                ))}
            </div>
        </div>
    );
}
