import CarCardUpSide from './CarCardUpSide.jsx';
import CarCardPhoto from './CarCardPhoto.jsx';
import CarCardProperties from './CarCardProperties.jsx';
import CarCardRequirements from './CarCardRequirements.jsx';
import { useTranslation } from 'react-i18next';
export default function CarCard({car}) {
    const { t } = useTranslation();
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
            brand={t(`${car.brand_key.key}`)}
            model={t(`${car.model_key.key}`)}
            segment={upperFirstLetter(t(`segment.${car.segment_id}`))}
            />
            < CarCardPhoto
            photo_path={`/storage/${carCoverPhotoPaths[0].photo_path}`}
            />
            <div className="row-span-5 flex p-2 gap-2">
                < CarCardProperties
                    compName={upperFirstLetter(t('website.car_card.properties.properties_label'))}
                    body_type={upperFirstLetter(t(`body_type.${car.body_type_id}`))}
                    seat_count={`${upperFirstLetter(t('website.car_card.properties.seat_count_{count}', {count : car.seat_count }))}`}
                    trunk_capacity={`${upperFirstLetter(t('website.car_card.properties.trunk_capacity_{trunk_capacity}', {trunk_capacity: car.trunk_capacity}))}`}
                    fuel_id={car.fuel_id}
                    transmission_id={car.transmission_id}
                />
                <div className="h-[90%] w-[1px] bg-gray-300"></div>
                < CarCardRequirements
                compName={upperFirstLetter(t('website.car_card.requirements.requirements_label'))}
                min_age={`${upperFirstLetter(t('website.car_card.requirements.required_min_{age}', { age: 23 }))}`}
                experience={`${upperFirstLetter(t('website.car_card.requirements.{year}_year_experience', {year: 2}))}`}
                collateral={`${upperFirstLetter(t('website.car_card.requirement.{amount}_{currency}_deposit', {amount: 6000, currency: 'tl'}))}`}
                />
            </div>
        </div>
    );
}
