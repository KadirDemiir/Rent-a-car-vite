import CarCardsProp from './carCardsProp/CarCardsProp';


export default function CarCardProperties({fuel_type, transmission_type, seat_count, body_type, trunk_capacity}){
    return(
        <div className="flex-1 w-full">
            <div className="w-full flex justify-center font-bold">
                Car's Properties
            </div>

            < CarCardsProp 
            photo_path = "storage/svg/carFeatures/gas_station.svg"
            context = {fuel_type}
            />
            < CarCardsProp 
            photo_path = "storage/svg/carFeatures/transmission.svg"
            context = {transmission_type}
            />
            < CarCardsProp 
            photo_path = "storage/svg/carFeatures/groups.svg"
            context = {`${seat_count} seats`}
            />
            < CarCardsProp 
            photo_path = "storage/svg/carFeatures/car.svg"
            context={body_type}
            />
            < CarCardsProp 
            photo_path = "storage/svg/carFeatures/bag.svg"
            context = {`${trunk_capacity} Luggage Count`}
            />
        </div>
    );
}