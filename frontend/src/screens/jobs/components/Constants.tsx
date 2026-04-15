// Status mapping for StatusChip component
export const JOB_STATUS_CONFIG = {
    Running: { color: "#1976D2", backgroundColor: "#E3F2FD" },
    Completed: { color: "#388E3C", backgroundColor: "#E8F5E8" },
    Failed: { color: "#D32F2F", backgroundColor: "#FFEBEE" },
    Pending: { color: "#F57C00", backgroundColor: "#FFF3E0" },
    Cancelled: { color: "#616161", backgroundColor: "#F5F5F5" },
};

export const SEARCH_PLACEHOLDER = {
    JOB: "Search on Status, Name and Created By",
} as const;
