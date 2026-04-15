import React, { useCallback, useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import JobSummaryContainer from "./JobSummaryContainer";
import { searchJobs, JobSearchRequest } from "../../../../../api/JobsApi";
import { useGetJobsQuery } from "../../../../../api/DataProtection/Jobs";
import { FAST_REFRESH_INTERVAL } from "../../../../../constants/Constants";

interface AggregationBucket {
    key: string;
    doc_count: number;
}

const JobSummary: React.FC = () => {
    const { data: successfulJobsData } = useGetJobsQuery(
        { status: "successful", count: 0, offset: 0 },
        { refresh: FAST_REFRESH_INTERVAL },
    );
    const { data: failedJobsData } = useGetJobsQuery(
        { status: "failed", count: 0, offset: 0 },
        { refresh: FAST_REFRESH_INTERVAL },
    );
    const { data: runningJobsData } = useGetJobsQuery(
        { status: "running", count: 0, offset: 0 },
        { refresh: FAST_REFRESH_INTERVAL },
    );
    const [allJobSummary, setAllJobSummary] = useState<{
        inProgress: number;
        completed: number;
        failed: number;
    }>({
        inProgress: 0,
        completed: 0,
        failed: 0,
    });

    // Summary data to be displayed
    const [summaryData, setSummaryData] = useState({
        successRate: 0,
        total: 0,
        inProgress: 0,
        completed: 0,
        failed: 0,
    });

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        type: "success" as "success" | "error",
    });

    const showNotification = (message: string, type: "success" | "error") => {
        setNotification({ open: true, message, type });
    };

    const closeNotification = () => setNotification((n) => ({ ...n, open: false }));

    const fetchJobsSummary = useCallback(async () => {
        try {
            const payload: JobSearchRequest = {
                size: 0,
                track_total_hits: true,
                query: {
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
                },
                aggs: {
                    agg_terms_status: {
                        terms: {
                            field: "status",
                        },
                    },
                },
            };

            const response = await searchJobs(payload);

            if (response.data && response.data.aggregations) {
                const buckets: AggregationBucket[] = response.data.aggregations.agg_terms_status.buckets || [];

                let completed = 0;
                let failed = 0;
                let inProgress = 0;

                buckets.forEach((bucket) => {
                    const status = bucket.key.toLowerCase();

                    if (status === "success" || status === "success_with_errors") {
                        completed += bucket.doc_count;
                    } else if (status === "failed") {
                        failed += bucket.doc_count;
                    } else if (status.includes("progress") || status === "running") {
                        inProgress += bucket.doc_count;
                    }
                });

                setAllJobSummary({ inProgress, completed, failed });
            } else if (response.error) {
                showNotification(response.error.message || "Failed to fetch job summary", "error");
            }
        } catch (err) {
            console.error("Error fetching job summary:", err);
            showNotification("Failed to fetch job summary", "error");
        }
    }, []);

    useEffect(() => {
        fetchJobsSummary();
    }, [fetchJobsSummary]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchJobsSummary();
        }, 15000);
        return () => clearInterval(interval);
    }, [fetchJobsSummary]);

    // Update counts when job data changes.
    useEffect(() => {
        const inProgress = allJobSummary.inProgress + (runningJobsData?.total ?? 0);
        const completed = allJobSummary.completed + (successfulJobsData?.total ?? 0);
        const failed = allJobSummary.failed + (failedJobsData?.total ?? 0);
        const total = inProgress + completed + failed;
        const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        setSummaryData({
            inProgress,
            completed,
            failed,
            total,
            successRate,
        });
    }, [allJobSummary, successfulJobsData, failedJobsData, runningJobsData]);

    return (
        <>
            <JobSummaryContainer data={summaryData} />
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

export default JobSummary;
