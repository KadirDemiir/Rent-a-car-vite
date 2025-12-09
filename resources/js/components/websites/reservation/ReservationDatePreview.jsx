export default function ResercationDatePreview({pickupDate, returnDate, pickupLocation, returnLocation}){
    return(
        <div className={`w-full rounded-lg shadow-lg bg-white flex flex-col gap-4 pb-4`}>
            <div className={`w-full rounded-t-lg p-2 bg-blue-600 text-white font-semibold`}>Reservation Card</div>
            <div className={`flex items-center justify-between px-4`}>
                <span>Pickup Date</span>
                <span>{pickupDate.split(' ')[0].split('-').reverse().join('/')} {pickupDate.split(' ')[1]}</span>
            </div>
            <div className={`flex items-center justify-between px-4`}>
                <span>Return Date</span>
                <span>{returnDate.split(' ')[0].split('-').reverse().join('/')} {returnDate.split(' ')[1]}</span>
            </div>
            <div className={`flex items-center justify-between px-4`}>
                <span>Pickup Location</span>
                <span>{pickupLocation}</span>
            </div>
            <div className={`flex items-center justify-between px-4`}>
                <span>Return Location</span>
                <span>{returnLocation}</span>
            </div>
        </div>
    );
}
