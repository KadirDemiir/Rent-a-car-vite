import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import {VehicleTable} from "../../../components/adminPanel/car/CarTable/index.jsx";

export default function Cars({ cars = [] }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar>
                <VehicleTable vehicles={cars} />
            </Navbar>
        </div>
    );
}
