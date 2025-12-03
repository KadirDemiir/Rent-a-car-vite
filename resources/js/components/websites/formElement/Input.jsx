import { useState } from "react";


const Input = ({type, elementName, labelName, validate, onChange, maxV, prefix}) =>
    {

        const [value, setValue] = useState('');
        const [error, setError] = useState('');

        const day = new Date();
        const onSekizYilOnce = new Date(day.setFullYear(day.getFullYear() - 18))
        .toISOString()
        .split('T')[0];

        const handleChange = (e) => {
            let newValue = e.target.value;

            if(maxV)
            {
                newValue = newValue.slice(0, maxV);
            }
            if (prefix) {
                if(newValue.length >= prefix.length)
                    newValue = newValue.slice(prefix.length);
                else
                    newValue = '';
            }

            setValue(newValue);

            let errorMessage = '';
            if (validate) {
                errorMessage = validate(newValue);
                setError(errorMessage);
            }
            console.log(newValue, errorMessage);
            onChange(newValue, errorMessage);

        };


        return(
            <>
            <label className="w-full">
            {labelName && `${labelName}:`} <br />
            <input
            type={type}
            name={elementName}
            required
            className="h-10 w-full border rounded-lg pl-2 outline-none"
            value={prefix ? prefix + value : value}
            onChange={handleChange}
            maxLength={maxV ? maxV : ""}
            max = {(elementName === 'birthday') ? onSekizYilOnce : undefined}
            />
            {error && <div className="ml-2 text-red-600 text-[12px]">{error}</div>}
            </label>
            </>

        );
    }

    export default Input;
