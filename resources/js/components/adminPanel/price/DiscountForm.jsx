import DiscountType from "./DiscountType.jsx";
import DailyDiscountAmount from "./DailyDiscountAmount.jsx";
import DateTime from "./DateTime.jsx";

export default function DiscountForm({
    currencies = [],
    segments = [],
    selectedDiscount,
    setSelectedDiscount,
    dayDiscount,
    setDayDiscount,
    segmentId,
    setSegmentId,
    defaultCurrencyId = "",
    startDate,
    setStartDate,
    endDate,
    setEndDate
}) {
    const handleDiscountTypeChange = (value) => setSelectedDiscount?.(value);
    const handleSegmentChange = (value) => setSegmentId?.(value);

    return (
        <div className="w-full space-y-6">
            <DiscountType value={selectedDiscount} discountTypeOnChange={handleDiscountTypeChange} segmentId={segmentId} setSegmentId={handleSegmentChange} segments={segments}/>
            <DailyDiscountAmount currencies={currencies} dayDiscount={dayDiscount} setDayDiscount={setDayDiscount} defaultCurrencyId={defaultCurrencyId}/>
            <div className={`w-full flex items-center justify-center`}>
                <DateTime startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}/>
            </div>
        </div>
    );
}
