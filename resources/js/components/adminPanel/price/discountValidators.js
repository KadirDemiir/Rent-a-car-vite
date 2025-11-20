/**
 * Validation functions for discount entries
 */

/**
 * Validates day range inputs
 * @param {string} minVal - Minimum day value
 * @param {string} maxVal - Maximum day value
 * @param {number} currentIndex - Current discount index
 * @param {Array} allDiscounts - All discount entries
 * @returns {string} Error message or empty string
 */
export const validateDayRange = (minVal, maxVal, currentIndex, allDiscounts) => {
    console.log(minVal, maxVal);
    let error = "";

    if (!minVal && !maxVal) {
        return error;
    }

    const min = Number(minVal);
    const max = Number(maxVal);
    // Check if values are numeric
    if ((minVal && !/^\d+$/.test(minVal)) || (maxVal && !/^\d+$/.test(maxVal))) {
        return "Gün Değerleri Yalnızca Rakamlardan Oluşabilir\n";
    }

    // Check if range is valid (at least 1 day)
    if (minVal && maxVal && (max - min < 1)) {
        error += "İndirim Süresi En Az Bir Gün Olmalıdır!\n";
    }

    // Check for overlapping ranges with other discounts
    // Two ranges overlap if: a_start <= max && a_end >= min
    const hasIntersection = allDiscounts.some((dd, index) => {
        if (index === currentIndex || !dd.min_day || !dd.max_day) {
            return false;
        }
        const a_start = Number(dd.min_day);
        const a_end = Number(dd.max_day);
        // Check if ranges overlap (not disjoint)
        return a_start <= max && a_end >= min;
    });

    if (hasIntersection) {
        error += "Girdiğiniz Gün Aralığı Farklı Gün Aralıklarıyla Kesişiyor!\n";
    }

    return error;
};

/**
 * Validates discount amount
 * @param {string} amount - Discount amount value
 * @param {string} discountType - Type of discount (fixed or percentage)
 * @returns {string} Error message or empty string
 */
export const validateDiscountAmount = (amount, discountType) => {
    if (!amount) {
        return "";
    }

    // Check if value is numeric
    if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
        return "İndirim Değerleri Yalnızca Rakamlardan Oluşabilir\n";
    }

    // Check percentage limit
    if (discountType === "percentage" && Number(amount) > 100) {
        return "En Fazla %100 İndirim Seçebilirisniz!";
    }

    return "";
};

/**
 * Validates discount type change and updates amount error if needed
 * @param {string} newDiscountType - New discount type
 * @param {string} currentAmount - Current discount amount
 * @returns {string} Error message or empty string
 */
export const validateDiscountTypeChange = (newDiscountType, currentAmount) => {
    if (!currentAmount) {
        return "";
    }

    if (newDiscountType === "percentage" && Number(currentAmount) > 100) {
        return "En Fazla %100 İndirim Seçebilirisniz!";
    }

    if (currentAmount && !/^\d+$/.test(currentAmount)) {
        return "İndirim Değerleri Yalnızca Rakamlardan Oluşabilir";
    }

    return "";
};

