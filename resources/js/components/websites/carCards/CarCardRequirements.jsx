import CarCardsProp from './carCardsProp/CarCardsProp.jsx';
import {User, Car, Shield} from 'lucide-react';
export default function CarCardRequirements({min_age, experience, collateral, compName}){
    return(
        <div className="flex-1 flex flex-col gap-4">
        <div className="w-full flex justify-center font-bold">
            {compName}
        </div>
        <CarCardsProp
        photo ={<User/>}
        context = {min_age}
        />
        <CarCardsProp
        photo ={<Car/>}
        context = {experience}
        />
        <CarCardsProp
        photo ={<Shield/>}
        context = {collateral}
        />
    </div>
    );
}
