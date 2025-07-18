import { useEffect, useState } from "react";
import Categories from "./Categories.jsx";

export default function LeftSide() {
    const [activeSection, setActiveSection] = useState("home");
    const [isOpenSection, setIsOpenSection] = useState(() => {
        const savedState = localStorage.getItem('sidebarState');
        return savedState ? JSON.parse(savedState) : Array(7).fill(false);
    });

    useEffect(() => {
        localStorage.setItem('sidebarState', JSON.stringify(isOpenSection));
    }, [isOpenSection]);

    const menuSections = [
        {
            title: "Araç",
            subSec: [
                { name: "Araçlar", href: "/adminpanel/cars" },
                { name: "Araç Ekle", href: "/adminpanel/car/add" },
            ],
        },
        {
            title: "Rezervasyon",
            subSec: [
                { name: "Reservasyonlar", href: "/adminpanel/reservations" },
            ],
        },
        {
            title: "Fiyatlandırma",
            subSec: [
                {name: "DropPrice", href: "/adminpanel/drop-price"},
                {name: "İndirimler", href: "/adminpanel/discounts"},
                {name: "İndirim Ekle", href: "/adminpanel/discount/add"},
            ]
        },
        {
            title: "Ek Hizmetler",
            subSec: [
                {name: "Dahili Hizmetler", href: "/adminpanel/internal-services"},
                {name: "Ek Hizmetler", href: "/adminpanel/external-services"},
            ]
        },
        {
            title: "Kampanyalar",
            subSec: [
                {name: "Kampanyalar", href: "/adminpanel/campaigns"},
                {name: "Kampanya Ekle", href: "/adminpanel/campaign/add"},
            ]
        },
        {
            title: "Lokasyonlar",
            subSec: [
                {name: "Lokasyonlar", href: "/adminpanel/locations"},
            ]
        },
        {
            title: "Kullanıcılar",
            subSec: [
                {name: "Kullanıcılar", href: "/adminpanel/users"}
            ]
        }
    ];

    const isOpenHandler = (index) => {
        setIsOpenSection(prev =>
            prev.map((item, i) => i === index ? !item : item)
        );
    };


    return (
        <div className="fixed top-20 left-0 h-[calc(100vh-80px)] w-60 border border-blue-700 border-t-0 z-50 p-4 bg-blue-700 text-white overflow-y-auto"
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
    );
}
