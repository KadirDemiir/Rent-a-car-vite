import SelectOptions from "../../websites/filterSelectors/SelectOptions.jsx";
import SegmentBasedDiscount from "./SegmentBasedDiscount.jsx";
import { useState } from "react";

export default function DiscountType({ value, discountTypeOnChange, discountTarget, setDiscountTarget }) {
    const discountOptions = [
        { label: "Segment İndirimi", value: "segment" },
        { label: "Araç İndirimi", value: "car" },
        { label: "Genel İndirim", value: "all" },
    ];
    const selectedSegment = (discountTarget?.segments && discountTarget.segments[0]) || "";

    return (
        <div className="w-full flex items-center justify-center">
            <div className="flex-1">
                <SelectOptions
                    options={discountOptions}
                    value={value}
                    onChange={discountTypeOnChange}
                    options_name="İndirim Seçenekleri"
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
