export default function ReservationCarPayment({
                                                  className = "",
                                                  baseDailyPrice,
                                                  dailyPrice,
                                                  hasDiscount,
                                                  dropPrice,
                                                  totalDays,
                                                  totalPrice,
                                                  currencySymbol,
                                                  onRentNow,
                                                  rentLabel = "Rent Now",
                                              }) {
    return (
        <div className={`col-span-1 md:col-span-10 lg:col-span-3 flex flex-col md:flex-row lg:flex-col justify-between items-center p-4 rounded-2xl bg-gray-50 gap-4 shadow-inner ${className}`}>
            <div className="w-full md:w-auto md:flex-1 lg:w-full space-y-2">
                <div className="flex justify-between items-center px-2 text-sm text-gray-700">
                    <span className="font-medium">Günlük:</span>
                    <div className="flex flex-col items-end">
                        {hasDiscount && (
                            <span className="text-xs text-red-500 line-through decoration-red-500">
                                {baseDailyPrice} {currencySymbol}
                            </span>
                        )}
                        <span className={`${hasDiscount ? 'text-green-600 font-bold' : ''}`}>
                            {dailyPrice} {currencySymbol}
                        </span>
                    </div>
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
                className="w-full md:w-auto lg:w-full px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition duration-300 md:min-w-[200px]"
                onClick={onRentNow}
                type="button"
            >
                {rentLabel}
            </button>
        </div>
    );
}
