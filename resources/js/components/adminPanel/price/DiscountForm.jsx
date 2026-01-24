import DiscountType from "./DiscountType.jsx";
import DailyDiscountAmount from "./DailyDiscountAmount.jsx";
import DateTime from "./DateTime.jsx";
import { useEffect, useState } from "react";
import axios from "axios";

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
    setEndDate,
    isDateTimeVisible = true
}) {
    const [fetchedSegments, setFetchedSegments] = useState([]);

    useEffect(() => {
        axios.get("/get-all-cars-info")
            .then(response => {
                setFetchedSegments(response.data.segments || []);
            })
            .catch(error => {
                console.error("Error fetching segments:", error);
            });
    }, []);

    const handleDiscountTypeChange = (value) => setSelectedDiscount?.(value);
    const handleSegmentChange = (value) => setSegmentId?.(value);

    // Use fetched segments if available, otherwise fall back to props (supports both patterns)
    const availableSegments = fetchedSegments.length > 0 ? fetchedSegments : segments;

    return (
        <div className="w-full space-y-6">
            <DiscountType 
                value={selectedDiscount} 
                discountTypeOnChange={handleDiscountTypeChange} 
                segmentId={segmentId} 
                setSegmentId={handleSegmentChange} 
                segments={availableSegments}
            />
            <DailyDiscountAmount currencies={currencies} dayDiscount={dayDiscount} setDayDiscount={setDayDiscount} defaultCurrencyId={defaultCurrencyId}/>
            {isDateTimeVisible && (
                <div className={`w-full flex items-center justify-center`}>
                    <DateTime startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}/>
                </div>
            )}
        </div>
    );
}
