import { useMemo, useState } from "react";
import type { Job as DataProtectionJob } from "../types/jobs";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Box, Card, Typography } from "@mui/material";
import JobTable from "./jobs/components/JobTable";
import JobFilters from "../components/JobFilters";
import JobTableToolbar from "./components/JobTableToolbar";
import type { Job } from "../types/jobs";
import { formatDuration } from "./jobs/components/JobDuration";
import useDebounce from "../hooks/useDebounce";
import { useGetJobsQuery, useGetJobStatsQuery } from "../components/api/Job";
import InfoIcon from "../assets/InfoIcon.svg";
import SuccessStatusIcon from "../assets/SuccessStatusIcon.svg";
import CriticalIcon from "../assets/CriticalIcon.svg";
import InProgressIcon from "../assets/InProgressIcon.svg";

const transformStatus = (status: DataProtectionJob["status"]): Job["status"] => {
    switch (status) {
        case "running":
            return "In Progress";
        case "successful":
            return "Success";
        case "failed":
            return "Failed";
        case "cancelled":
            return "Canceled";

        default:
            return status;
    }
};

export default function JobRegistry({ parentJobId }: { parentJobId?: string }) {
    // Manage search state locally instead of from context
    const [searchValue, setSearchValue] = useState("");
    const debouncedSearchValue = useDebounce(searchValue, 500);
    const [pageSize, setPageSize] = useState(5);
    const [offset, setOffset] = useState(0);

    // Filter states
    const availableSources = useMemo(() => ["fleet", "protector"], []);
    const availableStatuses = useMemo(() => ["Success", "Failed", "In Progress"], []);
    const [selectedSources, setSelectedSources] = useState<string[]>(availableSources);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(availableStatuses);

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        setOffset(0); // Reset to first page when search changes
    };

    const { data, isLoading } = useGetJobsQuery(
        {
            parentJobId: parentJobId,
            summary: debouncedSearchValue,
            // Only pass sources if not all are selected
            sources:
                selectedSources.length > 0 && selectedSources.length < availableSources.length
                    ? selectedSources
                    : undefined,
            // Only pass statuses if not all are selected
            statuses:
                selectedStatuses.length > 0 && selectedStatuses.length < availableStatuses.length
                    ? selectedStatuses.map((s) => {
                          // Map frontend status to backend enum format (eJOB_*)
                          if (s === "Success") return "eJOB_SUCCEEDED";
                          if (s === "Failed") return "eJOB_FAILED";
                          if (s === "In Progress") return "eJOB_RUNNING";
                          return s;
                      })
                    : undefined,
            offset: offset,
            count: pageSize,
        },
        { refresh: true },
    );

    // Get statistics for all jobs (not just current page)
    const { data: statsData } = useGetJobStatsQuery(
        {
            sources:
                selectedSources.length > 0 && selectedSources.length < availableSources.length
                    ? selectedSources
                    : undefined,
            name: debouncedSearchValue || undefined,
        },
        { refresh: true },
    );

    // To maintain the same Table style, force Data Protector jobs into the shape of the Provisioning jobs
    const jobs = useMemo(
        () =>
            data?.items.map<Job>((job) => ({
                id: job.id,
                status: transformStatus(job?.status ?? "eJOB_UNKNOWN"),
                name: job?.message ?? "",
                severity: "",
                storageSystem: "",
                duration: formatDuration(job?.startTime, job?.endTime, 0),
                started: job?.startTime,
                createdBy: job?.user ?? "",
                endDate: job?.endTime ? new Date(job.endTime).getTime() : 0,
                source: job?.source ?? "",
            })) ?? [],
        [data],
    );

    const { page, count } = useMemo(() => {
        return { page: !data?.offset ? 0 : data.offset / pageSize, count: data?.total ?? 0 };
    }, [data, pageSize]);

    const handlePageChange = (_event: unknown, newPage: number) => {
        setOffset(newPage * pageSize);
    };

    const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
        setPageSize(Number(event.target.value));
    };

    const handleSourceChange = (sources: string[]) => {
        setSelectedSources(sources);
        setOffset(0); // Reset to first page when filter changes
    };

    const handleStatusChange = (statuses: string[]) => {
        setSelectedStatuses(statuses);
        setOffset(0); // Reset to first page when filter changes
    };

    // Calculate statistics from the stats API (all jobs, not just current page)
    const stats = useMemo(() => {
        return {
            total: statsData?.total ?? 0,
            success: statsData?.successful ?? 0,
            failed: statsData?.failed ?? 0,
            inProgress: statsData?.running ?? 0,
        };
    }, [statsData]);

    return (
        <Box sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh", width: "100%" }}>
            {/* Stats Cards */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
                    gap: 2,
                    mb: 2,
                    px: 2,
                    pt: 2,
                }}
            >
                <Card
                    sx={{
                        p: 2.5,
                        background: "#ffffff",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        borderTop: "4px solid #667eea",
                        position: "relative",
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box>
                            <Typography
                                variant="body2"
                                sx={{ color: "#666", mb: 1, fontSize: "13px", fontWeight: 500 }}
                            >
                                Total Jobs
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: "#667eea" }}>
                                {stats.total}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "10px",
                                backgroundColor: "#f0f1ff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <img src={InfoIcon} alt="Total" style={{ width: 24, height: 24 }} />
                        </Box>
                    </Box>
                </Card>

                <Card
                    sx={{
                        p: 2.5,
                        background: "#ffffff",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        borderTop: "4px solid #11998e",
                        position: "relative",
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box>
                            <Typography
                                variant="body2"
                                sx={{ color: "#666", mb: 1, fontSize: "13px", fontWeight: 500 }}
                            >
                                Successful
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: "#11998e" }}>
                                {stats.success}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "10px",
                                backgroundColor: "#e8f5f3",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <img src={SuccessStatusIcon} alt="Success" style={{ width: 28, height: 28 }} />
                        </Box>
                    </Box>
                </Card>

                <Card
                    sx={{
                        p: 2.5,
                        background: "#ffffff",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        borderTop: "4px solid #dc3545",
                        position: "relative",
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box>
                            <Typography
                                variant="body2"
                                sx={{ color: "#666", mb: 1, fontSize: "13px", fontWeight: 500 }}
                            >
                                Failed
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: "#dc3545" }}>
                                {stats.failed}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "10px",
                                backgroundColor: "#ffebee",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <img src={CriticalIcon} alt="Failed" style={{ width: 28, height: 28 }} />
                        </Box>
                    </Box>
                </Card>

                <Card
                    sx={{
                        p: 2.5,
                        background: "#ffffff",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        borderTop: "4px solid #ffc107",
                        position: "relative",
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box>
                            <Typography
                                variant="body2"
                                sx={{ color: "#666", mb: 1, fontSize: "13px", fontWeight: 500 }}
                            >
                                In Progress
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: "#f57c00" }}>
                                {stats.inProgress}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "10px",
                                backgroundColor: "#fff8e1",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <img src={InProgressIcon} alt="In Progress" style={{ width: 24, height: 24 }} />
                        </Box>
                    </Box>
                </Card>
            </Box>

            {/* Search and Filters */}
            <Box sx={{ px: 2, mb: 2 }}>
                <JobFilters
                    availableSources={availableSources}
                    selectedSources={selectedSources}
                    onSourceChange={handleSourceChange}
                    availableStatuses={availableStatuses}
                    selectedStatuses={selectedStatuses}
                    onStatusChange={handleStatusChange}
                />
                <Box sx={{ mb: 2 }}>
                    <JobTableToolbar onSearch={handleSearchChange} searchValue={searchValue} />
                </Box>
            </Box>

            {/* Jobs Table */}
            <Box sx={{ px: 2, pb: 2 }}>
                <Card
                    sx={{
                        borderRadius: "12px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        overflow: "hidden",
                    }}
                >
                    <JobTable
                        jobs={jobs}
                        searchValue={debouncedSearchValue}
                        count={count}
                        page={page}
                        rowsPerPage={pageSize}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        order={"desc"}
                        orderBy={"createdDate"}
                        onRequestSort={() => {}}
                        onShowNotification={() => {}}
                        loading={isLoading}
                    />
                </Card>
            </Box>
        </Box>
    );
}
