import Navbar from "../components/websites/Navbar.jsx";
import CarReview from "../components/websites/reservation/create-reservation/CarReview.jsx";
import Extras from "../components/websites/reservation/create-reservation/Extras.jsx";

export default function SelectExtras({car}){
    return(
        <>
            <Navbar/>
            <div className={`p-4`}>
                <div className={`flex flex-row`}>
                    <div className={`basis-7/10 flex flex-col gap-4`}>
                        <CarReview car={car}/>
                        <Extras/>
                    </div>
                    <div className={`basis-3/10`}>
                        d
                    </div>
                </div>
            </div>
        </>
    );
}
