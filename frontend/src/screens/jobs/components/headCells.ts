import type { HeadCell } from "../../../types/jobs";

export const headCells: HeadCell[] = [
    { id: "status", label: "Status", sortable: true, width: "10%" },
    { id: "name", label: "Name", sortable: true, width: "18%" },
    { id: "source", label: "Source", sortable: true, width: "10%" },
    { id: "duration", label: "Duration", sortable: false, width: "10%" },
    { id: "started", label: "Started", sortable: true, width: "13%" },
    { id: "createdBy", label: "Created By", sortable: true, width: "12%" },
];
