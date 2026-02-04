import {User, Car, Shield} from 'lucide-react';

export default function CarCardRequirements({min_age, experience, collateral}){
    return(
        <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>{min_age}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
                <Car className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>{experience}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
                <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>{collateral}</span>
            </div>
        </div>
    );
}
