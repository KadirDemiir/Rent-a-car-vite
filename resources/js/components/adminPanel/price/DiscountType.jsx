import SelectOptions from "../../websites/filterSelectors/SelectOptions.jsx";
import SegmentBasedDiscount from "./SegmentBasedDiscount.jsx";
import { useState } from "react";
import {useTranslation} from "react-i18next";

export default function DiscountType({ value, discountTypeOnChange, discountTarget, setDiscountTarget }) {
    const {t} = useTranslation();
    const discountOptions = [
        { label: t("adminpanel.pricing.add_discount.add_discount"), value: "segment" },
        { label: t("adminpanel.pricing.add_discount.car_based"), value: "car" },
        { label: t("adminpanel.pricing.add_discount.all_vehicle_based"), value: "all" },
    ];
    const selectedSegment = (discountTarget?.segments && discountTarget.segments[0]) || "";

    return (
        <div className="w-full flex items-center justify-center">
            <div className="flex-1">
                <SelectOptions
                    options={discountOptions}
                    value={value}
                    onChange={discountTypeOnChange}
                    options_name={t("adminpanel.pricing.add_discount.discount_options")}
                />
            </div>

            {value === "segment" && (
                <div className="flex-1 px-4">
                    <SegmentBasedDiscount
                        selectedSegment={selectedSegment}
                        onChange={setDiscountTarget}
                    />
                </div>
            )}

            {value === "car" && (
                <div className="flex-1 flex items-center justify-center px-4">
                    Araç tabanlı indirim paneli
                </div>
            )}
        </div>
    );
}
