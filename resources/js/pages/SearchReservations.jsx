import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import Navbar from "../components/Navbar.jsx";
import SearchReservationsFrom from "../components/SearchReservationForm.jsx";
import SortSearchReservations from '../components/SortSearchReservations.jsx';
import FilterReservations from "../components/FilterReservations.jsx"

export default function SearchReservations(){
    const { availableCars, reservation } = usePage().props;

    const [sortBy, setSortBy] = useState("increase");
    const [fuelType, setFuelType] = useState("");
    const [transmissionType, setTransmissionType] = useState("");
    const [segment, setSegment] = useState("");

    const handleFilterChange = ({ sort, fuel, transmission, segment }) => {
        setSortBy(sort);
        setFuelType(fuel);
        setTransmissionType(transmission);
        setSegment(segment);
    };

    return(
        <div>
            <Navbar />

            <div className="flex flex-col items-center justify-center">
                <div className="w-[90%]">
                {reservation && (
                    <SearchReservationsFrom
                        defPickupLocation={reservation.selectedPULocation}
                        defReturnLocation={reservation.selectedRLocation}
                        defPickupDate= {reservation.startDate}
                        defPickupClock ={reservation.startTime}
                        defReturnDate={reservation.finishDate}
                        defReturnClock={reservation.finishTime}
                    />
                )}

                    <div className="w-full m-4 mt-8">

                        <div className="w-full flex items-center justify-between mb-4">
                            < FilterReservations onFilterChange={handleFilterChange}/>
                        </div>

                        {availableCars.length > 0 ?
                        (
                            < SortSearchReservations availableCars={availableCars}
                            sortBy={sortBy}
                            fuelType={fuelType}
                            transmissionType={transmissionType}
                            segment={segment}
                            />
                        ) :
                        (<div className=" flex items-center justify-center">Seçilen Tarih Ve Konum İçin Uygun Arabamız Bulunmamaktadr.</div>)
                        }
                    </div>

                </div>
            </div>
        </div>

    );
}
