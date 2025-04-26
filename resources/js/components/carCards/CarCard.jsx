import CarCardUpSide from './CarCardUpSide';
import CarCardPhoto from './CarCardPhoto';
import CarCardProperties from './CarCardProperties';
import CarCardRequirements from './CarCardRequirements';
export default function CarCard({car}) {
    return (
        <div className="grid grid-rows-9 h-140 w-110 rounded-xl border border-gray-300 transition-transform duration-300 hover:scale-105 hover:outline-2 hover:outline-blue-500 hover:rounded-xl">
            < CarCardUpSide 
            brand={car.brand}
            model={car.model}
            segment={car.segment}
            />
            < CarCardPhoto
            photo_path="/storage/cars/volvo-xc90.png"
            />  
            <div className="row-span-5 flex p-2 gap-2">
                < CarCardProperties 
                body_type={car.body_type}
                seat_count={car.seat_count}
                trunk_capacity={car.trunk_capacity}
                fuel_type={car.fuel_type}
                transmission_type={car.transmission_type}
                />
                <div className="h-[90%] w-[1px] bg-gray-300"></div> 
                < CarCardRequirements 
                min_age="23 Min Age"
                experience="3 Year Experience"
                collateral="6000 lira peşinat." 
                />
            </div>
        </div>
    );
}   