import { useQuery } from "@tanstack/react-query";
import type {
  PaginationParams,
  APIResponse,
  QueryOptions,
} from "../../types/tabletype";
import {
  CACHE_TIME_SHORT,
  FAST_REFRESH_INTERVAL,
  LIST_CACHE_TIME,
} from "../../constant/Constant";
import dataProtectionClient from "./dataProtection";
import type { DataProtectionJob } from "../../types/jobs";

type QueryParams = {
  summary?: string;
  name?: string;
  status?: string;
  user?: string;
  parentJobId?: string;
  source?: string;
  sources?: string[];
  statuses?: string[];
};

// Helper to determine refresh interval: false, numeric override, or default FAST_REFRESH_INTERVAL
const getRefreshInterval = (refresh?: boolean | number): number | false => {
  if (refresh === false || refresh === undefined) return false;
  if (typeof refresh === "number") return refresh;
  return FAST_REFRESH_INTERVAL;
};

// Map backend status values to DataProtectionJob status values
const mapBackendStatus = (
  status?: string
): "running" | "successful" | "failed" | "cancelled" => {
  if (!status) return "running";

  const statusUpper = status.toUpperCase();

  // Handle enum format (eJOB_*)
  if (
    statusUpper === "EJOB_SUCCEEDED" ||
    statusUpper.includes("SUCCESS") ||
    statusUpper === "COMPLETED"
  ) {
    return "successful";
  }
  if (
    statusUpper === "EJOB_FAILED" ||
    statusUpper.includes("FAIL") ||
    statusUpper.includes("ERROR")
  ) {
    return "failed";
  }
  if (
    statusUpper === "EJOB_CANCELED" ||
    statusUpper === "EJOB_CANCELLED" ||
    statusUpper.includes("CANCEL") ||
    statusUpper.includes("ABORT")
  ) {
    return "cancelled";
  }
  if (
    statusUpper === "EJOB_RUNNING" ||
    statusUpper.includes("RUNNING") ||
    statusUpper.includes("PROGRESS") ||
    statusUpper.includes("PENDING")
  ) {
    return "running";
  }

  return "running";
};

const monitoringApi = {
  useGetJobsQuery: (
    params?: QueryParams & PaginationParams,
    options?: QueryOptions
  ) => {
    return useQuery<APIResponse<DataProtectionJob>>({
      queryKey: ["job-cache", params],
      queryFn: async () => {
        // Build query parameters for the backend API
        const queryParams: Record<string, unknown> = {};

        // Backend uses page/limit instead of offset/count
        if (params?.offset !== undefined && params?.count !== undefined) {
          queryParams.page = Math.floor(params.offset / params.count) + 1;
          queryParams.limit = params.count;
        }

        // Add search/filter parameters
        if (params?.name || params?.summary) {
          queryParams.name = params.name || params.summary;
        }
        if (params?.status) {
          queryParams.status = params.status;
        }
        if (params?.source) {
          queryParams.source = params.source;
        }
        // Handle multiple sources
        if (params?.sources && params.sources.length > 0) {
          queryParams.source = params.sources.join(",");
        }
        // Handle multiple statuses
        if (params?.statuses && params.statuses.length > 0) {
          queryParams.status = params.statuses.join(",");
        }
        if (params?.parentJobId) {
          queryParams.parentJobId = params.parentJobId;
        }

        const response = await dataProtectionClient.get(`/jobs`, {
          params: queryParams,
        });

        // Transform backend response to expected format
        const backendData = response.data;

        return {
          items: (backendData.data || []).map((job: any) => ({
            id: job.external_id,
            status: mapBackendStatus(job.status),
            startTime: job.started_at,
            endTime: job.finished_at || null,
            description: job.name || "",
            message: job.metadata?.title?.text || job.name || "",
            user:
              typeof job.metadata?.user === "string"
                ? job.metadata.user
                : job.metadata?.user?.username ||
                  job.metadata?.user?.name ||
                  null,
            userTags:
              job.metadata?.tags?.map(
                (tag: any) => `${tag.key}:${tag.value}`
              ) || [],
            policyName: null,
            operation: job.metadata?.title?.messageCode || "",
            hasLogs: job.metadata?.reports?.length > 0 || false,
            source: job.source,
          })),
          total: backendData.total || 0,
          offset: params?.offset || 0,
          count: (backendData.data || []).length,
        };
      },
      staleTime: LIST_CACHE_TIME,
      refetchInterval: getRefreshInterval(options?.refresh),
      placeholderData: (prev) => prev,
    });
  },
};

export const { useGetJobsQuery } = monitoringApi;

// Loader-friendly API: fetch a job by ID without hooks

export const useGetJobStatsQuery = (
  params?: { sources?: string[]; name?: string },
  options?: QueryOptions
) => {
  return useQuery<{
    total: number;
    successful: number;
    failed: number;
    running: number;
  }>({
    queryKey: ["job-stats", params],
    queryFn: async () => {
      const queryParams: Record<string, unknown> = {};

      // Handle search
      if (params?.name) {
        queryParams.name = params.name;
      }

      if(params?.sources && params.sources.length > 0) {
        queryParams.sources = params.sources.join(",");
      }

      const response = await dataProtectionClient.get(`/jobs/stats`, {
        params: queryParams,
      });

      return response.data;
    },
    staleTime: CACHE_TIME_SHORT,
    refetchInterval: getRefreshInterval(options?.refresh),
  });
};

export default monitoringApi;
