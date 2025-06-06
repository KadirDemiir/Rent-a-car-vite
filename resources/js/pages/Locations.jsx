import Navbar from '../components/websites/Navbar.jsx';
import LocationCard from '../components/websites/locationCard/LocationCard.jsx';
export default function About() {
    return (
        <div>
            < Navbar />
            <div className="p-4 w-full flex justify-center bg-gray-100">
                <div className="w-[90%]">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 sm:grid-col-1 gap-4">
                    < LocationCard />
                    </div>
                </div>
            </div>
        </div>
    );
}
