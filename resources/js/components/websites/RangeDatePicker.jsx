import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, differenceInCalendarDays, addDays, startOfDay } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useDismiss,
    useInteractions,
} from '@floating-ui/react';

export default function RangeDatePicker({
    type = 'start',
    range,
    setRange,
    minDate,
    locale = 'tr',
    placeholder
}) {
    const [isOpen, setIsOpen] = useState(false);
    const activeLocale = locale === 'tr' ? tr : enUS;

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: type === 'end' ? 'bottom-end' : 'bottom-start',
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(10),
            flip({ padding: 10 }),
            shift({ padding: 10 }),
        ],
    });

    const dismiss = useDismiss(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([
        dismiss,
    ]);

    const handleSelect = (selectedRange) => {
        if (!selectedRange) {
            return;
        }

        let { from, to } = selectedRange;

        if (from) from = startOfDay(from);
        if (to) to = startOfDay(to);

        if (from && to) {
            if (differenceInCalendarDays(to, from) === 0) {
                to = addDays(from, 1);
            }
        }

        setRange({ from, to });
    };

    const displayValue = () => {
        const date = type === 'start' ? range?.from : range?.to;
        if (!date) return '';
        return format(date, 'dd.MM.yyyy');
    };

    const selectedForCalendar = {
        from: range?.from ? startOfDay(new Date(range.from)) : undefined,
        to: range?.to ? startOfDay(new Date(range.to)) : undefined
    };

    const minDateClean = minDate ? startOfDay(new Date(minDate)) : undefined;

    return (
        <>
            <div
                ref={refs.setReference}
                {...getReferenceProps()}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-12 px-4 rounded-xl flex items-center bg-white cursor-pointer border transition-all select-none shadow-sm 
                    ${isOpen ? 'border-gray-800 ring-1 ring-gray-200' : 'border-transparent hover:border-gray-300'}`}
            >
                {displayValue() ? (
                    <span className="text-gray-800 font-medium">{displayValue()}</span>
                ) : (
                    <span className="text-gray-400">{placeholder}</span>
                )}
            </div>

            {isOpen && (
                <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                    {...getFloatingProps()}
                    className="z-50 p-4 bg-white rounded-2xl shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 outline-none"
                >
                    <DayPicker
                        mode="range"
                        selected={selectedForCalendar}
                        onSelect={handleSelect}
                        disabled={{ before: minDateClean }}
                        locale={activeLocale}
                        showOutsideDays
                        numberOfMonths={2}
                        defaultMonth={selectedForCalendar?.from || new Date()}
                        modifiersClassNames={{
                            selected: 'bg-gray-800 text-white hover:bg-gray-700',
                            range_start: 'bg-gray-800 text-white rounded-l-lg',
                            range_end: 'bg-gray-800 text-white rounded-r-lg',
                            range_middle: '!bg-gray-200 !text-gray-800 rounded-none',
                            today: 'text-blue-600 font-bold'
                        }}
                        styles={{
                            head_cell: { width: '40px', color: '#9ca3af', fontWeight: 'normal' },
                            cell: { width: '40px', height: '40px', padding: 0 },
                            day: { borderRadius: '8px', width: '40px', height: '40px' }
                        }}
                    />
                </div>
            )}
        </>
    );
}