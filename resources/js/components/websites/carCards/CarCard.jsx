import CarCardUpSide from './CarCardUpSide.jsx';
import CarCardPhoto from './CarCardPhoto.jsx';
import CarCardProperties from './CarCardProperties.jsx';
import CarCardRequirements from './CarCardRequirements.jsx';
import { useTranslation } from 'react-i18next';
export default function CarCard({car}) {
    const { t } = useTranslation("cars");
    const upperFirstLetter = (str) => {
        return str
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }
    const carCoverPhotoPaths = car.photos.filter(c => {
        return c.is_cover === 1;
    });
console.log(car);

    return (
        <div className="grid grid-rows-9 h-140 w-110 rounded-xl shadow-md bg-white transition-transform duration-300 hover:scale-105 hover:outline-2 hover:outline-blue-500 hover:rounded-xl">
            < CarCardUpSide
            brand={car.brand}
            model={car.model}
            segment={upperFirstLetter(t(`segment.${car.segment}`))}
            />
            < CarCardPhoto
            photo_path={`/storage/${carCoverPhotoPaths[0].photo_path}`}
            />
            <div className="row-span-5 flex p-2 gap-2">
                < CarCardProperties
                    compName={upperFirstLetter(t('car_properties'))}
                    body_type={car.body_type}
                    seat_count={`${car.seat_count} ${upperFirstLetter(t('seats'))}`}
                    trunk_capacity={`${car.trunk_capacity} ${upperFirstLetter(t('luggage_capacity'))}`}
                    fuel_type={upperFirstLetter(t(car.fuel_type))}
                    transmission_type={upperFirstLetter(t(car.transmission_type))}
                />
                <div className="h-[90%] w-[1px] bg-gray-300"></div>
                < CarCardRequirements
                    compName={upperFirstLetter(t('requirements'))}
                min_age={`23 ${upperFirstLetter(t('min_age'))}`}
                experience={`3 ${upperFirstLetter(t('year'))} ${upperFirstLetter(t('experience'))}`}
                collateral={`6000 ${upperFirstLetter(t('currencies.tl'))} ${upperFirstLetter(t('deposit'))}`}
                />
            </div>
        </div>
    );
}
