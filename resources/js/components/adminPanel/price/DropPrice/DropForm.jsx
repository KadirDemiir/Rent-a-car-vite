import {useTranslation} from "react-i18next";

export default function DropForm({handleSubmit, opt, data, setData, error, setError, minZero = true, pickup = null}) {
    console.log(data)
    const {t} = useTranslation();
    const handleInputOnchange = (e) => {
        const {name, value} = e.target;
        const regex = /^\d*\.?\d*$/;
        setData(prev => ({
            ...prev,
            [name]: {...prev[name], value},
        }));
        if (value === "") {
            setError(prev => {
                const errs = {...prev};
                delete errs[name];
                return errs;
            });
            return;
        }
        if (!regex.test(value)) {
            setError(prev => ({
                ...prev,
                [name]: "Geçersiz Karakter, Lütfen Sadece Sayı Giriniz."
            }));
        } else if ((minZero && value < 0) || (!minZero && value <= 0)) {
            setError(prev => ({
                ...prev,
                [name]: minZero ? "Lütfen 0 Veya Daha Büyük Bir Sayı Giriniz" : "Lütfen 0'dan Büyük Bir Sayı Giriniz"
            }));
        } else {
            setError(prev => {
                const newErrors = {...prev};
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    return (
        <>
            {opt.map((s, index) => {
                const name = minZero ? s : t(`segment.${s}`);
                return(
                <div key={index} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 text-center">{name}</label>
                    <input
                        name={s}
                        value={data[s]?.value || ""}
                        onChange={handleInputOnchange}
                        placeholder={`${minZero ? `${pickup}-${s}` : s}`}
                        className={`w-full rounded-2xl border bg-white p-3 text-sm outline-none ${error[s] ? "border-red-500" : "border-gray-300"}`}
                    />
                    {error[s] && <div className="text-sm text-center text-red-500">{error[s]}</div>}
                </div>
            )})}
            <div className="md:col-span-full flex justify-end">
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="rounded-2xl bg-blue-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
                >
                    {t("adminpanel.pricing.drop_price.locations_price.save")}
                </button>
            </div>
        </>
    );
}
