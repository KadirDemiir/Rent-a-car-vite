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
            } catch (error) {
                console.error("Veri çekilirken hata oluştu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Yükleniyor...</p>;

    return (
        <div>
            < Navbar />
            <div className="p-4 w-full flex justify-center bg-gray-100">
                <div className="w-[90%]">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 sm:grid-col-1 gap-4">
                        {locations?.map(location => (
                            < LocationCard location={location} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
