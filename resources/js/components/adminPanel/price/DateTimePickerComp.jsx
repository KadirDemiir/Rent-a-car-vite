import DatePicker from "react-datepicker";

export default function DateTimePickerComp({startDate, onchange, start = true}){
    const header = start ? "Başlangıç" : "Bitiş";
    return(
        <div className="flex flex-col items-center justify-center">
            <div>{header} Tarihini Seçiniz</div>
            <DatePicker
                className="w-full flex items-center justify-center p-2 border border-gray-500 rounded-md"
                minDate={startDate}
                selected={startDate}
                onChange={onchange}
                dateFormat="MMMM d, yyyy"
            />
        </div>
    );
}
