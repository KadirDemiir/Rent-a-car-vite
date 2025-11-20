import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import DropLocations from "../../../components/adminPanel/price/DropPrice/DropLocations.jsx";
import DropCoefficient from "../../../components/adminPanel/price/DropPrice/DropCoefficient.jsx";
import {useTranslation} from "react-i18next";
import {useState} from "react";

export default function DropPrice({locations, dropPrice, segments, success, general}) {
    const {t} = useTranslation();
    const [successMessage, setSuccessMessage] = useState(success);
    const [generalMessage, setGeneralMessage] = useState(general);

    const handleSuccess = (message) => {
        if (message) {
            setSuccessMessage(message);
            setGeneralMessage(null);
        }
    };

    const handleError = (message) => {
        if (message) {
            setGeneralMessage(message);
            setSuccessMessage(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar>
                <div className="px-4 py-8 md:px-8 lg:px-12 space-y-6">
                    <header className="space-y-2">
                        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                            {t("adminpanel.pricing.drop_price.drop_price")}
                        </p>
                        <h1 className="text-3xl font-semibold text-gray-900">
                            {t("adminpanel.pricing.drop_price.drop_price")}
                        </h1>
                    </header>

                    {successMessage && (
                        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800">
                            {successMessage}
                        </div>
                    )}
                    {generalMessage && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                            {generalMessage}
                        </div>
                    )}

                    <div className="space-y-6">
                        <DropCoefficient
                            segments={segments}
                            onSuccess={handleSuccess}
                            onError={handleError}
                        />
                        <DropLocations
                            locations={locations}
                            dropPrice={dropPrice}
                            onSuccess={handleSuccess}
                            onError={handleError}
                        />
                    </div>
                </div>
            </Navbar>
        </div>
    );
}
