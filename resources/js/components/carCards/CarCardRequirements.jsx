import CarCardsProp from './carCardsProp/CarCardsProp';

export default function CarCardRequirements({min_age, experience, collateral}){
    return(
        <div className="flex-1 flex flex-col gap-4">
        <div className="w-full flex justify-center font-bold">
            Requirements
        </div>
        <CarCardsProp 
        photo_path = "storage/svg/requirements/calendar.svg"
        context = {min_age}
        />
        <CarCardsProp 
        photo_path = "storage/svg/requirements/steering-wheel.svg"
        context = {experience}
        />
        <CarCardsProp 
        photo_path = "/storage/svg/requirements/assurance.svg"
        context = {collateral}
        />
    </div>
    );
}