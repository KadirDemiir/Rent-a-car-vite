import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import ModifyCar from "../../../components/adminPanel/car/ModifyCar.jsx";
import CarReservations from "../../../components/adminPanel/car/CarReservations.jsx";
import IncomingGraph from "../../../components/adminPanel/car/IncomingGraph.jsx";
import {usePage} from "@inertiajs/react";


export default function Car({success, car}){
    return(
      <div className="w-full">
          < Navbar />
          <div className="pl-64 pt-24 pr-4 w-full">
              <div className="font-bold">
                  {car.license_plate} - {car.brand} {car.model} {car.fuel_type} {car.transmission_type} {car.year}
              </div>
              <hr/><br/><br/>
              {success && (
                  <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
                      {success}
                  </div>
              )}
              <div className="w-full flex flex-col gap-16">
                  < ModifyCar car={car}/>
                <div className="max-h-[40vh] overflow-y-hidden">
                    <span className="font-bold ">Araca Ait Rezervasyonalar </span><span className="text-[14px]">(Detayar İçin Tıklayınız)</span>
                    < CarReservations res={true}/>
                </div>
                <div className="max-h-[40vh] overflow-y-hidden">
                    <span className="font-bold ">Araca Ait Geçmiş Rezervasyonalar </span><span className="text-[14px]">(Detayar İçin Tıklayınız)</span>
                    < CarReservations res={false}/>
                </div>
                < IncomingGraph />
              </div>
          </div>
          <div className="w-full h-100"></div>
      </div>
    );
}
