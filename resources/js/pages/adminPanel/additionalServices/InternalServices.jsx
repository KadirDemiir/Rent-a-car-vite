import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import Td from "../../../components/adminPanel/table/Td.jsx";
import Confirm from "../../../components/Confirm.jsx";
import { useState } from "react";

export default function InternalServices() {
    const [services, setServices] = useState([
        "Zorunlu Trafik Sigortası",
        "7/24 Yol Yardım",
        "Rent a Car Kaskosu",
        "Adil Yakıt Politikası"
    ]);

    const [addNew, setAddNew] = useState("");
    const [confirmMessage, setConfirmMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [onConfirmAction, setOnConfirmAction] = useState(() => () => {});

    const TDclass = "border border-gray-500 px-4 py-2";

    const deleteService = (service) => {
        setConfirmMessage(`${service} servisini silmek istediğinizden emin misiniz?`);
        setOnConfirmAction(() => (confirmed) => {
            if (confirmed) {
                setServices(prev => prev.filter(s => s !== service));
            }
            setIsModalOpen(false);
        });
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        if (!addNew?.trim()) return;

        setConfirmMessage(`"${addNew}" servisini eklemek istediğinizden emin misiniz?`);
        setOnConfirmAction(() => (confirmed) => {
            if (confirmed) {
                setServices(prev => [...prev, addNew.trim()]);
                setAddNew("");
            }
            setIsModalOpen(false);
        });
        setIsModalOpen(true);
    };

    return (
        <div className="w-full min-h-screen">
            <Navbar />
            <div className="pl-64 pt-24 pr-4">
                <h3 className="text-2xl font-extrabold">Dahili Hizmetler</h3>
                <hr /><br />
                <div>
                    <h2 className={`text-xl font-bold p-2`}>Dahili Hizmetler</h2>
                    <table className="w-full table-auto">
                        <thead>
                        <tr>
                            <Td contents={["Dahili Hizmetler", "İşlemler"]} cls={TDclass} as={"th"} />
                        </tr>
                        </thead>
                        <tbody>
                        {services.map((im, index) => (
                            <tr key={index}>
                                <Td contents={[im]} cls={TDclass} as={"td"} />
                                <Td
                                    contents={[
                                        <button
                                            key={index}
                                            onClick={() => deleteService(im)}
                                            className="bg-red-500 px-6 rounded-xl text-white cursor-pointer hover:bg-red-600"
                                        >
                                            Sil
                                        </button>
                                    ]}
                                    cls={TDclass}
                                    as={"td"}
                                />
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div><br /><br /><hr/><br/><br/>
                <h2 className={`text-xl font-bold p-4`}>Yeni Hizmet Ekle</h2>
                <div className="flex gap-2">
                    <input
                        value={addNew}
                        onChange={(e) => setAddNew(e.target.value)}
                        type="text"
                        placeholder="Yeni hizmet giriniz..."
                        className="pl-2 w-100 outline-none border border-blue-500 py-2 rounded-xl"
                    />
                    <button
                        onClick={handleAddNew}
                        className="bg-blue-500 px-8 rounded-xl text-white hover:bg-blue-600 cursor-pointer"
                    >
                        Ekle
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <Confirm
                    message={confirmMessage}
                    confirm={onConfirmAction}
                />
            )}
        </div>
    );
}
