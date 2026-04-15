import React, { useCallback, useEffect, useState } from "react";
import { SelectChangeEvent, Snackbar, Alert } from "@mui/material";
import JobTable from "./JobTable";
import { Job } from "./models";
import { searchJobs, JobSearchRequest, JobHit } from "../../../../../api/JobsApi";
import { useOutletContext } from "react-router-dom";
import useDebounce from "../../../../../hooks/useDebounce";
import { useNotifier } from "../../../../../hooks/useNotifier";

interface TitleField {
    text?: string;
}

export interface JobSource {
    id?: string;
    jobId?: string;
    status?: string;
    name?: string;
    title?: TitleField;
    severity?: string;
    storageSystem?: string;
    duration?: string | number;
    startDate?: string | number;
    endDate?: string | number;
    user?: string;
}

interface JobLayoutContext {
    searchValue: string;
    onSearchChange: (value: string) => void;
}

const ProvisioningJobs: React.FC = () => {
    const { searchValue } = useOutletContext<JobLayoutContext>();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const [orderBy, setOrderBy] = useState<string>("createdDate");
    const [loading, setLoading] = useState(false);
    const [totalJobs, setTotalJobs] = useState(0);
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        type: "success" as "success" | "error",
    });

    const debouncedSearch = useDebounce(searchValue, 2000);

    const { showNotification } = useNotifier();

    const closeNotification = () => setNotification((n) => ({ ...n, open: false }));

    // Map free-form user input to a canonical status token
    // Returns one of: "FAILED" | "SUCCESS" | "SUCCESS_WITH_ERROR" | null
    const mapToCanonicalStatus = (term: string): "FAILED" | "SUCCESS" | "SUCCESS_WITH_ERROR" | "IN_PROGRESS" | null => {
        const raw = String(term || "").toLowerCase();
        const normalized = raw.replace(/[^a-z]/g, "");
        const contains = (w: string) => normalized.includes(w);

        // SUCCESS WITH ERROR if input mentions both success and error, or prefix like "success w", or abbreviation "swe"
        if ((contains("success") && contains("error")) || normalized.startsWith("successw") || normalized.includes("swe") || contains("error")) {
            return "SUCCESS_WITH_ERROR";
        }

        // FAILED if mentions fail/failed or error
        if (contains("fail") || contains("failed")) {
            return "FAILED";
        }
        if (contains("inprogress") || contains("inprogress")) {
            return "IN_PROGRESS";
        }

        // SUCCESS if mentions success
        if (contains("success")) {
            return "SUCCESS";
        }

        return null;
    };


    const fetchJobs = useCallback(
        async (searchTerm: string, page: number, rowsPerPage: number, order: "asc" | "desc", orderBy: string) => {
            try {
                setLoading(true);

                const sortPayload: Record<string, { order: "asc" | "desc" }> = {
                    [orderBy]: { order },
                };

                const query: JobSearchRequest["query"] = {
                    bool: {
                        must_not: [
                            {
                                exists: {
                                    field: "parentJobId",
                                },
                            },
                            {
                                terms: { "title.messageCode": ["DeviceEnrollmentJobTitleMessage", "DeviceDisenrollmentJobTitleMessage"] }

                            }
                        ],

                    },
                };

                if (searchTerm) {
                    const canonical = mapToCanonicalStatus(searchTerm);
                    if (canonical) {
                        // Build status-only variants (underscore and collapsed, upper/lower cases)
                        const statusVariants: Record<string, string[]> = {
                            SUCCESS: ["SUCCESS", "success"],
                            FAILED: ["FAILED", "failed"],
                            SUCCESS_WITH_ERROR: [
                                "SUCCESS_WITH_ERROR",
                                "success_with_error",
                                "SUCCESS_WITH_ERRORS",
                                "success_with_errors",
                                "SUCCESSWITHERROR",
                                "successwitherror",
                                "SUCCESSWITHERRORS",
                                "successwitherrors",
                            ],
                            IN_PROGRESS: ["IN_PROGRESS", "in_progress", "INPROGRESS", "inprogress"],
                        };

                        const variants = statusVariants[canonical] || [];
                        const queryString = variants.map((v) => `*${v}*`).join(" OR ");
                        query.bool!.should = [
                            {
                                query_string: {
                                    query: queryString,
                                    fields: ["status"], // status-only search per requirement
                                },
                            },
                        ];
                        query.bool!.minimum_should_match = 1;
                    } else {
                        // Fallback: general free-text search across fields
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

                    const transformedData: Job[] = hits
                        .map((hit: JobHit) => {
                            if (!hit._source) return null;

                            const source = hit._source as JobSource;

                            return {
                                id: source.id || source.jobId || hit._id || "-",
                                status: source.status || "Unknown",
                                name: source.name || (source.title as TitleField | undefined)?.text || "-",
                                severity: source.severity || "-",
                                storageSystem: source.storageSystem || "-",
                                duration: source.duration,
                                started: source.startDate || "-",
                                createdBy: source.user || "-",
                                endDate: source.endDate ? Number(source.endDate) : null,
                            };
                        })
                        .filter((job): job is Job => job !== null);

                    setJobs(transformedData);
                    setTotalJobs(response.data.hits?.total?.value || 0);
                } else if (response.error) {
                    setJobs([]);
                    setTotalJobs(0);
                    showNotification(response.error.message || "Request failed", "error");
                }
            } catch (err) {
                console.error("Error fetching jobs:", err);
                setJobs([]);
                setTotalJobs(0);
                showNotification("Failed to fetch jobs", "error");
            } finally {
                setLoading(false);
            }
        },
        [],
    );


    useEffect(() => {
        fetchJobs(debouncedSearch, page, rowsPerPage, order, orderBy);
    }, [debouncedSearch, page, rowsPerPage, order, orderBy, fetchJobs]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchJobs(debouncedSearch, page, rowsPerPage, order, orderBy);
        }, 15000);
        return () => clearInterval(interval);
    }, [debouncedSearch, page, rowsPerPage, order, orderBy, fetchJobs]);

    const handlePageChange = useCallback((_event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const handleRowsPerPageChange = useCallback((event: SelectChangeEvent<number>) => {
        setRowsPerPage(parseInt(event.target.value.toString(), 10));
        setPage(0);
    }, []);

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

    // const handleRefresh = useCallback(() => {
    //     fetchJobs(searchValue, page, rowsPerPage, order, orderBy);
    // }, [searchValue, page, rowsPerPage, order, orderBy, fetchJobs]);

    return (
        <>
            <JobTable
                jobs={jobs}
                searchValue={debouncedSearch}
                // onSearchChange={onSearchChange}
                count={totalJobs}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                onShowNotification={showNotification}
                // onRefresh={handleRefresh}
                loading={loading}
            />
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={closeNotification}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity={notification.type} onClose={closeNotification} sx={{ width: "100%" }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ProvisioningJobs;
