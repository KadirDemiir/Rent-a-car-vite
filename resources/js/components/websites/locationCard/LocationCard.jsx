import {Plane, Phone, Mail, MapPin} from 'lucide-react';
export default function LocationCard({location}){
    return(
        <div className="col-span-1 rounded-2xl bg-white shadow-md">
            {location.photo_path ?
                (<img src={`/storage/${location.photo_path}`} alt="" className="w-full rounded-t-2xl h-60" />)
                :
                (
                    <div className="w-full rounded-t-2xl h-60 flex items-center justify-center">
                        <MapPin/>
                    </div>)
            }
            <br />
            <div className="mx-4 pb-16 grid gap-6 ">
                <div className="font-extrabold text-xl font-sans">{location.name}</div>
                <div className="font-normal text-gray-700">{location.city}</div>
                <div className="flex gap-4 h-8 items-center">
                    <Plane />
                    <div className="font-medium text-gray-700">{location.address}</div>
                </div>
                <div className="flex gap-4 h-8 items-center">
                    <Phone/>
                    <div className="font-medium text-gray-700">{location.phone}</div>
                </div>
                <div className="flex gap-4 h-8 items-center">
                    <Mail/>
                    <div className="font-medium text-gray-700">{location.email}</div>
                </div>
            </div>
        </div>
    );
}
