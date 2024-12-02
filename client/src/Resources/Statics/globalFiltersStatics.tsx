export const GLOBAL_FILTERS_KEY_TO_LOCAL_STORAGE = "GLOBAL_FILTERS";

export enum RadicalFocusModules {
    ACTION_MODULE = "actionModule",
    INITIATIVE_MODULE = "initiativeModule",
    DOCUMENT_MODULE = "documentModule",
    RECURRING_ACTIVITY_MODULE = "recurringActivityModule",
    PROCESS_MODULE = "processActivityModule",
    KPI_MODULE = "kpiModule",
    OBJECTIVE_MODULE = "objectiveModule"
}

export enum ActionModuleFilterKeys {
    PRIORITY = "priority",
    DUE_DATE = "dueDate",
    COMPLETED = "completed"
    // Add other keys as needed
}

export enum ObjectiveModuleFilterKeys {
    RESPONSIBLE_PERSON = "responsiblePerson",
    OBJECTIVE_TYPE = "objectiveType",
    // Add other keys as needed
}

export enum InitiativeModuleFilterKeys {
    STATUS = "status",
    RESPONSIBLE = "responsible",
    DEAD_LINE = "deadLine",
    INITIATIVE_PRIORITY = "initiativePriority",
    // Add other keys as needed
}

export enum DocumentModuleFilterKeys {
    STATUS = "status",
    OWNER = "owner",
    DOCUMENT_PRIORITY = "documentPriority",
    // Add other keys as needed
}

export enum RecurringActivityModuleFilterKeys {
    CYCLE = "cycle",
    RESPONSIBLE_PERSON = "responsiblePerson",
    // Add other keys as needed
}

export enum ProcessModuleFilterKeys {
    STATUS = "status",
    RESPONSIBLE_PERSON = "responsiblePerson",
    // Add other keys as needed
}

export enum KPIModuleFilterKeys {
    RESPONSIBLE_PERSON = "responsiblePerson",
    // Add other keys as needed
}

/**
 * Interface representing the modules with filters in the Radical Focus application.
 *
 * This interface defines the structure of the modules with their respective filter keys and their corresponding types.
 * Each module is represented by a key from the RadicalFocusModules enum, and each filter key is represented by a key from the respective enum for that module.
 * The value for each filter key is a Record<string, any> type, allowing for flexibility in the data that can be stored.
 */
export interface IModulesWithFilters {
    [RadicalFocusModules.ACTION_MODULE]: {
        [key in ActionModuleFilterKeys]: Record<string, any>;
    };
    [RadicalFocusModules.INITIATIVE_MODULE]: {
        [key in InitiativeModuleFilterKeys]: Record<string, any>;
    };
    [RadicalFocusModules.DOCUMENT_MODULE]: {
        [key in DocumentModuleFilterKeys]: Record<string, any>;
    };
    [RadicalFocusModules.RECURRING_ACTIVITY_MODULE]: {
        [key in RecurringActivityModuleFilterKeys]: Record<string, any>;
    };
    [RadicalFocusModules.PROCESS_MODULE]: {
        [key in ProcessModuleFilterKeys]: Record<string, any>;
    };
    [RadicalFocusModules.KPI_MODULE]: {
        [key in KPIModuleFilterKeys]: Record<string, any>;
    };
    [RadicalFocusModules.OBJECTIVE_MODULE]: {
        [key in ObjectiveModuleFilterKeys]: Record<string, any>;
    };
}