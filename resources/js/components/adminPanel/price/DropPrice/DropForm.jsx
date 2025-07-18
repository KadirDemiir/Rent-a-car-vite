export default function DropForm({ handleSubmit, opt, data, setData, error, setError, minZero = true, pickup = null}) {
    const handleInputOnchange = (e) => {
        const { name, value } = e.target;
        const regex = /^\d*\.?\d*$/;
        setData(prev => ({
            ...prev,
            [name]: { ...prev[name], value }
        }));
        if(value === ""){
            setError(prev => {
                const errs = { ...prev };
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
        }else if((minZero && value < 0) || (!minZero && value <= 0)){
            setError(prev => ({
                ...prev,
                [name]: minZero ? "Lütfen 0 Veya Daha Büyük Bir Sayı Giriniz" : "Lütfen 0'dan Büyük Bir Sayı Giriniz"
            }))
        } else {
            setError(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    return (
        <>
            {opt.map((s, index) => (
                <div key={index} >
                    <div className={`flex flex-col items-center justify-center`}>
                        <label className="block mb-1 font-medium text-sm text-gray-700">{s}</label>
                        <input
                            name={s}
                            value={data[s]?.value || ""}
                            onChange={handleInputOnchange}
                            placeholder={`${minZero ? pickup+"-"+s : s}`}
                            className={`w-full p-2 border bg-white  ${error[s] ? 'border-red-500' : 'border-gray-300'} rounded-md outline-none`}
                        />
                    </div>
                    {error[s] && <div className={`text-sm text-red-500 text-center`}>{error[s]}</div>}
                </div>
            ))}
            <button
                type="submit"
                onClick={handleSubmit}
                className="p-4 justify-self-end w-24 col-span-4 bg-blue-500 text-white rounded-xl hover:bg-blue-700 cursor-pointer"
            >
                Kaydet
            </button>
        </>
    );
}
