import CarReservations from "../../../components/adminPanel/car/CarReservations.jsx";
import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import ReservationFilter from "../../../components/adminPanel/ReservationFilter.jsx";

export default function Reservations(){
    return(
        <div className="flex flex-col min-h-[calc(100vh+100px)] w-full">
            < Navbar />
            <div className="flex-1 pl-64 pt-24 w-full pr-4">
              <p className="font-bold text-l">Rezervasyonlar</p>
              <hr />
              <ReservationFilter />
              <div>
                <div className="space-x-4 flex items-center justify-start overflow-y-auto">
                  <span className="font-semibold text-l">Rezervasyonlar</span>
                  <span className="text-[12px]">(Detayları Görüntelemek Ve İşlem Yapmak İçin Tıklayınız.)</span>
                  </div>
                <CarReservations />
              </div>
            </div>
            <div className="h-24 bg-blue-700"></div>
        </div>
    );
}
