import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import DropLocations from "../../../components/adminPanel/price/DropPrice/DropLocations.jsx";
import DropCoefficient from "../../../components/adminPanel/price/DropPrice/DropCoefficient.jsx";

export default function DropPrice({locations, dropPrice, segments, success, general}){

    return(
        <div className="w-full h-600">
            <Navbar />
            <div className="pl-64 pt-24 pr-4">
                {success && <div className={`p-2 border-l-12 border-green-600 bg-green-400 text-white`}>{success}</div>}
                {general && <div className={`p-2 border-l-12 border-red-600 bg-red-400 text-white`}>{general}</div>}
                <DropCoefficient segments={segments}/>
                <br/><br/>
                <DropLocations locations={locations} dropPrice={dropPrice
                }/>
            </div>
        </div>
    );
}
