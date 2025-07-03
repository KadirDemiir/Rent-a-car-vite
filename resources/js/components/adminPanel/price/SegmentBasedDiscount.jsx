import SelectOptions from "../../websites/filterSelectors/SelectOptions.jsx";
import {useEffect, useState} from "react";
import DateTimePickerComp from "./DateTimePickerComp.jsx";

export default function SegmentBasedDiscount(){
    const options = [
        {label: "Economi", value: "economy"},
        {label: "Compact", value: "compact"},
        {label: "Orta Sınıf", value: "midrange"},
        {label: "Premium", value: "premium"},
    ];

    const [value, setValue] = useState(options[0].value);
    const [startDate, setStartDate] = useState(new Date());
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
    const segmentHandler = (e) => {setValue(e)};

    const ha = (e) => {
        e.preventDefault();
        console.log("start date: ", startDate);
        console.log("end date: ", endDate);
    }

    return(
        <div className="sm:grid md:grid-cols-4 gap-8 p-8 w-full border border-blue-500 rounded-xl">
            <h3 className={`text-l font-semibold md:col-span-4 flex items-center justify-center`}>Segment Bazlı İndirim</h3>
            <div>
                <SelectOptions
                    value={value}
                    options={options}
                    onChange={segmentHandler}
                    options_name={"Segment seçiniz"}
                />
            </div>
            <div>
                <div>{value} için indirim oranı</div>
                <input type="text" className="w-full p-2 border border-gray-500 rounded-md"/>
            </div>
            <DateTimePickerComp startDate={startDate} onchange={startOnChange} />
            <DateTimePickerComp startDate={endDate} onchange={endOnChange} start={false}/>
            <div className={`md:col-span-4 flex items-end justify-center`}>
                <button onClick={ha} type="button" className={`w-32 p-2 text-white rounded-xl bg-blue-500 hover:bg-blue-700 cursor-pointer`}>Kaydet</button>
            </div>
        </div>
    );
}
