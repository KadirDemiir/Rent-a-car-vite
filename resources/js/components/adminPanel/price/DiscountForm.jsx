import DiscountType from "./DiscountType.jsx";
import DailyDiscountAmount from "./DailyDiscountAmount.jsx";

export default function DiscountForm({selectedDiscount, setSelectedDiscount, dayDiscount, setDayDiscount, discountTarget, setDiscountTarget}) {

    const discountTypeOnChange = (e) => setSelectedDiscount(e);

    return (
        <div className="w-full space-y-4">
            <DiscountType value={selectedDiscount} discountTypeOnChange={discountTypeOnChange} discountTarget={discountTarget} setDiscountTarget={setDiscountTarget}/>
            <DailyDiscountAmount dayDiscount={dayDiscount} setDayDiscount={setDayDiscount} />
        </div>
    );
}
