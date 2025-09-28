import CarReservations from "../../../components/adminPanel/car/CarReservations.jsx";
import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import ReservationFilter from "../../../components/adminPanel/reservations/ReservationFilter.jsx";
import {useTranslation} from "react-i18next";

export default function Reservations(){
    const {t} = useTranslation();
    return(
        <div className="flex flex-col min-h-[calc(100vh+100px)] w-full">
            < Navbar >
                <div className="flex-1">
                  <p className="font-bold text-l">{t("adminpanel.reservation.reservations")}</p>
                  <hr />
                  <ReservationFilter />
                  <div>
                    <div className="space-x-4 flex items-center justify-start overflow-y-auto">
                      <span className="font-semibold text-l">{t("adminpanel.reservation.reservations")}</span>
                      <span className="text-[12px]">({t("adminpanel.reservation.click_to_view_details_and_proceed_with_the_transaction")}.)</span>
                      </div>
                    <CarReservations />
                  </div>
                </div>
            </Navbar>
            <div className="h-24 bg-blue-700"></div>
        </div>
    );
}
