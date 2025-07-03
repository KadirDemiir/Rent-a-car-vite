import { createContext, useContext, useEffect, useState } from "react";

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
    const getDevice = () => {
        const width = window.innerWidth;
        if (width >= 1024) return "desktop";
        if (width >= 640) return "tablet";
        return "mobile";
    };

    const [device, setDevice] = useState(getDevice());

    useEffect(() => {
        const handleResize = () => setDevice(getDevice());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const value = {
        type: device,
        isMobile: device === "mobile",
        isTablet: device === "tablet",
        isDesktop: device === "desktop",
    };

    return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
};

export const useDevice = () => useContext(DeviceContext);
