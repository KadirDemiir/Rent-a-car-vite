import { useState, useEffect, useRef } from 'react';
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useDismiss,
    useInteractions,
} from '@floating-ui/react';

export default function ClockSelector({ selectedClock, onClockChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const listRef = useRef(null);
    const selectedItemRef = useRef(null);

    const times = [];
    for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0');
        times.push(`${hour}:00`);
        times.push(`${hour}:30`);
    }

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: 'bottom-start',
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(5),
            flip({ padding: 10 }),
            shift({ padding: 10 }),
        ],
    });

    const dismiss = useDismiss(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([
        dismiss,
    ]);

    useEffect(() => {
        if (isOpen && selectedItemRef.current) {
            selectedItemRef.current.scrollIntoView({ block: 'center', behavior: 'instant' });
        }
    }, [isOpen]);

    const handleSelect = (time) => {
        onClockChange(time);
        setIsOpen(false);
    };

    return (
        <>
            <div
                ref={refs.setReference}
                {...getReferenceProps()}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-12 px-3 rounded-xl flex items-center justify-between bg-white cursor-pointer border transition-all select-none shadow-sm group
                    ${isOpen ? 'border-gray-800 ring-1 ring-gray-200' : 'border-transparent hover:border-gray-300'}`}
            >
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span>{selectedClock}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </div>

            {isOpen && (
                <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                    {...getFloatingProps()}
                    className="z-50 w-32 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                >
                    <div className="max-h-60 overflow-y-auto py-1 scrollbar-hide" ref={listRef}>
                        {times.map((time) => (
                            <div
                                key={time}
                                ref={time === selectedClock ? selectedItemRef : null}
                                onClick={() => handleSelect(time)}
                                className={`px-4 py-2 text-sm cursor-pointer transition-colors flex items-center gap-2
                                    ${time === selectedClock 
                                        ? 'bg-gray-100 text-gray-900 font-bold' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                {time === selectedClock && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                )}
                                {time}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}