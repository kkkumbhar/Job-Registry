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
    source: string;
}

export interface HeadCell {
    id: keyof Job | "actions";
    label: string;
    sortable?: boolean;
    align?: "left" | "right" | "center";
    width?: string;
}

export interface DataProtectionJob {
    id: string;
    status: "running" | "successful" | "failed" | "cancelled";
    startTime: string;
    endTime: string | null;
    description: string;
    message: string;
    user: string | null;
    userTags: string[];
    policyName: string | null;
    operation: string;
    hasLogs: boolean;
    source: string;
}

// Fleet Job Response
export interface JobResponse {
    jobId: string;
    status: string;
}
