import Navbar from "../components/websites/Navbar.jsx";
import CarReview from "../components/websites/reservation/create-reservation/CarReview.jsx";
import Extras from "../components/websites/reservation/create-reservation/Extras.jsx";
import {useState} from "react";
import UserInfo from "../components/websites/reservation/create-reservation/UserInfo.jsx";
import PriceInformationCard from "../components/websites/reservation/create-reservation/PriceInformationCard.jsx";
import {useTranslation} from "react-i18next";
import axios from "axios";
import ReservationDatePreview from "../components/websites/reservation/ReservationDatePreview.jsx";

export default function SelectExtras({car, params}){
    console.log(car, params) ;
    const {t} = useTranslation();
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [user, setUser] = useState({name: {value: "", error: ""}, surname: {value: "", error: ""}, mail: {value: "", error: ""}, phone: {value: "", error: ""}, address: {value: "", error: ""}, birthday: {value: "", error: ""}, identity: {value: "", error: ""}, arrivalFlightNo: {value: "", error: ""}, returnFlightNo: {value: "", error: ""}, notes: {value: "", error: ""}, isNative: true});
    const [error, setError] = useState();

    const handleSubmit =  () => {
        console.log(user.birthday);
        setError("");
        const requiredFields = ['name', 'surname', 'mail', 'phone', 'address', 'birthday', 'identity'];
        let hasError = false;
        let firstErrorMessage = "";

        for (const key in user) {
            if (user[key].error) {
                hasError = true;
                firstErrorMessage = user[key].error;
                break;
            }
        }

        if (!hasError) {
            for (const field of requiredFields) {
                if (!user[field].value || user[field].value.trim() === "") {
                    hasError = true;
                    firstErrorMessage = t("website.auth.signup.fill_all_required_fields", "Lütfen tüm zorunlu alanları doldurunuz.");
                    break;
                }
            }
        }
        console.log(hasError);
        if (hasError) {
            setError(firstErrorMessage);
            return;
        }
        console.log(1);
        const submissionData = {
            car_id: car.id,
            drop_price: car.drop_price ?? 0,
            total_days: car.total_days,
            daily_price: car.daily_price,
            currency_id: car.currency_id,
            pick_up_location_id: params.PULocation.id,
            return_location_id: params.RLocation.id,
            start_date_time: params.startDateTime,
            finish_date_time: params.finishDateTime,
            extras: JSON.stringify(selectedExtras),
            user_info: {
                name: user.name.value,
                surname: user.surname.value,
                email: user.mail.value,
                notes: user.notes.value,
                phone: user.phone.value,
                address: user.address.value,
                birthday: user.birthday.value,
                id: user.identity.value,
                arrival_flight_no: user.arrivalFlightNo.value,
                return_flight_no: user.returnFlightNo.value,
            }
        };
        console.log(submissionData);
        axios.post('/create-reservation', submissionData)
            .then(res => {
                // Başarılı ise sunucudan gelen veriyi göster
                console.log('Reservation created:', res.data);
                alert('Reservation successfully created!');
            })
            .catch(error => {
                if (error.response) {
                    // Sunucudan gelen hata
                    console.error('Validation errors:', error.response.data.errors || error.response.data);
                    alert('Error: ' + JSON.stringify(error.response.data));
                } else {
                    // Ağ veya başka bir hata
                    console.error('Error:', error.message);
                    alert('An unexpected error occurred.');
                }
            });

    }

    return(
        <>
            <Navbar/>
            <div className={`p-4`}>

                <div className={`flex flex-row gap-4`}>
                    <div className={`basis-7/10 flex flex-col gap-4`}>
                        <CarReview car={car}/>
                        <Extras car={car} selectedExtras={selectedExtras} setSelectedExtras={setSelectedExtras}/>
                        <UserInfo user={user} setUser={setUser}/>
                    </div>
                    <div className={`basis-3/10`}>
                        <ReservationDatePreview pickupDate={params.startDateTime} returnDate={params.finishDateTime} pickupLocation={params.PULocation.name} returnLocation={params.RLocation.name}/>
                        <br/>
                        <PriceInformationCard total_days={car.total_days} daily_price={car.calculated_price.final_daily_price} extra_price={Object.values(selectedExtras).reduce((sum, se) => sum + (se.price ?? 0) * (se.count ?? 1), 0)}/>
                        <br/>
                        {error && <div className="text-red-600 font-bold mb-2">{error}</div>}
                        <button onClick={handleSubmit} type={`button`} className={`px-4 py-1 bg-blue-600 text-white rounded-xl hover:bg-blue-8**`}>Ofiste Öde</button>
                    </div>
                </div>
            </div>
        </>
    );
}
