import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import ModifyCar from "../../../components/adminPanel/car/ModifyCar.jsx";
import CarReservations from "../../../components/adminPanel/car/CarReservations.jsx";
import IncomingGraph from "../../../components/adminPanel/car/IncomingGraph.jsx";
import {useEffect, useState} from "react";
import axios from "axios";


export default function Car({id}){
    console.log(id);
    const [car, setCar] = useState(null);
    const [reservations, setReservations] = useState(null);
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/get-car-information/${id}`);
            setCar(response.data.car);
            setReservations(response.data.car.reservations)
            console.log(response.data.car);
        } catch (error) {
            console.log(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!car) return <div>Car not found</div>;
    return(
      <div className="w-full">
          < Navbar>
              <div className="font-bold">
                  {car?.license_plate} - {car?.brand} {car?.model} {car?.fuel_type} {car?.transmission_type} {car?.year}
              </div>
              <hr/><br/><br/>
              {success && (
                  <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
                      {success}
                  </div>
              )}
              <div className="w-full flex flex-col gap-16">
                  < ModifyCar car={car} setSuccess={setSuccess}/>
                <div className="max-h-[40vh] overflow-y-hidden">
                    <span className="font-bold ">Araca Ait Rezervasyonalar </span><span className="text-[14px]">(Detayar İçin Tıklayınız)</span>
                    < CarReservations updateData={fetchData} allReservations={reservations} past={false}/>
                </div>
                <div className="max-h-[40vh] overflow-y-hidden">
                    <span className="font-bold ">Araca Ait Geçmiş Rezervasyonalar </span><span className="text-[14px]">(Detayar İçin Tıklayınız)</span>
                    < CarReservations updateData={fetchData} allReservations={reservations} current={false}/>
                </div>
                < IncomingGraph />
              </div>
          </Navbar>
          <div className="w-full h-100"></div>
      </div>
    );
}
