import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import SelectOptions from "../../../components/websites/filterSelectors/SelectOptions.jsx";
import DatePicker from "react-datepicker";
import {useState} from "react";
import "react-datepicker/dist/react-datepicker.css";
import DayBasedDiscount from "../../../components/adminPanel/price/DayBasedDiscount.jsx";
import SegmentBasedDiscount from "../../../components/adminPanel/price/SegmentBasedDiscount.jsx";
import AllCarsDiscount from "../../../components/adminPanel/price/AllCarsDiscount.jsx";

export default function AddDiscounts(){

    return(
        <div className="w-full h-600">
            < Navbar />
            <div className="pl-64 pt-24 pr-4">
                <h3 className={`text-2xl font-extrabold`}>İndirim Ekle</h3>
                <hr/><br/><br/>
                <div className={`space-y-8`}>
                    <DayBasedDiscount />
                    <SegmentBasedDiscount />
                    <AllCarsDiscount />
                </div>
            </div>
        </div>
    );
}
