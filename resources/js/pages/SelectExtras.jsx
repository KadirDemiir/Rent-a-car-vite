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
import { useCurrency } from "../providers/CurrencyContext.jsx";

export default function SelectExtras({car, auth_user, params}){
    console.log(car, auth_user, params);
    const {t, i18n} = useTranslation();
    const {current} = useCurrency();
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [showErrors, setShowErrors] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(true);
        const submissionData = {
            lang: i18n.language,
            car_id: car.id,
            drop_price: car.drop_price ?? 0,
            total_days: car.total_days,
            daily_price: car.daily_price,
            currency_id: current.id,
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
        axios.post('/create-reservation', submissionData, )
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
            })
            .finally(() => {
                setIsLoading(false);
            });

    }

    return(
        <>
            <Navbar/>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                     
{/*                     <div className="mb-8 bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-center gap-4">
                             <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">✓</div>
                                <span className="hidden sm:inline text-sm font-medium text-gray-600">{t('website.reservation.user_info.title', 'Sürücü Bilgileri')}</span>
                            </div>
                            <div className="h-px w-12 bg-gray-300"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">2</div>
                                <span className="hidden sm:inline text-sm font-medium text-blue-600">...</span>
                            </div> 
                        </div>
                    </div>  */}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <CarReview car={car}/>
                            <IncludedServices />
                            <Extras car={car} selectedExtras={selectedExtras} setSelectedExtras={setSelectedExtras}/>
                            <UserInfo user={user} setUser={setUser} userErrors={userErrors} setUserErrors={setUserErrors} showErrors={showErrors}/>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-4 space-y-4">
                                <ReservationDatePreview 
                                    pickupDate={params.startDateTime} 
                                    returnDate={params.finishDateTime} 
                                    pickupLocation={params.PULocation.name} 
                                    returnLocation={params.RLocation.name}
                                />
                                
                                <PriceInformationCard 
                                    drop_price={car.drop_price ?? 0}
                                    total_days={car.total_days} 
                                    daily_price={car.calculated_price.final_daily_price} 
                                    extra_price={Object.values(selectedExtras).reduce((sum, se) => sum + (se.price ?? 0) * (se.count ?? 1), 0)}
                                />
                                
                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                            </svg>
                                            <span className="text-sm text-red-700 font-medium">{error}</span>
                                        </div>
                                    </div>
                                )}
                                
                                <button 
                                    onClick={handleSubmit} 
                                    type="button" 
                                    disabled={isLoading}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-700 transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-3">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {t('website.reservation.processing', 'İşleniyor...')}
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Ofiste Öde
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
