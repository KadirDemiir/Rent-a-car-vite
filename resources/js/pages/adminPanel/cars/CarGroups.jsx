import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import { CarGroupTable } from "../../../components/adminPanel/car/CarTable";

export default function CarGroups({ cars = [] }) {
    console.log(cars);
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar>
                <CarGroupTable carGroups={cars} />
            </Navbar>
        </div>
    );
}
