import FormInput from "./FormInput.jsx";
import React from "react";

export default function() {
    return(
        <div>
            <FormInput name="brand" label={t("adminpanel.car.car_modify.edit_car_information.brand")} value={formData.brand} onChange={handleChange} error={error.brand} />
            <FormInput name="model" label={t("adminpanel.car.car_modify.edit_car_information.model")} value={formData.model} onChange={handleChange} error={error.model} />
        </div>
    );
}
