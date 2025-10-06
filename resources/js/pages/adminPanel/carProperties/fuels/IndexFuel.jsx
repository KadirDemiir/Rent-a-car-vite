import FuelTypeForm from "../../../../components/adminPanel/carProperties/FuelTypeForm.jsx";
import Navbar from "../../../../components/adminPanel/navbar/Navbar.jsx";

export default function IndexFuel({languages, fuel}){
    return(
        <div className={`w-full`}>
            <Navbar >
                <FuelTypeForm lngs={languages} fuel={fuel} mode='update'/>
            </Navbar>
        </div>
    );
}
