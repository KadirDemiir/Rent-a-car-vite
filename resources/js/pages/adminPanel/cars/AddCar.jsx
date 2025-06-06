import Navbar from "../../../components/adminPanel/navbar/Navbar";
import CarForm from "../../../components/adminPanel/car/form/CarForm.jsx";

export default function AddCars(){

    const onSubmit = (formData) => {
      console.log("Form gönderildi:\n", formData);
    };

    return(
        <div className="w-full">
            < Navbar />
            <div className="pl-64 pt-24 w-full">
                <h1>Araç Ekle</h1>
                <div className="w-[90%] m-8">
                    < CarForm onSubmit={onSubmit}/>
                </div>
            </div>
            <div className="w-full h-50"></div>
        </div>
    );
}
