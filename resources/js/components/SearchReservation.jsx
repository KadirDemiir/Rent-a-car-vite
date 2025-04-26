import { router } from '@inertiajs/react';
import { useState , useEffect} from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ClockSelector from './clockSelector/ClockSelector';
import LocationSelector from './locationSelector/LocationSelector';
import { forwardRef } from 'react';

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <input
    className="w-52 h-12 text-center rounded-md outline-none cursor-pointer"
    onClick={onClick}
    value={value}
    ref={ref}
    readOnly
  />
));

export default function SearchReservation() {

    const clocks = ["00.00", "00.30", "01.00", "01.30", "02.00", "02.30", "03.00", "03.30", "04.00", "04.30", "05.00", "05.30", "06.00", "06.30", "07.00", "07.30", "08.00", "08.30", "09.00", "09.30", "10.00", "10.30", "11.00", "11.30", "12.00", "12.30", "13.00", "13.30", "14.00", "14.30", "15.00", "15.30", "16.00", "16.30", "17.00", "17.30", "18.00", "18.30", "19.00", "19.30", "20.00", "20.30", "21.00", "21.30", "22.00", "22.30", "23.00", "23.30"]
    const locations = ["Ankara", "İstanbul", "Antalya", "İzmir", "Nevşehir", "Kayseri", "Mersin", "Muğla", "Bursa"];
    
    const minFinish = () => {
        let temp = new Date(startDate);
        temp.setDate(temp.getDate() + 2)
        return temp;
    };

    const [startDate, setStartDate] = useState(new Date());
    const [finishDate, setFinishDate] = useState(minFinish);
    const [selectedPULocation, setSelectedPULocation] = useState(locations[0]);
    const [selectedRLocation, setSelectedRLocation] = useState(locations[0]);
    const [startClock, setStartClock] = useState(clocks[20]);
    const [finishClock, setFinishClock] = useState(clocks[20]);
    const [isPUOpen, setIsPUOpen] = useState(false);
    const [isROpen, setIsROpen] = useState(false);



    useEffect(() => {
        const newFinishDate = new Date(startDate);
        newFinishDate.setDate(newFinishDate.getDate() + 1); 
        setFinishDate(newFinishDate);
      }, [startDate]);

      const submitHandler = (e) => {
        e.preventDefault();
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');    const formData = {
            startDate,
            finishDate,
            selectedPULocation,
            selectedRLocation,
            startClock,
            finishClock
        };
        router.post('/searchReservation', formData, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
            },
        });
      }
    


    return (
        <div className="p-4">
            <form onSubmit={submitHandler} action="" className="flex items-center justify-center  gap-4">
                <div className="relative w-80" tabIndex={-1}>
                    <div className="w-full">
                        <div className="flex items-center justify-center mb-2">Pick Up Location</div>
                        <LocationSelector 
                        selectedLocation={selectedPULocation} 
                        isOpen={isPUOpen}
                        locations={locations}
                        setSelectedLocation={setSelectedPULocation}
                        setIsOpen={setIsPUOpen}
                        />
                    </div>
                </div>

                <div className="relative w-80" tabIndex={-1}>
                <div className="w-full">
                    <div className="flex items-center justify-center mb-2">Return Location</div>
                        <LocationSelector 
                        selectedLocation={selectedRLocation} 
                        isOpen={isROpen}
                        locations={locations}
                        setSelectedLocation={setSelectedRLocation}
                        setIsOpen={setIsROpen}
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <div>
                        <div className="flex items-center justify-center mb-2">Pickup Date & Time</div>
                        <div className="h-12 w-72 border rounded-md flex">
                            <DatePicker
                            minDate={new Date()}
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="MMMM d, yyyy"
                            className="w-52 h-12 text-center rounded-md outline-none"
                            customInput={<CustomInput />}
                            />

                           <ClockSelector
                           onClockChange={setStartClock}
                           startClock={startClock}
                           />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-center mb-2">Return Date & Time</div>
                        <div className="h-12 w-72 border rounded-md flex">
                            <DatePicker
                            minDate={minFinish()}
                            selected={finishDate}
                            onChange={(date) => setFinishDate(date)}
                            dateFormat="MMMM d, yyyy"
                            customInput={<CustomInput />}
                            />

                            <ClockSelector
                           onClockChange={setFinishClock}
                           startClock={finishClock}
                           />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center mt-8">
                    <button type="submit" className="h-12 w-28 bg-blue-600 hover:bg-blue-700 text-xl font-bold text-white rounded-md cursor-pointer">Search</button>
                </div>

            </form>
        </div>
    );
}