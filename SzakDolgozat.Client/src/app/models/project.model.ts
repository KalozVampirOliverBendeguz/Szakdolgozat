
export interface Project {
    id?: number;
    name: string;
    startDate: Date;
    plannedEndDate: Date;
    projectManager: string;
    isActive: boolean;
    description?: string;
    userId?: string;
}
