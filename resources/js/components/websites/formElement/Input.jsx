import { useState } from "react";


const Input = ({type, elementName, labelName, validate, onChange, maxV, prefix, initialValue, formData, errors, setFormData, setErrors, showErrors = false}) =>
    {

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

            // Update parent formData
            if (setFormData) {
                setFormData({
                    ...formData,
                    [elementName]: newValue
                });
            }

            let errorMessage = '';

            if (errors?.[elementName] && validate) {
                errorMessage = validate(newValue);
            }

            // Update parent errors
            if (setErrors) {
                setErrors({
                    ...errors,
                    [elementName]: errorMessage
                });
            }

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
                        value={prefix ? prefix + (formData?.[elementName] || '') : (formData?.[elementName] || '')}
                        onChange={handleChange}
                        maxLength={maxV ? maxV : ""}
                        max = {(elementName === 'birthday') ? onSekizYilOnce : undefined}
                    />
                    {showErrors && errors?.[elementName] && (
                        <div className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                            {errors[elementName]}
                        </div>
                    )}
                </label>
            </>

        );
    }

    export default Input;
