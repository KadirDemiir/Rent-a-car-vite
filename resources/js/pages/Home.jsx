import NavBar from '../components/websites/Navbar.jsx';
import SearchReservationForm from '../components/websites/SearchReservationForm.jsx';

export default function Home({locations}) {
    return(
        <div className="w-full">
            <div className="relative h-screen w-full flex flex-col">
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" style={{backgroundImage: "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070')"}}>
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-gray-800/60 to-gray-900/70 backdrop-blur-[2px]"></div>
                </div>
                <div className="relative z-10 flex flex-col h-full">
                    <NavBar />
                    <div className="flex-grow flex items-center justify-center px-4">
                        <div className="w-full">
                             <SearchReservationForm locations={locations} home={true}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}