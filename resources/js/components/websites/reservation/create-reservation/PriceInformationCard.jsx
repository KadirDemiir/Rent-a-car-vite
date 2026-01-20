import {useCurrency} from "../../../../providers/CurrencyContext.jsx";

export default function PriceInformationCard({total_days, daily_price, extra_price}) {
    console.log(daily_price);
    const {calculateTotal, current} = useCurrency()
    return (
        <div className={`w-full rounded-lg shadow-lg bg-white flex flex-col gap-4`}>
            <div className={`w-full rounded-t-lg p-2 bg-blue-600 text-white font-semibold`}>Price Information</div>
            <div className={`flex items-center justify-between px-4`}>
                <span>Car Price: </span>
                {daily_price && total_days && current?.symbol && (
                    <span>
                        {`${calculateTotal(total_days)} x ${calculateTotal(daily_price).toFixed(2)} ${current.symbol}`}
                    </span>
                )}
            </div>
            <div className={`flex items-center justify-between px-4`}>
                <span>Extra Prices: </span>
                <span>{`${calculateTotal(extra_price).toFixed(2)} ${current?.symbol}`}</span>
            </div>
            <div className={`flex items-center justify-between px-4 pb-2`}>
                <span className={`font-bold`}>Total: </span>
                <span>{`${calculateTotal(total_days * daily_price + extra_price).toFixed(2)} ${current?.symbol}`}</span>
            </div>
        </div>
    );
}
