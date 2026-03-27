import CarReservations from "../../../components/adminPanel/car/CarReservations.jsx";
import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import ReservationFilter from "../../../components/adminPanel/reservations/ReservationFilter.jsx";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import axios from "axios";

export default function Reservations({}){
    const {t} = useTranslation();
    const [allRes, setAllRes] = useState();
    const [res, setRes] = useState();
    const [loading, setLoading] = useState(true);
    const fetchData = async () => {
        await axios.get('/get-reservations-informations')
            .then(response => {
                setRes(response.data.reservations);
                setAllRes(response.data.reservations);
            })
            .catch(error => console.log(error.response.error))
    }
    useEffect(() => {
        fetchData();
        setLoading(false);
    }, []);
    if(loading) return <div>Loading...</div>
    return(
        <div className="flex flex-col min-h-[calc(100vh+100px)] w-full">
            <Navbar>
                <div className="flex-1">
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{t("adminpanel.reservation.reservations")}</h1>
                    <p className="text-sm text-gray-500">{t("adminpanel.reservation.reservations")}</p>
                  </div>
                  <ReservationFilter originalRes={allRes} res={res} setRes={setRes}/>
                  <div className="mt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">{t("adminpanel.reservation.reservations")}</h2>
                      <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{t("adminpanel.reservation.click_to_view_details_and_proceed_with_the_transaction")}</span>
                    </div>
                    <CarReservations allReservations={res} updateData={fetchData}/>
                  </div>
                </div>
            </Navbar>
            <div className="h-24 bg-gradient-to-t from-gray-900 to-gray-800"></div>
        </div>
    );
}
