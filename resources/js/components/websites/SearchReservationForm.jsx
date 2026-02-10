import { router } from '@inertiajs/react';
import { useState, useEffect, forwardRef, lazy, Suspense } from 'react';
import { tr, enUS } from 'date-fns/locale';
import ClockSelector from './clockSelector/ClockSelector.jsx';
import LocationSelector from './locationSelector/LocationSelector.jsx';
import { useTranslation } from 'react-i18next';
const DatePicker = lazy(async () => {
    const [module] = await Promise.all([
        import('react-datepicker'),
        import('react-datepicker/dist/react-datepicker.css')
    ]);

    module.registerLocale('tr', tr);
    module.registerLocale('en', enUS);

    return module;
});

const supportedLocales = ['tr', 'en'];

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <input
        className="w-full h-12 px-4 rounded-xl outline-none cursor-pointer transition-colors text-gray-800 font-medium "
        onClick={onClick}
        value={value}
        placeholder={placeholder}
        ref={ref}
        readOnly
    />
));

export default function SearchReservation({locations, defPickupLocation, defReturnLocation, defReturnDate, defReturnClock, defPickupClock, defPickupDate, home=true }) {
    const clocks = ["00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];

    const {i18n, t } = useTranslation();
    const [startDate, setStartDate] = useState(defPickupDate ? defPickupDate : new Date(Date.now() + 86400000));
    const [finishDate, setFinishDate] = useState(defReturnDate ? defReturnDate : '');
    const [selectedPULocation, setSelectedPULocation] = useState(defPickupDate ? defPickupLocation : locations?.[0] ?? "");
    const [selectedRLocation, setSelectedRLocation] = useState(defReturnLocation ? defReturnLocation : locations?.[0] ?? "");
    const [startClock, setStartClock] = useState(defPickupClock ? defPickupClock : clocks[20]);
    const [finishClock, setFinishClock] = useState(defReturnClock ? defReturnClock : clocks[20]);
    const [isPUOpen, setIsPUOpen] = useState(false);
    const [isROpen, setIsROpen] = useState(false);
    const [minFinish, setMinFinish] = useState(new Date(startDate));

    const upperFirstLetter = (str) => {
        return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    useEffect(() => {
        const newMinFinish = new Date(startDate);
        newMinFinish.setDate(newMinFinish.getDate() + 2);
        setMinFinish(newMinFinish);
    }, [startDate]);

    useEffect(() => {
        if (!defReturnDate) {
            const newFinishDate = new Date(startDate);
            newFinishDate.setDate(newFinishDate.getDate() + 1);
            setFinishDate(newFinishDate);
        }
        const oneDayLater = new Date(startDate);
        oneDayLater.setDate(oneDayLater.getDate() + 1);

        if (new Date(finishDate) < oneDayLater){
            const newFinishDate = new Date(startDate);
            newFinishDate.setDate(newFinishDate.getDate() + 1);
            setFinishDate(newFinishDate);
        }
    }, [startDate]);

    const formatDateTime = (date, time) => {
        const d = new Date(date);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${time}`;
    };

    // Helper helper for display format inside CustomInput fallback
    const formatDisplayDate = (date) => {
        if(!date) return "";
        const d = new Date(date);
        return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
    }

    const submitHandler = (e) => {
        e.preventDefault();
        const startDateTime = formatDateTime(startDate, startClock);
        const finishDateTime = formatDateTime(finishDate, finishClock);
        const PULocation = selectedPULocation.id;
        const RLocation = selectedRLocation.id;

        const formData = {
            startDateTime,
            finishDateTime,
            PULocation,
            RLocation
        };

        router.get(`/${i18n.language}/${t('address.searchReservations')}`, formData);
    };

    const currentLocale = supportedLocales.includes(i18n.language) ? i18n.language : 'en';

    return (
        <div className={`${!home ? 'w-full' : 'max-w-5xl'} mx-auto bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/30 relative z-10`}>
            {home &&
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
                        {upperFirstLetter(t('website.home.button.save'))}
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-gray-600 to-gray-400 mx-auto rounded-full"></div>
                </div>
            }
            <form onSubmit={submitHandler} className={`grid grid-cols-1 gap-6 ${home ? "md:grid-cols-2" : "md:flex md:flex-wrap md:items-end"}`}>
                <div className={`min-w-[200px] ${!home && 'md:flex-1'}`}>
                    <label className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        {upperFirstLetter(t('website.home.pick_up_location'))}
                    </label>
                    <LocationSelector selectedLocation={selectedPULocation} isOpen={isPUOpen} locations={locations} setSelectedLocation={setSelectedPULocation} setIsOpen={setIsPUOpen}/>
                </div>

                <div className={`min-w-[200px] ${!home && 'md:flex-1'}`}>
                    <label className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        {upperFirstLetter(t('website.home.return_location'))}
                    </label>
                    <LocationSelector selectedLocation={selectedRLocation} isOpen={isROpen} locations={locations} setSelectedLocation={setSelectedRLocation} setIsOpen={setIsROpen}/>
                </div>

                <div className={`min-w-[250px] ${!home && 'md:flex-1'}`}>
                    <label className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        {upperFirstLetter(t('website.home.pick_up_date_and_time'))}
                    </label>
                    <div className="flex gap-2 border border-white/40 bg-white/70 rounded-xl px-2 shadow-sm">
                        <div className="flex-4 flex items-center justify-start">
                            <Suspense fallback={<CustomInput value={formatDisplayDate(startDate)} />}>
                                <DatePicker
                                    minDate={new Date()}
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    dateFormat="dd.MM.yyyy"
                                    locale={currentLocale}
                                    customInput={<CustomInput />}
                                />
                            </Suspense>
                        </div>
                        <div className="flex-1 flex items-center justify-start">
                            <ClockSelector onClockChange={setStartClock} selectedClock={startClock} />
                        </div>
                    </div>
                </div>

                <div className={`min-w-[250px] ${!home && 'md:flex-1'}`}>
                    <label className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        {upperFirstLetter(t('website.home.return_date_and_time'))}
                    </label>
                    <div className="flex gap-2 border border-white/40 bg-white/70 rounded-xl px-2 shadow-sm">
                        <div className="flex-4 flex items-center justify-start">
                            <Suspense fallback={<CustomInput value={formatDisplayDate(finishDate)} />}>
                                <DatePicker
                                    minDate={minFinish}
                                    selected={finishDate}
                                    onChange={(date) => setFinishDate(date)}
                                    dateFormat="dd.MM.yyyy"
                                    locale={currentLocale}
                                    customInput={<CustomInput />}
                                />
                            </Suspense>
                        </div>
                        <div className="flex-1 flex items-center justify-start">
                            <ClockSelector onClockChange={setFinishClock} selectedClock={finishClock} />
                        </div>
                    </div>
                </div>

                <div className={`flex items-center justify-center ${home ? 'mt-6 md:col-span-2' : 'min-w-[150px] md:flex-initial md:mt-0 mt-6'}`}>
                    <button
                        type="submit"
                        className={`${home ? 'px-12 py-4' : 'px-8 py-3 w-full md:w-auto'} bg-gradient-to-r from-gray-700 to-gray-700 hover:from-gray-800 hover:to-gray-900 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        {upperFirstLetter(t('website.home.button.save'))}
                    </button>
                </div>
            </form>
        </div>
    );
}
