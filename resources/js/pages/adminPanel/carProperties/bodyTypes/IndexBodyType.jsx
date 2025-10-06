import Navbar from "../../../../components/adminPanel/navbar/Navbar.jsx";
import BodyTypeForm from "../../../../components/adminPanel/carProperties/BodyTypeForm.jsx";

export default function IndexBodyType({languages, bt}){
    return(
        <div className={`w-full`}>
            <Navbar >
                <BodyTypeForm lngs={languages} bt={bt}/>
            </Navbar>
        </div>
    );
}
