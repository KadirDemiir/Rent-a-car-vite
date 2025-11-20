export const createEmptyDiscount = (currencyId = "") => ({
    min_day: "",
    max_day: "",
    discount_type: "fixed",
    currency: currencyId,
    discount_amount: "",
    day_error: "",
    amount_error: ""
});


