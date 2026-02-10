// ============================================================================
// CAR TABLE - MAIN EXPORT
// Re-exports both table types for flexibility
// ============================================================================

import CarGroupTable from "./CarGroupTable";
import VehicleTable from "./VehicleTable";

export { CarGroupTable, VehicleTable };

// ============================================================================
// TABLE MODES (for backward compatibility)
// ============================================================================

export const TABLE_MODES = {
    CAR_GROUPS: 'car_groups',
    CARS: 'cars',
};

// ============================================================================
// UNIFIED COMPONENT (backward compatible wrapper)
// ============================================================================

export default function CarTable({ carGroups = [], cars = [], mode = TABLE_MODES.CAR_GROUPS }) {
    if (mode === TABLE_MODES.CAR_GROUPS) {
        return <CarGroupTable carGroups={carGroups} />;
    }
    
    return <VehicleTable vehicles={cars} />;
}

// Attach modes constant for easy access
CarTable.MODES = TABLE_MODES;
