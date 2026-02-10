import NavBar from '../components/websites/Navbar.jsx';
import SearchReservationForm from '../components/websites/SearchReservationForm.jsx';

export default function Home({locations}) {
    return(
        <div className="w-full">
            <div className="relative h-dvh w-full flex flex-col overflow-hidden bg-gray-950">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-900/40 blur-[130px] opacity-70"></div>
                    <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-900/30 blur-[150px] opacity-60"></div>
                    <div className="absolute inset-0 bg-linear-to-br from-gray-950/80 via-gray-900/50 to-gray-950/80 backdrop-blur-[1px]"></div>
                </div>
                <div className="relative z-10 flex flex-col h-full">
                    <NavBar />
                    <div className="grow flex items-center justify-center px-4">
                        <div className="w-full">
                            <SearchReservationForm locations={locations} home={true}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
