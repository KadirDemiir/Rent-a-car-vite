import DateTimePickerComp from "./DateTimePickerComp.jsx";
import {useEffect, useState} from "react";

export default function AllCarsDiscount(){
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
    return(
        <div className="sm:grid md:grid-cols-3 gap-8 p-8 w-full border border-blue-500 rounded-xl">
            <h3 className={`text-l font-semibold md:col-span-4 flex items-center justify-center`}>Tüm Arabalar İçn İndirim</h3>
            <div className={`flex flex-col items-center justify-center`}>
                <div>Tüm Araçlar için indirim oranı</div>
                <input type="text" className=" p-2 border border-gray-500 rounded-md"/>
            </div>
            <DateTimePickerComp startDate={startDate} onchange={startOnChange} />
            <DateTimePickerComp startDate={endDate} onchange={endOnChange} start={false}/>
            <div className={`md:col-span-4 flex items-end justify-center`}>
                <button type="button" className={`w-32 p-2 text-white rounded-xl bg-blue-500 hover:bg-blue-700 cursor-pointer`}>Kaydet</button>
            </div>
        </div>
    );
}
