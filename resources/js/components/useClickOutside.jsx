import { useEffect, useRef } from "react";

export default function useClickOutside(outsideCallback) {
    const ref = useRef(null);

    useEffect(() => {
        function handleClick(event) {

            if (ref.current && !ref.current.contains(event.target)) {
                outsideCallback(event);
            }
        }

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("touchstart", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("touchstart", handleClick);
        };
    }, [outsideCallback]);

    return ref;
}
