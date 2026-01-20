import {useEffect, useState} from "react";
import Categories from "./Categories.jsx";
import { useTranslation } from 'react-i18next';


export default function LeftSide({ isOpen, onClose }) {
    const {i18n, t} = useTranslation();
    const menuSections = [
        {
            title: t("adminpanel.navigator.vehicle"),
            subSec: [
                { name: t("adminpanel.navigator.vehicles"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.cars")}` },
                { name: t("adminpanel.navigator.add_vehicles"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.cars")}/${t("address.add")}` },
            ],
        },
        {
            title: t("adminpanel.navigator.reservation"),
            subSec: [
                { name: t("adminpanel.navigator.reservations"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.reservations")}` },
            ],
        },
        {
            title: t("adminpanel.navigator.pricing"),
            subSec: [
                {name: t("adminpanel.navigator.drop_price"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.drop-price")}`},
                {name: t("adminpanel.navigator.discounts"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.discounts")}`},
                {name: t("adminpanel.navigator.add_discount"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.discounts")}/${t("address.add")}`},
            ]
        },
        {
            title: t("adminpanel.navigator.extra_services"),
            subSec: [
                {name: t("adminpanel.navigator.internal_services"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.internal-services")}`},
                {name: t("adminpanel.navigator.external_services"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.external-services")}`},
            ]
        },
        {
            title: t("adminpanel.navigator.campaigns"),
            subSec: [
                {name: t("adminpanel.navigator.campaigns"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.campaigns")}`},
                {name: t("adminpanel.navigator.add_campaign"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.campaigns")}/${t("address.add")}`},
            ]
        },
        {
            title: t("adminpanel.navigator.locations"),
            subSec: [
                {name: t("adminpanel.navigator.locations"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.locations")}`},
            ]
        },
        {
            title: t("adminpanel.navigator.users"),
            subSec: [
                {name: t("adminpanel.navigator.users"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.users")}`}
            ]
        },
        {
            title: t("adminpanel.navigator.language_operations"),
            subSec: [
                {name: t("adminpanel.navigator.language_operations"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.languages")}`},
                {name: t("adminpanel.navigator.add_language"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.languages")}/${t("address.add")}`},
            ]
        },
        {
            title: t("adminpanel.navigator.car_properties"),
            subSec: [
                {name: t("adminpanel.navigator.segments"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.segments")}`},
                {name: t("adminpanel.navigator.add_segment"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.segments")}/${t("address.add")}`},
                {name: t("adminpanel.navigator.body_types"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.body_types")}`},
                {name: t("adminpanel.navigator.add_body_type"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.body_types")}/${t("address.add")}`},
                {name: t("adminpanel.navigator.fuels"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.fuels")}`},
                {name: t("adminpanel.navigator.add_fuel"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.fuels")}/${t("address.add")}`},
                {name: t("adminpanel.navigator.transmissions"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.transmissions")}`},
                {name: t("adminpanel.navigator.add_transmission"), href: `/${i18n.language}/${t("address.adminpanel")}/${t("address.transmissions")}/${t("address.add")}`},
            ]
        }
    ];
    const [activeSection, setActiveSection] = useState("home");
    const [isOpenSection, setIsOpenSection] = useState(() => {
        const savedState = sessionStorage.getItem('sidebarState');
        return savedState ? JSON.parse(savedState) : Array(menuSections.length).fill(false);
    });

    useEffect(() => {
        sessionStorage.setItem('sidebarState', JSON.stringify(isOpenSection));
    }, [isOpenSection]);

    const isOpenHandler = (index) => {
        setIsOpenSection(prev =>
            prev.map((item, i) => i === index ? !item : item)
        );
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-100 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={onClose}
                ></div>
            )}
            <div className={`fixed top-20 left-0 h-[calc(100vh-80px)] w-60 border border-blue-700 border-t-0 z-50 p-4 bg-blue-700 text-white overflow-y-auto transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <ul className="flex flex-col items-start justify-center gap-2">
                    {menuSections.map((menuSection, index) => (
                        <Categories
                            key={index}
                        clickHandle={isOpenHandler}
                        index={index}
                        isOpenSection={isOpenSection[index]}
                        menuSection={menuSection}
                        setActiveSection={setActiveSection}
                        activeSection={activeSection}
                    />
                ))}
            </ul>
        </div>
        </>
    );
}
