import DateTimePickerComp from "./DateTimePickerComp.jsx";

export default function DateTime({startDate, setStartDate, endDate, setEndDate}){
    const handleStartDate = (e) => {
        setStartDate(e);
        const ONE_DAY_MS = 86400000;
        if (endDate.getTime() - e.getTime() < ONE_DAY_MS) {
            setEndDate(new Date(e.getTime() + ONE_DAY_MS));
        }
    };
    const handleEndDate = (e) => {
        setEndDate(e);

        const ONE_DAY_MS = 86400000;

        if (e.getTime() - startDate.getTime() < ONE_DAY_MS) {
            setStartDate(new Date(e.getTime() - ONE_DAY_MS));
        }
    };

    return(
        <div className={`flex gap-4 shadow-lg p-8 rounded-lg`}>
            <DateTimePickerComp startDate={startDate} onchange={handleStartDate}/>
            <DateTimePickerComp startDate={endDate} onchange={handleEndDate} start={false}/>
        </div>
    )
}
