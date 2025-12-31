import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import CarTable from "../../../components/adminPanel/car/CarTable.jsx";

export default function Cars({cars}){
    return(
        <div className="min-h-screen bg-gray-50">
            <Navbar>
{/*                <section className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            {t("adminpanel.cars.filter.filter_label")}
                        </p>
                        <h1 className="text-2xl font-semibold text-gray-900">{pageTitle}</h1>
                        <p className="text-sm text-gray-500">{pageDescription}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">{totalLabel}</p>
                        <p className="text-3xl font-semibold text-gray-900">{totalCars}</p>
                    </div>
                </section>*/}
              <CarTable cars={cars}/>
            </Navbar>
        </div>
    );
}
