export interface Job {
    id: string;
    status: string;
    name: string;
    severity: string;
    storageSystem: string;
    duration: string;
    started: string;
    createdBy: string;
    endDate: number | null;
}

export interface HeadCell {
    id: keyof Job | "actions";
    label: string;
    sortable?: boolean;
    align?: "left" | "right" | "center";
    width?: string;
}
