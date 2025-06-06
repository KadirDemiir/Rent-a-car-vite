import CarIndexPropComp from "./carIndexComp/CarIndexPropComp.jsx";

export default function CarIndexProp({car}){
    return (
        <div className="grid grid-cols-2 gap-6 p-6 bg-white rounded-2xl shadow-md w-full border-1 border-blue-600">

            <div className="col-span-2 flex justify-center font-bold text-xl">Car Properties</div>

            < CarIndexPropComp photo_path={"/storage/svg/carFeatures/transmission.svg"} title={"Transmission type"} content={car.transmission_type}/>

            < CarIndexPropComp photo_path={"/storage/svg/carFeatures/gas_station.svg"} title={"Fuel type"} content={car.fuel_type}/>

            < CarIndexPropComp photo_path={"/storage/svg/carFeatures/groups.svg"} title={"Seat Count"} content={car.seat_count}/>

            < CarIndexPropComp photo_path={"/storage/svg/carFeatures/bag.svg"} title={"Luggage Volume"} content={car.trunk_capacity}/>

            < CarIndexPropComp photo_path={"/storage/svg/carFeatures/car.svg"} title={"Car Type"} content={car.body_type}/>

        </div>
    );
}
