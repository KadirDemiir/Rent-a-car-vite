export default function ResercationDatePreview({pickupDate, returnDate, pickupLocation, returnLocation}){
    return(
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                <div className="flex items-center gap-2 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    <h3 className="font-bold text-lg">Reservation Info</h3>
                </div>
            </div>
            
            <div className="p-5 space-y-4">
                <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <div className="text-xs font-medium text-gray-500 mb-1">Pickup</div>
                        <div className="font-semibold text-gray-800">{pickupDate.split(' ')[0].split('-').reverse().join('/')} {pickupDate.split(' ')[1]}</div>
                        <div className="text-sm text-gray-600 mt-1">{pickupLocation}</div>
                    </div>
                </div>
                
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <div className="text-xs font-medium text-gray-500 mb-1">Return</div>
                        <div className="font-semibold text-gray-800">{returnDate.split(' ')[0].split('-').reverse().join('/')} {returnDate.split(' ')[1]}</div>
                        <div className="text-sm text-gray-600 mt-1">{returnLocation}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
