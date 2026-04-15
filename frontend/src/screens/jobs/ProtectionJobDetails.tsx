import { useNavigate, useLoaderData } from "react-router-dom";
import { Box, Paper } from "@mui/material";
import PageHeader from "../../../../components/PageHeader/PageHeader";
import BackButton from "assets/BackButton.svg";
import { CardContainer } from "../../../../components/CardContainer/CardContainer";
import { toPascalCase } from "../../../../utils/CommonFunctions";
import CollapsibleSection from "./components/CollapsibleSection";
import InProgressIcon from "assets/InProgressIcon.svg";
import SuccessStatusIcon from "assets/SuccessStatusIcon.svg";
import CriticalIcon from "assets/CriticalIcon.svg";
import WarningIcon from "assets/WarningIcon.svg";
import {
    useDownloadJobLogsMutation,
    useGetJobLogsQuery,
    useGetJobQuery,
    useGetLogAttachmentsQuery,
} from "../../../../api/DataProtection/Jobs";
import { Attachment, Job, LogEntry } from "../../../../types/DataProtection/Job";
import dayjs from "dayjs";
import ExportIcon from "assets/Download.S.svg?url";
import { StyledButton } from "../../../DataProtection/components/ButtonGroup";
import { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Table, TableProps } from "../../../../components/Table";
import CustomTooltip from "../../../../components/CustomTooltip/Customtooltip";
import { APIResponse } from "../../../../types/DataProtection/DataProtectionType";
import JobDuration from "./components/JobDuration";

const logSeverityMap = {
    eLOG_DETAIL: "information",
    eLOG_INFORMATION: "information",
    eLOG_WARNING: "medium",
    eLOG_ERROR: "high",
};

function JobOverview({ job }: { job: Job }) {
    const toTitleCase = (text?: string): string => {
        if (!text) return "-";
        return text
            .toLowerCase()
            .split(/[_\s]+/)
            .filter(Boolean)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
    };

    const getStatusIcon = (status?: string): string | undefined => {
        switch (toPascalCase(status)) {
            case "Inprogress":
                return InProgressIcon;
            case "Successful":
                return SuccessStatusIcon;
            case "Failed":
                return CriticalIcon;
            case "Successwitherrors":
                return WarningIcon;
            default:
                return undefined;
        }
    };

    // Overview rendered via explicit JSX components

    return (
        <Box mt={5}>
            <CardContainer width="100%" minHeight={0} padding={2}>
                <CollapsibleSection title="Overview" defaultOpen={true}>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: 3,
                        }}
                    >
                        <Box>
                            <Box sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5 }}>Type</Box>
                            <Box>{job?.message ?? "-"}</Box>
                        </Box>
                        <Box>
                            <Box sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5 }}>Status</Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {getStatusIcon(toPascalCase(job?.status)) && (
                                    <img
                                        src={getStatusIcon(toPascalCase(job?.status))}
                                        alt={job?.status}
                                        style={
                                            toPascalCase(job?.status) == "InProgress"
                                                ? { width: 24, height: 24 }
                                                : { width: 28, height: 28 }
                                        }
                                    />
                                )}
                                {toTitleCase(job?.status)}
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5 }}>Created by</Box>
                            <Box>{job?.user ?? "-"}</Box>
                        </Box>
                        <Box>
                            <Box sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5 }}>Started</Box>
                            <Box>{job?.startTime ? dayjs(job.startTime).format("YYYY/MM/DD h:mm:ss A") : "-"}</Box>
                        </Box>
                        <Box>
                            <Box sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5 }}>Finished</Box>
                            <Box>{job?.endTime ? dayjs(job.endTime).format("YYYY/MM/DD h:mm:ss A") : "-"}</Box>
                        </Box>
                        <Box>
                            <Box sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5 }}>Duration</Box>
                            <Box>
                                <JobDuration
                                    startTime={job?.startTime}
                                    endTime={job?.endTime}
                                    isRunning={job?.status === "running"}
                                />
                            </Box>
                        </Box>
                    </Box>
                </CollapsibleSection>
            </CardContainer>
        </Box>
    );
}

function LogAttachments({
    parentId,
    expanded,
    hasAttachments,
}: {
    parentId: string;
    expanded: boolean;
    hasAttachments: boolean;
}) {
    const { data, isPending } = useGetLogAttachmentsQuery(parentId, { enabled: expanded && hasAttachments });
    const attachments = (data as APIResponse<Attachment>)?.items ?? [];

    return (
        <div style={{ padding: 16, backgroundColor: "#f4f4f4" }}>
            <Paper elevation={0} sx={{ p: 2, backgroundColor: "#fbfcfc" }}>
                {isPending && <div>Loading attachments...</div>}
                <div className="attachments">
                    {attachments.map((attachment, index) => (
                        <div key={attachment.id} className="attachment">
                            <h3>Attachment {index + 1}</h3>
                            {attachment.contentType === "text/html" ? (
                                <div dangerouslySetInnerHTML={{ __html: attachment.content }} />
                            ) : (
                                <pre>{attachment.content}</pre>
                            )}
                        </div>
                    ))}
                </div>
            </Paper>
        </div>
    );
}

function LogEntriesTable({ parentJob }: { parentJob: Job }) {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });
    const { data, isPending, error } = useGetJobLogsQuery(
        parentJob.id,
        {
            count: pagination.pageSize,
            offset: pagination.pageIndex * pagination.pageSize,
        },
        { refresh: parentJob.status === "running" },
    );

    const columns = useMemo<ColumnDef<LogEntry>[]>(
        () => [
            {
                header: "Severity",
                accessorKey: "level",
                cell: ({ getValue }) => {
                    const level = String(getValue());
                    return level in logSeverityMap ? logSeverityMap[level as keyof typeof logSeverityMap] : "-";
                },
            },
            {
                header: "Message",
                accessorKey: "log",
                cell: ({ getValue }) => {
                    const message = String(getValue());

                    const clipLength = 140;
                    const shouldClipText = message.length > clipLength + 3;

                    if (shouldClipText) {
                        return (
                            <CustomTooltip title={shouldClipText ? message : ""} arrow placement="top-start">
                                <span>{`${message.substring(0, clipLength)}...`}</span>
                            </CustomTooltip>
                        );
                    }

                    return message;
                },
            },
            {
                header: "Date",
                accessorKey: "masterDate",
                cell: ({ getValue }) => (getValue() ? dayjs(String(getValue())).format("YYYY/MM/DD h:mm:ss A") : "-"),
            },
        ],
        [],
    );

    // Pagination handlers
    const handlePageChange = (newPageIndex: number) => {
        setPagination((prev) => ({
            ...prev,
            pageIndex: newPageIndex,
        }));
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPagination((prev) => ({
            ...prev,
            pageSize: newPageSize,
            pageIndex: 0,
        }));
    };

    let status: TableProps<LogEntry>["status"] = "valid";
    if (isPending) {
        status = "standBy";
    } else if (error) {
        status = "invalid";
    }

    return (
        <Table
            columns={columns}
            data={data?.items ?? []}
            getRowId={(row) => row.id}
            status={status}
            expandable={{
                renderExpandedRow: ({ original, getIsExpanded }) => (
                    <LogAttachments
                        parentId={original.id}
                        hasAttachments={original.attachments}
                        expanded={getIsExpanded()}
                    />
                ),
                getRowCanExpand: ({ original }) => original.attachments,
            }}
            pagination={{
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
                totalItems: data?.total ?? 0,
                onPageChange: handlePageChange,
                onPageSizeChange: handlePageSizeChange,
            }}
        />
    );
}

function JobReport({ job }: { job: Job }) {
    const downloadLogsMutation = useDownloadJobLogsMutation(job.id);

    const handleDownloadLogs = async () => {
        try {
            const response = await downloadLogsMutation.mutateAsync();

            const blob = new Blob([response], {
                type: "application/octet-stream",
            });

            const fileURL = window.URL.createObjectURL(blob);

            // Browser handles download natively
            window.location.assign(fileURL);
        } catch (err) {
            console.error("Download failed", err);
        }
    };

    return (
        <Box mt={5}>
            <CardContainer width="100%" minHeight={0} padding={2}>
                <CollapsibleSection
                    title="Reports"
                    defaultOpen={true}
                    button={
                        <StyledButton
                            variant="outlined"
                            style={{ border: "1px solid #000", width: "auto" }}
                            onClick={handleDownloadLogs}
                            disabled={downloadLogsMutation.isPending}
                        >
                            <img src={ExportIcon} alt="download-icon" />
                            {downloadLogsMutation.isPending ? "Downloading..." : "Download"}
                        </StyledButton>
                    }
                >
                    <div style={{ maxHeight: 420, overflowY: "auto" }}>
                        <LogEntriesTable parentJob={job} />
                    </div>
                </CollapsibleSection>
            </CardContainer>
        </Box>
    );
}

export default function ProtectionJobDetails() {
    const initialJob = useLoaderData() as Job;
    const [jobStatus, setJobStatus] = useState(initialJob.status);
    const { data: job } = useGetJobQuery(initialJob.id, { refresh: jobStatus === "running" });

    useEffect(() => {
        if (job?.status) {
            setJobStatus(job.status);
        }
    }, [job?.status]);

    const navigate = useNavigate();

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
                            onClick={() => navigate("/monitoring/jobs/protection")}
                        />
                        {job?.message ?? "-"}
                    </Box>
                }
            />

            {/* Overview */}
            <JobOverview job={job ?? initialJob} />

            {/* Reports */}
            {job?.id && <JobReport job={job} />}
        </Box>
    );
}
