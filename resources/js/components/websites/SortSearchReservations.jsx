
import {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useCurrency} from "../../providers/CurrencyContext.jsx";


const applyFilters = (cars, segment, fuelType, transmissionType) => {
  return cars.filter(car => {
    const segmentMatch = segment === '' || segment[0] === '' || segment.includes(car.segment);
    const fuelMatch = fuelType === '' || fuelType[0] === '' || fuelType.includes(car.fuel_type);
    const transmissionMatch = transmissionType === '' || transmissionType[0] === '' || transmissionType.includes(car.transmission_type);
    return segmentMatch && fuelMatch && transmissionMatch;
  });
};

const applySorting = (cars, sortBy) => {
  const sorted = [...cars];
  switch (sortBy) {
    case 'increase':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'decrease':
      sorted.sort((a, b) => b.price - a.price);
      break;
    default:
      break;
  }
  return cars;
};

export default function SortSearchReservations({ availableCars, sortBy, segment, fuelType, transmissionType }) {
    console.log(availableCars);
    const {t} = useTranslation();
  const [filteredCars, setFilteredCars] = useState([]);
    const { currencies, current, calculateTotal } = useCurrency();
    console.log(currencies, current);
  useEffect(() => {
    const filtered = applyFilters(availableCars, segment, fuelType, transmissionType);
    const sorted = applySorting(filtered, sortBy);
    setFilteredCars(sorted);
  }, [availableCars, sortBy, segment, fuelType, transmissionType]);
  return (
    <div className={`space-y-4`}>
      {filteredCars.map((filteredCar) => (
        <div
          key={filteredCar.id}
          className="bg-white w-full rounded-2xl grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-10 gap-4 p-6 shadow-md"
        >
          <div className="col-span-1 lg:col-span-2 flex items-center justify-center p-4">
            <div className="w-full p-2">
              <img
                  src={`/storage/${filteredCar.photos.find(p => p.is_cover)?.photo_path}`}
                  alt={`${filteredCar.brand} ${filteredCar.model}`}
                className="w-full object-contain h-40"
              />
            </div>
          </div>


          <div className="col-span-1 lg:col-span-5 flex flex-col items-center justify-between gap-4 p-2">
            <div className="flex items-center gap-4 flex-wrap justify-center text-center">
              <span className="text-blue-700 font-bold bg-blue-100 px-3 py-1 rounded-full text-sm">
                {t(`segment.${filteredCar.segment_id}`)}
              </span>
              <h2 className="text-lg font-semibold text-gray-800">
                {t(filteredCar.brand_key.key)} {t(filteredCar.model_key.key)} • {t(`fuel.${filteredCar.fuel_id}`)} • {t(`transmission.${filteredCar.transmission_id}`)}
              </h2>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {[
                {
                  icon: "/storage/svg/carFeatures/gas_station.svg",
                  label: t(`fuel.${filteredCar.fuel_id}`)
                },
                {
                  icon: "/storage/svg/carFeatures/transmission.svg",
                  label: t(`transmission.${filteredCar.transmission_id}`)
                },
                {
                  icon: "/storage/svg/carFeatures/groups.svg",
                  label: t("website.car_card.properties.seat_count_{count}", {count: filteredCar.seat_count})
                }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-2 rounded-xl w-20 shadow-xl">
                  <img src={item.icon} alt="" className="w-6 h-6 mb-1" />
                  <span className="text-sm text-gray-600 text-center">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {[
                {
                  icon: "/storage/svg/requirements/assurance.svg",
                  label: t('website.car_card.requirement.{amount}_{currency}_deposit', {amount: filteredCar.deposit, currency :"try"})
                },
                {
                  icon: "/storage/svg/requirements/calendar.svg",
                  label: t("website.car_card.requirements.required_min_{age}", {age: 22})
                },
                {
                  icon: "/storage/svg/requirements/steering-wheel.svg",
                  label: t("website.car_card.requirements.{year}_year_experience", {year : 2})
                }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-2 rounded-xl w-24 shadow-2xl">
                  <img src={item.icon} alt="" className="w-6 h-6 mb-1" />
                  <span className="text-sm text-gray-600 text-center">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-1 lg:col-span-3 flex flex-col justify-between items-center p-4 rounded-2xl bg-gray-50 gap-4 shadow-inner">
            <div className="w-full space-y-2">
              <div className="flex justify-between px-2 text-sm text-gray-700">
                <span className="font-medium">Günlük:</span>
                <span>{calculateTotal(filteredCar.daily_price)} {current?.symbol}</span>
              </div>
              <div className="flex justify-between px-2 text-sm text-gray-700">
                <span className="font-medium">Drop Ücreti:</span>
                <span>{calculateTotal(filteredCar.drop_price) ?? 0} {current?.symbol}</span>
              </div>

              <div className="flex justify-between px-2 text-sm text-gray-700">
                  <span className="font-medium">Toplam Gün:</span>
                  <span>{filteredCar.total_days}</span>
              </div>
              <div className="flex justify-between px-2 text-base text-gray-800 font-semibold border-t pt-2">
                <span>Toplam:</span>
                <span>{calculateTotal(Number(filteredCar.drop_price ?? 0) + Number(filteredCar.daily_price)*Number(filteredCar.total_days))} {current?.symbol}</span>
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300">
                {t("website.searchReservation.rent_now")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
