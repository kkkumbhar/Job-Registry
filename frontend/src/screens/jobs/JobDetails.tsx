import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, SelectChangeEvent } from "@mui/material";
import {
    getJobDetails,
    JobDetailsResponse,
    JobHit,
    JobSearchRequest,
    searchJobs,
    getJobPayload,
    JobResource,
    ReportMessage,
} from "../../../../api/JobsApi";
import InfoGrid, { InfoItem } from "../../../Inventory/components/DetailPageGrid";
import PageHeader from "../../../../components/PageHeader/PageHeader";
import BackButton from "assets/BackButton.svg";
import { CardContainer } from "../../../../components/CardContainer/CardContainer";
import { useEpochFormatter } from "../../../../hooks/useEpochFormatter";
import { Job } from "./components/models";
import useDebounce from "../../../../hooks/useDebounce";
import JobTable from "./components/JobTable";
import ReportTable from "./components/ReportTable";
import {
    ApiResponseResult,
    KeyValueResult,
    TableResult,
    toPascalCase,
    transformAndMergeApiResponse,
    UnknownValue,
} from "../../../../utils/CommonFunctions";
import DynamicTable from "./components/DynamicTable";
import CenteredLoader from "../../../../components/CenteredLoader/CenteredLoader";
import CollapsibleSection from "./components/CollapsibleSection";
import InProgressIcon from "assets/InProgressIcon.svg";
import SuccessStatusIcon from "assets/SuccessStatusIcon.svg";
import CriticalIcon from "assets/CriticalIcon.svg";
import JobTableToolbar from "../../components/JobTableToolbar";
import WarningIcon from "../../../../assets/WarningIcon.svg";
import { useNotifier } from "../../../../hooks/useNotifier";

/** FIXED: JobPayload must match transformAndMergeApiResponse types */
type JobPayload = Record<string, UnknownValue>;

interface JobSource {
    id?: string;
    jobId?: string;
    status?: string;
    name?: string;
    title?: { text: string };
    severity?: string;
    storageSystem?: string;
    duration?: string;
    startDate?: string;
    user?: string;
    endDate?: string | number | null;
}

const JobDetails: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const { formatEpoch } = useEpochFormatter();

    /** State Management */
    const [jobDetails, setJobDetails] = useState<JobDetailsResponse | null>(null);
    const [jobPayload, setJobPayload] = useState<JobPayload | null>(null);
    const [childJobs, setChildJobs] = useState<Job[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [loadingPayload, setLoadingPayload] = useState(false);
    const [loadingChildJobs, setLoadingChildJobs] = useState(false);
    const [totalJobs, setTotalJobs] = useState(0);
    const [searchValue, setSearchValue] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const [orderBy, setOrderBy] = useState<string>("createdDate");
    const { showNotification } = useNotifier();

    const debouncedSearch = useDebounce(searchValue, 2000);

    /** API Calls */
    const fetchJobDetails = useCallback(async () => {
        if (!jobId) return;
        setLoadingDetails(true);
        try {
            const response = await getJobDetails(jobId);
            if (response.data) setJobDetails(response.data);
            else if (response.error) showNotification(response.error.message || "Failed to fetch job details", "error");
        } catch {
            showNotification("Failed to fetch job details", "error");
        } finally {
            setLoadingDetails(false);
        }
    }, [jobId]);

    const fetchJobPayload = useCallback(async () => {
        if (!jobId) return;
        setLoadingPayload(true);
        try {
            const response = await getJobPayload(jobId);
            if (response.data) setJobPayload(response.data as JobPayload);
            else if (response.error) showNotification(response.error.message || "Failed to fetch job payload", "error");
        } catch {
            showNotification("Failed to fetch job payload", "error");
        } finally {
            setLoadingPayload(false);
        }
    }, [jobId]);

    const fetchChildJobs = useCallback(
        async (searchTerm: string, page: number, rowsPerPage: number, order: "asc" | "desc", orderBy: string) => {
            if (!jobId) return;
            setLoadingChildJobs(true);
            try {
                const sortPayload = { [orderBy]: { order } };
                const query: JobSearchRequest["query"] = {
                    bool: { must: [{ match: { parentJobId: jobId } }], must_not: [] },
                };

                if (searchTerm) {
                    query.bool!.should = [
                        {
                            query_string: {
                                query: `*${searchTerm}* OR *${searchTerm.toUpperCase()}*`,
                                fields: ["jobId", "title.text", "user", "status"],
                            },
                        },
                    ];

                    query.bool!.minimum_should_match = 1;
                }

                const payload: JobSearchRequest = {
                    size: rowsPerPage,
                    from: page * rowsPerPage,
                    track_total_hits: true,
                    sort: [sortPayload],
                    query,
                };

                const response = await searchJobs(payload);
                if (response.data) {
                    const hits = response.data.hits?.hits || [];
                    const transformed: Job[] = hits
                        .map((hit: JobHit) => {
                            const s: JobSource = hit._source;
                            if (!s) return null;
                            return {
                                id: s.id || s.jobId || hit._id || "-",
                                status: s.status || "Unknown",
                                name: s.name || s.title?.text || "-",
                                severity: s.severity || "-",
                                storageSystem: s.storageSystem || "-",
                                duration: s.duration,
                                started: s.startDate || "-",
                                createdBy: s.user || "-",
                                endDate: s.endDate ? Number(s.endDate) : null,
                            };
                        })
                        .filter((job): job is Job => job !== null);

                    setChildJobs(transformed);
                    setTotalJobs(response.data.hits?.total?.value || 0);
                } else if (response.error) {
                    showNotification(response.error.message || "Request failed", "error");
                }
            } catch {
                showNotification("Failed to fetch child jobs", "error");
            } finally {
                setLoadingChildJobs(false);
            }
        },
        [jobId],
    );

    /** Effects */

    useEffect(() => {
        fetchJobDetails();
        fetchJobPayload();

        const fetchChildJobsInterval = () => {
            fetchChildJobs(debouncedSearch, page, rowsPerPage, order, orderBy);
        };

        fetchChildJobsInterval();

        const intervalId = setInterval(fetchChildJobsInterval, 15000);

        return () => clearInterval(intervalId);
    }, [fetchJobDetails, fetchJobPayload, fetchChildJobs, page, rowsPerPage, order, orderBy, debouncedSearch]);

    /** Handlers */
    const handleRefresh = useCallback(() => {
        fetchChildJobs(debouncedSearch, page, rowsPerPage, order, orderBy);
    }, []);

    const handleSearchChange = useCallback((value: string) => {
        setSearchValue(value);
        setPage(0);
    }, []);

    const handlePageChange = useCallback((_event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
        setRowsPerPage(Number(event.target.value));
        setPage(0);
    };

    const handleRequestSort = useCallback(
        (_event: React.MouseEvent<unknown>, property: keyof Job) => {
            let sortKey: string;

            switch (property) {
                case "name":
                    sortKey = "title.text.raw";
                    break;
                case "started":
                    sortKey = "startDate";
                    break;
                case "createdBy":
                    sortKey = "user";
                    break;
                default:
                    sortKey = property;
            }

            const isAsc = orderBy === sortKey && order === "asc";
            setOrder(isAsc ? "desc" : "asc");
            setOrderBy(sortKey);
        },
        [order, orderBy],
    );

    const getStatusIcon = (status?: string): string | undefined => {
        switch (toPascalCase(status)) {
            case "Inprogress":
                return InProgressIcon;
            case "Success":
                return SuccessStatusIcon;
            case "Failed":
                return CriticalIcon;
            case "Successwitherrors":
                return WarningIcon;
            default:
                return undefined;
        }
    };

    const toTitleCase = (text?: string): string => {
        if (!text) return "-";
        return text
            .toLowerCase()
            .split(/[_\s]+/)
            .filter(Boolean)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
    };

    /** Rendering */
    const overviewItems: InfoItem[] = [
        { label: "Type", value: jobDetails?.title.text ?? "-" },
        {
            label: "Status",
            value: (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {getStatusIcon(toPascalCase(jobDetails?.status)) && (
                        <img
                            src={getStatusIcon(toPascalCase(jobDetails?.status))}
                            alt={jobDetails?.status}
                            style={
                                toPascalCase(jobDetails?.status) == "InProgress"
                                    ? { width: 24, height: 24 }
                                    : { width: 28, height: 28 }
                            }
                        />
                    )}
                    {toTitleCase(jobDetails?.status)}
                </Box>
            ),
        },
        { label: "Created by", value: jobDetails?.user ?? "-" },
        {
            label: "Started",
            value: jobDetails?.startDate ? formatEpoch(jobDetails.startDate) : "-",
        },
        {
            label: "Finished",
            value: jobDetails?.endDate ? formatEpoch(jobDetails.endDate) : "-",
        },
    ];

    return (
        <Box>
            <PageHeader
                title={
                    <Box display="flex" alignItems="center" gap={1}>
                        <img
                            src={BackButton}
                            height={22}
                            width={22}
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(-1)}
                        />
                        {jobDetails?.title.text ?? "-"}
                    </Box>
                }
            />

            {/* Overview */}
            <Box mt={5}>
                <CardContainer width="100%" minHeight={0} padding={2}>
                    <CollapsibleSection title="Overview" defaultOpen={true}>
                        {loadingDetails ? (
                            <CenteredLoader minHeight={200} />
                        ) : (
                            <InfoGrid columns={4} items={overviewItems} gap={3} />
                        )}
                    </CollapsibleSection>
                </CardContainer>
            </Box>

            {/* Reports */}
            <Box mt={5}>
                <CardContainer width="100%" minHeight={0} padding={2}>
                    <CollapsibleSection title="Reports" defaultOpen={false}>
                        {loadingDetails ? (
                            <CenteredLoader minHeight={200} />
                        ) : (
                            <ReportTable
                                data={jobDetails?.reports || []}
                                loading={loadingDetails}
                                columns={[
                                    { id: "severity", label: "Severity" },
                                    {
                                        id: "reportMessage",
                                        label: "Message",
                                        format: (value) =>
                                            typeof value === "object" && value !== null
                                                ? ((value as ReportMessage).text ?? "")
                                                : "",
                                    },
                                    {
                                        id: "creationDate",
                                        label: "Date",
                                        format: (value) => (typeof value === "number" ? formatEpoch(value) : ""),
                                    },
                                ]}
                            />
                        )}
                    </CollapsibleSection>
                </CardContainer>
            </Box>

            {/* Resources + Payload */}
            <Box mt={5}>
                <CardContainer width="100%" minHeight={0} padding={2}>
                    <CollapsibleSection title="Resources" defaultOpen={false}>
                        {loadingDetails || loadingPayload ? (
                            <CenteredLoader minHeight={200} />
                        ) : (
                            <>
                                <ReportTable
                                    data={jobDetails?.resources || []}
                                    columns={[
                                        { id: "type", label: "Resource Type", align: "left" },
                                        {
                                            id: "ids",
                                            label: "Resource ID",
                                            align: "right",
                                            format: (v: string | string[] | JobResource[]) =>
                                                ([] as (string | JobResource)[])
                                                    .concat(v)
                                                    .map((item) => (typeof item === "string" ? item : item.name))
                                                    .join(", "),
                                        },
                                    ]}
                                />

                                {jobPayload && (
                                    <Box mt={4}>
                                        {(() => {
                                            const results = transformAndMergeApiResponse(jobPayload);

                                            // Separate key-value sections vs table sections
                                            const keyValueSections = results.filter(
                                                (r): r is KeyValueResult => (r as TableResult).type !== "table",
                                            );
                                            const tableSections = results.filter(
                                                (r): r is TableResult => (r as TableResult).type === "table",
                                            );

                                            // Combine so that key-value tables come first
                                            const orderedSections = [...keyValueSections, ...tableSections];

                                            return orderedSections.map((res: ApiResponseResult, idx) => {
                                                const isTable = (item: ApiResponseResult): item is TableResult =>
                                                    (item as TableResult).type === "table";

                                                const columns = isTable(res)
                                                    ? res.columns.map((col) => ({
                                                        id: col,
                                                        label: col,
                                                    }))
                                                    : [
                                                        { id: "parameter", label: "Parameter" },
                                                        { id: "value", label: "Value" },
                                                    ];

                                                const data = isTable(res)
                                                    ? res.rows.map((row) =>
                                                        Object.fromEntries(
                                                            res.columns.map((col, i) => [col, row[i]]),
                                                        ),
                                                    )
                                                    : Object.entries((res as KeyValueResult).value || {}).map(
                                                        ([key, val]) => ({
                                                            parameter: key,
                                                            value:
                                                                typeof val === "boolean"
                                                                    ? val
                                                                        ? "True"
                                                                        : "False"
                                                                    : (val ?? "-"),
                                                        }),
                                                    );

                                                return (
                                                    <Box key={idx} mt={2}>
                                                        <Typography fontWeight={600} mb={1}>
                                                            {res.title}
                                                        </Typography>

                                                        {loadingDetails || loadingPayload ? (
                                                            <CenteredLoader minHeight={200} />
                                                        ) : (
                                                            <DynamicTable<Record<string, UnknownValue>>
                                                                data={data}
                                                                columns={columns}
                                                                loading={loadingPayload}
                                                            />
                                                        )}
                                                    </Box>
                                                );
                                            });
                                        })()}
                                    </Box>
                                )}
                            </>
                        )}
                    </CollapsibleSection>
                </CardContainer>
            </Box>

            {/* Child Jobs Table */}
            <Box mt={5}>
                <CardContainer>
                    <JobTableToolbar
                        onSearch={handleSearchChange}
                        searchValue={searchValue}
                        onRefresh={handleRefresh}
                        pageName={"Job Details"}
                    />
                    <JobTable
                        jobs={childJobs}
                        count={totalJobs}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        loading={loadingChildJobs}
                        searchValue={debouncedSearch}
                    />
                </CardContainer>
            </Box>
        </Box>
    );
};

export default JobDetails;
