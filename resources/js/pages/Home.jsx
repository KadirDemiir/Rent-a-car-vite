import NavBar from '../components/websites/Navbar.jsx';
import SearchReservationForm from '../components/websites/SearchReservationForm.jsx';

export default function Home({locations}) {
    return(
        <div className="">
            <NavBar />
            try try try
            <SearchReservationForm locations={locations}/>
        </div>
    )
}
