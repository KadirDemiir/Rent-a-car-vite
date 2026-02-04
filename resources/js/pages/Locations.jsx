import Navbar from '../components/websites/Navbar.jsx';
import LocationCard from '../components/websites/locationCard/LocationCard.jsx';
import {useEffect, useState} from "react";
import axios from "axios";
export default function Locations() {
    const [locations, setLocations] = useState();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/get-locations');
                if (response.data.success) {
                    setLocations(response.data.locations);
                }
            } catch {
                // Error fetching locations
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    //if (loading) return <p>Yükleniyor...</p>;

    return (
        <div>
            < Navbar />
            {loading ? (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            ) : (
            <div className="p-4 w-full flex justify-center bg-gray-100">
                <div className="w-[90%]">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 sm:grid-col-1 gap-4">
                        {locations?.map(location => (
                            <LocationCard key={location.id} location={location} />
                        ))}
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}
