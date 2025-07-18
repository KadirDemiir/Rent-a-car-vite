import DateTimePickerComp from "./DateTimePickerComp.jsx";
import {useEffect, useState} from "react";
import SelectOptions from "../../websites/filterSelectors/SelectOptions.jsx";

export default function AllCarsDiscount(){
    const [startDate, setStartDate] = useState(new Date());
    const [discountType, setDiscountType] = useState("fixed");
    const [endDate, setEndDate] = useState(() => {
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay;
    });

    useEffect(() => {
        if (endDate <= startDate) {
            const nextDay = new Date(startDate);
            nextDay.setDate(nextDay.getDate() + 1);
            setEndDate(nextDay);
        }
    }, [startDate]);
    const startOnChange = (e) => setStartDate(e);
    const endOnChange = (e) => setEndDate(e);
    return(
        <div className="sm:grid md:grid-cols-4 gap-8 w-full">
            <h3 className={`text-l font-semibold md:col-span-4 flex items-center justify-center`}>Tüm Arabalar İçn İndirim</h3>
            <div>
                <SelectOptions value={discountType} options={[{label:"Sabit Tutar İndirim", value:"fixed"},{label:"Yüzde İndirim", value:"percantage"}]} onChange={(e)=>setDiscountType(e)} options_name="İndirim Tipi"/>
            </div>
            <div className={`flex flex-col items-center justify-center`}>
                <div>Tüm Araçlar için indirim  {discountType === "percantage" ? "oranı" : "tutarı"}</div>
                <input type="text" className=" p-2 border border-gray-500 rounded-md"/>
            </div>
            <DateTimePickerComp startDate={startDate} onchange={startOnChange} />
            <DateTimePickerComp startDate={endDate} onchange={endOnChange} start={false}/>
        </div>
    );
}
