import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import JobTable from "./JobTable";
import { useGetJobsQuery } from "../../../../../api/DataProtection/Jobs";
import type { Job } from "./models";
import type { Job as DataProtectionJob } from "../../../../../types/DataProtection/Job";
import { SelectChangeEvent } from "@mui/material/Select";
import useDebounce from "../../../../../hooks/useDebounce";
import { formatDuration } from "./JobDuration";

interface JobLayoutContext {
    searchValue: string;
    onSearchChange: (value: string) => void;
}

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


export default function ProtectionJobs({ parentJobId }: { parentJobId?: string }) {
    const { searchValue } = useOutletContext<JobLayoutContext>();
    const debouncedSearchValue = useDebounce(searchValue, 500);
    const [pageSize, setPageSize] = useState(10);
    const [offset, setOffset] = useState(0);
    const { data, isLoading } = useGetJobsQuery(
        {
            parentJobId: parentJobId,
            summary: debouncedSearchValue,
            status: debouncedSearchValue,
            user: debouncedSearchValue,
            offset: offset,
            count: pageSize,
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

    return (
        <JobTable
            jobs={jobs}
            searchValue={debouncedSearchValue}
            // onSearchChange={onSearchChange}
            count={count}
            page={page}
            rowsPerPage={pageSize}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            order={"desc"}
            orderBy={"createdDate"}
            onRequestSort={() => { }}
            onShowNotification={() => { }}
            // onRefresh={() => {}}
            loading={isLoading}
        />
    );
}
