// useDevice.js
import { useEffect, useState } from "react";

const BREAKPOINTS = {
    mobile: 0,
    tablet: 640,
    desktop: 1024,
};

export default function useDevice() {
    const getType = () => {
        const w = window.innerWidth;
        if (w >= BREAKPOINTS.desktop) return "desktop";
        if (w >= BREAKPOINTS.tablet)  return "tablet";
        return "mobile";
    };

    const [type, setType] = useState(
        typeof window !== "undefined" ? getType() : "desktop"
    );

    useEffect(() => {
        const handler = () => setType(getType());
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    return {
        type,
        isMobile: type === "mobile",
        isTablet: type === "tablet",
        isDesktop: type === "desktop",
    };
}
