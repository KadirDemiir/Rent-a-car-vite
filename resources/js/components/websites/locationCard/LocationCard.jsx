import {Plane, Phone, Mail, MapPin} from 'lucide-react';
export default function LocationCard({location}){
    const googleMapsUrl = `https://www.google.com/maps/search/${location.latitude},${location.longitude}`;
    
    return(
        <div className="col-span-1 rounded-2xl bg-white shadow-md">
            {location.photo_path ?
                (<img src={`/storage/${location.photo_path}`} alt="" className="w-full rounded-t-2xl h-60" loading="lazy" />)
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
                    <Plane className={`text-gray-700`} />
                    <div className="font-medium text-gray-700">{location.address}</div>
                </div>
                <div className="flex gap-4 h-8 items-center">
                    <Phone className={`text-gray-700`}/>
                    <div className="font-medium text-gray-700">{location.phone}</div>
                </div>
                <div className="flex gap-4 h-8 items-center">
                    <Mail className={`text-gray-700`}/>
                    <div className="font-medium text-gray-700">{location.email}</div>
                </div>
                <a 
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 h-8 items-center text-gray-700 hover:text-gray-900 font-medium"
                >
                    <MapPin size={20}/>
                    <div>View on Google Maps</div>
                </a>
            </div>
        </div>
    );
}
