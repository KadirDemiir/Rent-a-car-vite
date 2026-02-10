export default function ReservationCarPayment({
                                                  className = "",
                                                  baseDailyPrice,
                                                  dailyPrice,
                                                  hasDiscount,
                                                  dropPrice,
                                                  totalDays,
                                                  totalPrice,
                                                  onlineTotal,
                                                  currencySymbol,
                                                  onRentNow,
                                                  rentLabel = "Rent Now",
                                              }) {
    return (
        <div className={`col-span-1 sm:col-span-12 md:col-span-4 lg:col-span-4 flex flex-col justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50 gap-3 shadow-inner ${className}`}>
            <div className="w-full space-y-1.5 sm:space-y-2">
                <div className="flex justify-between items-center px-1.5 sm:px-2 text-xs sm:text-sm text-gray-700">
                    <span className="font-medium">Günlük:</span>
                    <div className="flex flex-col items-end">
                        {hasDiscount && (
                            <span className="text-[10px] sm:text-xs text-red-500 line-through decoration-red-500">
                                {baseDailyPrice} {currencySymbol}
                            </span>
                        )}
                        <span className={`${hasDiscount ? 'text-green-600 font-bold' : ''}`}>
                            {dailyPrice} {currencySymbol}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between px-1.5 sm:px-2 text-xs sm:text-sm text-gray-700">
                    <span className="font-medium">Drop Ücreti:</span>
                    <span>
                        {dropPrice} {currencySymbol}
                    </span>
                </div>

                <div className="flex justify-between px-1.5 sm:px-2 text-xs sm:text-sm text-gray-700">
                    <span className="font-medium">Toplam Gün:</span>
                    <span>{totalDays}</span>
                </div>

                {onlineTotal > 0 && (
                    <div className="flex justify-between px-1.5 sm:px-2 text-xs sm:text-sm text-green-600 bg-green-50 rounded py-1">
                        <span className="font-medium">Online'a Özel:</span>
                        <span className="font-semibold">{onlineTotal} {currencySymbol}</span>
                    </div>
                )}

                <div className="flex justify-between px-1.5 sm:px-2 text-sm sm:text-base text-gray-800 font-semibold border-t border-gray-200 pt-2">
                    <span>Toplam:</span>
                    <span>
                        {totalPrice} {currencySymbol}
                    </span>
                </div>
            </div>
            <button
                className="w-full px-4 py-2 sm:py-2.5 bg-gray-700 text-white text-sm sm:text-base font-medium rounded-lg sm:rounded-xl hover:bg-gray-800 active:bg-gray-900 transition duration-300 touch-manipulation"
                onClick={onRentNow}
                type="button"
            >
                {rentLabel}
            </button>
        </div>
    );
}
