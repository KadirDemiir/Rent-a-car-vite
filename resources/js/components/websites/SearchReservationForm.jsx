import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addDays, startOfDay } from 'date-fns';
import ClockSelector from './clockSelector/ClockSelector.jsx';
import LocationSelector from './locationSelector/LocationSelector.jsx';
import RangeDatePicker from './RangeDatePicker.jsx';

export default function SearchReservation({ locations, defPickupLocation, defReturnLocation, defReturnDate, defReturnClock, defPickupClock, defPickupDate, home = true }) {

    const { i18n, t } = useTranslation();

    const [dateRange, setDateRange] = useState({
        from: defPickupDate ? startOfDay(new Date(defPickupDate)) : startOfDay(new Date(Date.now() + 86400000)),
        to: defReturnDate ? startOfDay(new Date(defReturnDate)) : startOfDay(addDays(new Date(), 2))
    });

    const [selectedPULocation, setSelectedPULocation] = useState(defPickupDate ? defPickupLocation : locations?.[0] ?? "");
    const [selectedRLocation, setSelectedRLocation] = useState(defReturnLocation ? defReturnLocation : locations?.[0] ?? "");

    const [startClock, setStartClock] = useState(defPickupClock ? defPickupClock : "10:00");
    const [finishClock, setFinishClock] = useState(defReturnClock ? defReturnClock : "10:00");

    const [isPUOpen, setIsPUOpen] = useState(false);
    const [isROpen, setIsROpen] = useState(false);

    const upperFirstLetter = (str) => {
        return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    const formatDateTime = (date, time) => {
        if (!date) return '';
        const d = new Date(date);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${time}`;
    };

    const submitHandler = (e) => {
        e.preventDefault();

        if (!dateRange?.from || !dateRange?.to) return;

        const startDateTime = formatDateTime(dateRange.from, startClock);
        const finishDateTime = formatDateTime(dateRange.to, finishClock);
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

    return (
        <div className={`${!home ? 'w-full' : 'max-w-6xl'} mx-auto bg-black/40 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8 border border-white/10 relative z-30  `}>
            {home &&
                <div className="mb-8 flex flex-col items-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide text-center drop-shadow-md">
                        {upperFirstLetter(t('website.home.button.save'))}
                    </h2>
                    <div className="w-16 h-1 bg-red-600 rounded-full mt-3 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                </div>
            }
            <form onSubmit={submitHandler} className={`grid grid-cols-1 gap-6 ${home ? "md:grid-cols-2 lg:gap-8" : "md:flex md:flex-wrap md:items-end"}`}>

                <div className={`min-w-[200px] ${!home && 'md:flex-1'}`}>
                    <label className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
                        <div className="p-1 rounded bg-blue-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-blue-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                        </div>
                        {upperFirstLetter(t('website.home.pick_up_location'))}
                    </label>
                    <div className={`shadow-lg rounded-xl transition-transform hover:scale-[1.01] relative ${isPUOpen ? 'z-40' : 'z-20'}`}>
                        <LocationSelector selectedLocation={selectedPULocation} isOpen={isPUOpen} locations={locations} setSelectedLocation={setSelectedPULocation} setIsOpen={setIsPUOpen} />
                    </div>
                </div>

                <div className={`min-w-50 ${!home && 'md:flex-1'}`}>
                    <label className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
                        <div className="p-1 rounded bg-blue-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-blue-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                        </div>
                        {upperFirstLetter(t('website.home.return_location'))}
                    </label>
                    <div className={`shadow-lg rounded-xl transition-transform hover:scale-[1.01] relative ${isROpen ? 'z-40' : 'z-20'}`}>
                        <LocationSelector selectedLocation={selectedRLocation} isOpen={isROpen} locations={locations} setSelectedLocation={setSelectedRLocation} setIsOpen={setIsROpen} />
                    </div>
                </div>

                <div className={`min-w-[250px] ${!home && 'md:flex-1'}`}>
                    <label className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
                        <div className="p-1 rounded bg-green-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-green-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                        </div>
                        {upperFirstLetter(t('website.home.pick_up_date_and_time'))}
                    </label>
                    <div className="flex gap-2">
                        <div className="flex-[3] shadow-lg rounded-xl overflow-hidden">
                            <RangeDatePicker
                                type="start"
                                range={dateRange}
                                setRange={setDateRange}
                                minDate={new Date()}
                                locale={i18n.language}
                                placeholder={t('website.home.pick_up_date')}
                            />
                        </div>
                        <div className="flex-[1.5] min-w-[100px] shadow-lg rounded-xl overflow-hidden">
                            <ClockSelector onClockChange={setStartClock} selectedClock={startClock} />
                        </div>
                    </div>
                </div>

                <div className={`min-w-[250px] ${!home && 'md:flex-1'}`}>
                    <label className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
                        <div className="p-1 rounded bg-red-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-red-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                        </div>
                        {upperFirstLetter(t('website.home.return_date_and_time'))}
                    </label>
                    <div className="flex gap-2">
                        <div className="flex-[3] shadow-lg rounded-xl overflow-hidden">
                            <RangeDatePicker
                                type="end"
                                range={dateRange}
                                setRange={setDateRange}
                                minDate={new Date()}
                                locale={i18n.language}
                                placeholder={t('website.home.return_date')}
                            />
                        </div>
                        <div className="flex-[1.5] min-w-[100px] shadow-lg rounded-xl overflow-hidden">
                            <ClockSelector onClockChange={setFinishClock} selectedClock={finishClock} />
                        </div>
                    </div>
                </div>

                <div className={`flex items-center justify-center ${home ? 'mt-4 md:col-span-2' : 'min-w-[150px] md:flex-initial md:mt-0 mt-6'}`}>
                    <button
                        type="submit"
                        className={`${home ? 'px-16 py-4 w-full md:w-auto' : 'px-8 py-3 w-full md:w-auto'} bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-red-900/40 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        {upperFirstLetter(t('website.home.button.save'))}
                    </button>
                </div>
            </form>
        </div>
    );
}
