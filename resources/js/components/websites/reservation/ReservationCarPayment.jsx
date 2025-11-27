export default function ReservationCarPayment({
    className = "",
    dailyPrice,
    dropPrice,
    totalDays,
    totalPrice,
    currencySymbol,
    onRentNow,
    rentLabel = "Rent Now",
}) {
    return (
        <div className={`col-span-1 lg:col-span-3 flex flex-col justify-between items-center p-4 rounded-2xl bg-gray-50 gap-4 shadow-inner ${className}`}>
            <div className="w-full space-y-2">
                <div className="flex justify-between px-2 text-sm text-gray-700">
                    <span className="font-medium">Günlük:</span>
                    <span>
                        {dailyPrice} {currencySymbol}
                    </span>
                </div>
                <div className="flex justify-between px-2 text-sm text-gray-700">
                    <span className="font-medium">Drop Ücreti:</span>
                    <span>
                        {dropPrice} {currencySymbol}
                    </span>
                </div>

                <div className="flex justify-between px-2 text-sm text-gray-700">
                    <span className="font-medium">Toplam Gün:</span>
                    <span>{totalDays}</span>
                </div>
                <div className="flex justify-between px-2 text-base text-gray-800 font-semibold border-t pt-2">
                    <span>Toplam:</span>
                    <span>
                        {totalPrice} {currencySymbol}
                    </span>
                </div>
            </div>
            <button
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300"
                onClick={onRentNow}
                type="button"
            >
                {rentLabel}
            </button>
        </div>
    );
}

