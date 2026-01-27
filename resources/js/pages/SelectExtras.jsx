import Navbar from "../components/websites/Navbar.jsx";
import CarReview from "../components/websites/reservation/create-reservation/CarReview.jsx";
import Extras from "../components/websites/reservation/create-reservation/Extras.jsx";
import {useState} from "react";
import UserInfo from "../components/websites/reservation/create-reservation/UserInfo.jsx";
import PriceInformationCard from "../components/websites/reservation/create-reservation/PriceInformationCard.jsx";
import {useTranslation} from "react-i18next";
import axios from "axios";
import ReservationDatePreview from "../components/websites/reservation/ReservationDatePreview.jsx";
import IncludedServices from "../components/websites/reservation/create-reservation/IncludeServicesList.jsx";

export default function SelectExtras({car, auth_user, params}){
    console.log(car, auth_user, params);
    const {t} = useTranslation();
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [showErrors, setShowErrors] = useState(false);
    const [user, setUser] = useState({
        name: auth_user?.name ?? "",
        surname: auth_user?.surname ?? "",
        mail: auth_user?.email ?? "",
        phone: auth_user?.phone_number ?? "",
        address: auth_user?.address ?? "",
        birthday: auth_user?.birthday ?? "",
        identity: auth_user?.tc_number ?? "",
        arrivalFlightNo: "",
        returnFlightNo: "",
        notes: "",
        isNative: true
    });
    const [userErrors, setUserErrors] = useState({
        name: "",
        surname: "",
        mail: "",
        phone: "",
        address: "",
        birthday: "",
        identity: "",
        arrivalFlightNo: "",
        returnFlightNo: "",
        notes: ""
    });
    const [error, setError] = useState();

    // Validation functions
    const validateName = (value) => value.trim() === '' ? '*'+t("website.auth.signup.this_area_cannot_be_empty") : '';
    const validateEmail = (value) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '*'+t("website.auth.signup.invalid_email") : '';
    const validatePhone = (value) => value.length < 10 ? '*'+t("website.auth.signup.invalid_phone") : '';
    const validateIdentity = (value) => value.length !== 11 ? '*'+t("website.auth.signup.invalid_identity") : '';
    const validateRequired = (value) => value.trim() === '' ? '*'+t("website.auth.signup.this_area_cannot_be_empty") : '';

    const handleSubmit =  () => {
        console.log(user.birthday);
        setError("");
        setShowErrors(true);
        
        // Validate all fields and set errors
        const validationErrors = {
            name: validateName(user.name || ''),
            surname: validateName(user.surname || ''),
            mail: validateEmail(user.mail || ''),
            phone: validatePhone(user.phone || ''),
            address: validateRequired(user.address || ''),
            birthday: validateRequired(user.birthday || ''),
            identity: validateIdentity(user.identity || ''),
            arrivalFlightNo: '',
            returnFlightNo: '',
            notes: ''
        };
        
        setUserErrors(validationErrors);
        
        const requiredFields = ['name', 'surname', 'mail', 'phone', 'address', 'birthday', 'identity'];
        let hasError = false;
        let firstErrorMessage = "";

        for (const field of requiredFields) {
            if (validationErrors[field]) {
                hasError = true;
                firstErrorMessage = validationErrors[field];
                break;
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
                name: user.name,
                surname: user.surname,
                email: user.mail,
                notes: user.notes,
                phone: user.phone,
                address: user.address,
                birthday: user.birthday,
                id: user.identity,
                arrival_flight_no: user.arrivalFlightNo,
                return_flight_no: user.returnFlightNo,
            }
        };
        console.log(submissionData);
        axios.post('/create-reservation', submissionData)
            .then(res => {
                console.log('Reservation created:', res.data);
                alert('Reservation successfully created!');
            })
            .catch(error => {
                if (error.response) {
                    console.error('Validation errors:', error.response.data.errors || error.response.data);
                    alert('Error: ' + JSON.stringify(error.response.data));
                } else {
                    console.error('Error:', error.message);
                    alert('An unexpected error occurred.');
                }
            });

    }

    return(
        <>
            <Navbar/>
            <div className={`p-4`}>

                <div className={`flex flex-col lg:flex-row gap-4`}>
                    <div className={`w-full lg:basis-7/10 flex flex-col gap-4`}>
                        <CarReview car={car}/>

                        <IncludedServices />

                        <Extras car={car} selectedExtras={selectedExtras} setSelectedExtras={setSelectedExtras}/>
                        <UserInfo user={user} setUser={setUser} userErrors={userErrors} setUserErrors={setUserErrors} showErrors={showErrors}/>
                    </div>
                    <div className={`w-full lg:basis-3/10`}>
                        <ReservationDatePreview pickupDate={params.startDateTime} returnDate={params.finishDateTime} pickupLocation={params.PULocation.name} returnLocation={params.RLocation.name}/>
                        <br/>
                        <PriceInformationCard total_days={car.total_days} daily_price={car.calculated_price.final_daily_price} extra_price={Object.values(selectedExtras).reduce((sum, se) => sum + (se.price ?? 0) * (se.count ?? 1), 0)}/>
                        <br/>
                        {error && <div className="text-red-600 font-bold mb-2">{error}</div>}
                        <button onClick={handleSubmit} type={`button`} className={`px-4 py-1 bg-blue-600 text-white rounded-xl hover:bg-blue-8** w-full`}>Ofiste Öde</button>
                    </div>
                </div>
            </div>
        </>
    );
}
