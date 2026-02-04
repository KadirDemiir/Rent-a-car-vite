import Input from "../../formElement/Input.jsx";
import {useTranslation} from "react-i18next";

export default function UserInfo({setUser, user, userErrors, setUserErrors, showErrors = false}){
    const {t} = useTranslation();

    const validateName = (value) => value.trim() === '' ? '*'+t("website.auth.signup.this_area_cannot_be_empty") : '';
    const validateEmail = (value) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '*'+t("website.auth.signup.invalid_email") : '';
    const validatePhone = (value) => value.length < 10 ? '*'+t("website.auth.signup.invalid_phone") : '';
    const validateIdentity = (value) => value.length !== 11 ? '*'+t("website.auth.signup.invalid_identity") : '';
    const validateRequired = (value) => value.trim() === '' ? '*'+t("website.auth.signup.this_area_cannot_be_empty") : '';

    const handleUserChange = (field, value, error) => {
        setUser(prev => ({
            ...prev,
            [field]: value
        }));
        setUserErrors(prev => ({    
            ...prev,
            [field]: error
        }));
    };

    return(
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">{t('website.reservation.user_info.title', 'Sürücü Bilgileri')}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    type={`text`}
                    elementName={"name"}
                    labelName={t('website.auth.signup.name')}
                    onChange={(val, err) => handleUserChange('name', val, err)}
                    validate={validateName}
                    formData={user}
                    errors={userErrors}
                    setFormData={setUser}
                    setErrors={setUserErrors}
                    showErrors={showErrors}
                />
                <Input
                    type={`text`}
                    elementName={"surname"}
                    labelName={t('website.auth.signup.surname')}
                    onChange={(val, err) => handleUserChange('surname', val, err)}
                    validate={validateName}
                    formData={user}
                    errors={userErrors}
                    setFormData={setUser}
                    setErrors={setUserErrors}
                    showErrors={showErrors}
                />
                <Input
                    type={`email`}
                    elementName={"mail"}
                    labelName={t('website.auth.signup.email', 'E-posta')}
                    onChange={(val, err) => handleUserChange('mail', val, err)}
                    validate={validateEmail}
                    formData={user}
                    errors={userErrors}
                    setFormData={setUser}
                    setErrors={setUserErrors}
                    showErrors={showErrors}
                />
                <Input
                    type={`tel`}
                    elementName={"phone"}
                    labelName={t('website.auth.signup.phone', 'Telefon')}
                    onChange={(val, err) => handleUserChange('phone', val, err)}
                    validate={validatePhone}
                    formData={user}
                    errors={userErrors}
                    setFormData={setUser}
                    setErrors={setUserErrors}
                    showErrors={showErrors}
                />
                <Input
                    type={`text`}
                    elementName={"identity"}
                    labelName={t('website.auth.signup.identity_number', 'T.C. Kimlik No')}
                    onChange={(val, err) => handleUserChange('identity', val, err)}
                    validate={validateIdentity}
                    maxV={11}
                    formData={user}
                    errors={userErrors}
                    setFormData={setUser}
                    setErrors={setUserErrors}
                    showErrors={showErrors}
                />
                <Input
                    type={`date`}
                    elementName={"birthday"}
                    labelName={t('website.auth.signup.birthday', 'Doğum Tarihi')}
                    onChange={(val, err) => handleUserChange('birthday', val, err)}
                    validate={validateRequired}
                    formData={user}
                    errors={userErrors}
                    setFormData={setUser}
                    setErrors={setUserErrors}
                    showErrors={showErrors}
                />
                <div className="col-span-1 md:col-span-2">
                    <Input
                        type={`text`}
                        elementName={"address"}
                        labelName={t('website.auth.signup.address', 'Adres')}
                        onChange={(val, err) => handleUserChange('address', val, err)}
                        validate={validateRequired}
                        formData={user}
                        errors={userErrors}
                        setFormData={setUser}
                        setErrors={setUserErrors}
                        showErrors={showErrors}
                    />
                </div>
                <Input
                    type={`text`}
                    elementName={"arrivalFlightNo"}
                    labelName={t('website.reservation.user_info.arrival_flight', 'Geliş Uçuş No (Opsiyonel)')}
                    onChange={(val, err) => handleUserChange('arrivalFlightNo', val, err)}
                    formData={user}
                    errors={userErrors}
                    setFormData={setUser}
                    setErrors={setUserErrors}
                    showErrors={showErrors}
                />
                <Input
                    type={`text`}
                    elementName={"returnFlightNo"}
                    labelName={t('website.reservation.user_info.return_flight', 'Dönüş Uçuş No (Opsiyonel)')}
                    onChange={(val, err) => handleUserChange('returnFlightNo', val, err)}
                    formData={user}
                    errors={userErrors}
                    setFormData={setUser}
                    setErrors={setUserErrors}
                    showErrors={showErrors}
                />
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">NOT</label>
                    <textarea 
                        onChange={(e) => handleUserChange('notes', e.target.value, "")} 
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none h-24"
                        placeholder="..."
                        defaultValue={user?.notes}
                    />
                </div>
            </div>
        </div>
    );
}
