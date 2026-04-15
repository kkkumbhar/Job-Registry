export interface MockJobData {
    external_id: string;
    source: string;
    name: string;
    status: string;
    metadata: {
        jobId: string;
        title: {
            text: string;
            messageCode: string;
            parameters: Record<string, unknown>;
        };
        user: string;
        status: string;
        createdDate: number;
        scheduledDate: number | null;
        startDate: number;
        endDate: number;
        parentJobId: string | null;
        reports: Array<{
            message?: {
                text: string;
                messageCode: string;
                parameters: Record<string, unknown>;
            };
            severity?: string;
            timestamp?: number;
        }>;
        links: Array<{
            rel: string;
            href: string;
        }>;
        tags: Array<{
            key: string;
            value: string;
        }>;
        isSystem: boolean;
        resources: Array<unknown>;
    };
    started_at: string;
    finished_at: string;
}

export const mockJobsData: MockJobData[] = [
    {
        external_id: "97b71cbb-602c-4570-8bef-3aa5935d7a04",
        source: "fleet",
        name: "Provisioning Settings Transfer from storage system 810235",
        status: "SUCCESS",
        metadata: {
            jobId: "97b71cbb-602c-4570-8bef-3aa5935d7a04",
            title: {
                text: "Provisioning Settings Transfer from storage system 810235",
                messageCode: "ServerSyncTaskTitleMessage",
                parameters: {
                    storageSystemId: "810235",
                    operation: "transfer",
                },
            },
            user: "admin@example.com",
            status: "SUCCESS",
            createdDate: 1769363168933,
            scheduledDate: null,
            startDate: 1769363168933,
            endDate: 1769363183202,
            parentJobId: null,
            reports: [
                {
                    message: {
                        text: "Starting provisioning settings transfer",
                        messageCode: "TRANSFER_START",
                        parameters: {},
                    },
                    severity: "INFO",
                    timestamp: 1769363168933,
                },
                {
                    message: {
                        text: "Connecting to storage system 810235",
                        messageCode: "SYSTEM_CONNECT",
                        parameters: { systemId: "810235" },
                    },
                    severity: "INFO",
                    timestamp: 1769363170000,
                },
                {
                    message: {
                        text: "Transfer completed successfully",
                        messageCode: "TRANSFER_COMPLETE",
                        parameters: {},
                    },
                    severity: "INFO",
                    timestamp: 1769363183202,
                },
            ],
            links: [
                {
                    rel: "self",
                    href: "/api/jobs/97b71cbb-602c-4570-8bef-3aa5935d7a04",
                },
            ],
            tags: [
                {
                    key: "environment",
                    value: "production",
                },
            ],
            isSystem: false,
            resources: [],
        },
        started_at: "2026-01-25T17:46:08.933Z",
        finished_at: "2026-01-25T17:46:23.202Z",
    },
    {
        external_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        source: "fleet",
        name: "Backup Job for Database Server",
        status: "FAILED",
        metadata: {
            jobId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            title: {
                text: "Backup Job for Database Server",
                messageCode: "BackupTaskTitleMessage",
                parameters: {
                    serverName: "DB-Server-01",
                    backupType: "full",
                },
            },
            user: "backup-admin@example.com",
            status: "FAILED",
            createdDate: 1769363000000,
            scheduledDate: null,
            startDate: 1769363000000,
            endDate: 1769363045000,
            parentJobId: null,
            reports: [
                {
                    message: {
                        text: "Backup initiated",
                        messageCode: "BACKUP_START",
                        parameters: {},
                    },
                    severity: "INFO",
                    timestamp: 1769363000000,
                },
                {
                    message: {
                        text: "Connection timeout to database server",
                        messageCode: "CONNECTION_ERROR",
                        parameters: { error: "timeout" },
                    },
                    severity: "ERROR",
                    timestamp: 1769363045000,
                },
            ],
            links: [
                {
                    rel: "self",
                    href: "/api/jobs/a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                },
            ],
            tags: [
                {
                    key: "type",
                    value: "backup",
                },
            ],
            isSystem: false,
            resources: [],
        },
        started_at: "2026-01-25T17:30:00.000Z",
        finished_at: "2026-01-25T17:30:45.000Z",
    },
    {
        external_id: "f1e2d3c4-b5a6-7890-1234-567890abcdef",
        source: "fleet",
        name: "Storage System Health Check",
        status: "RUNNING",
        metadata: {
            jobId: "f1e2d3c4-b5a6-7890-1234-567890abcdef",
            title: {
                text: "Storage System Health Check",
                messageCode: "HealthCheckTaskTitleMessage",
                parameters: {
                    systemId: "810236",
                },
            },
            user: "system@example.com",
            status: "RUNNING",
            createdDate: 1769363200000,
            scheduledDate: null,
            startDate: 1769363200000,
            endDate: 0,
            parentJobId: null,
            reports: [
                {
                    message: {
                        text: "Health check started",
                        messageCode: "HEALTH_CHECK_START",
                        parameters: {},
                    },
                    severity: "INFO",
                    timestamp: 1769363200000,
                },
                {
                    message: {
                        text: "Checking storage capacity",
                        messageCode: "CAPACITY_CHECK",
                        parameters: {},
                    },
                    severity: "INFO",
                    timestamp: 1769363210000,
                },
            ],
            links: [
                {
                    rel: "self",
                    href: "/api/jobs/f1e2d3c4-b5a6-7890-1234-567890abcdef",
                },
            ],
            tags: [
                {
                    key: "type",
                    value: "health-check",
                },
            ],
            isSystem: true,
            resources: [],
        },
        started_at: "2026-01-25T17:46:40.000Z",
        finished_at: "2026-01-25T17:46:40.000Z",
    },
    {
        external_id: "12345678-abcd-ef12-3456-7890abcdef12",
        source: "backup",
        name: "Data Replication to Secondary Site",
        status: "SUCCESS",
        metadata: {
            jobId: "12345678-abcd-ef12-3456-7890abcdef12",
            title: {
                text: "Data Replication to Secondary Site",
                messageCode: "ReplicationTaskTitleMessage",
                parameters: {
                    sourceSite: "primary-dc",
                    targetSite: "secondary-dc",
                },
            },
            user: "replication-service@example.com",
            status: "SUCCESS",
            createdDate: 1769363100000,
            scheduledDate: 1769363100000,
            startDate: 1769363100000,
            endDate: 1769363250000,
            parentJobId: null,
            reports: [
                {
                    message: {
                        text: "Replication started",
                        messageCode: "REPLICATION_START",
                        parameters: {},
                    },
                    severity: "INFO",
                    timestamp: 1769363100000,
                },
                {
                    message: {
                        text: "Syncing 1500 GB of data",
                        messageCode: "SYNC_PROGRESS",
                        parameters: { dataSize: "1500 GB" },
                    },
                    severity: "INFO",
                    timestamp: 1769363150000,
                },
                {
                    message: {
                        text: "Replication completed successfully",
                        messageCode: "REPLICATION_COMPLETE",
                        parameters: {},
                    },
                    severity: "INFO",
                    timestamp: 1769363250000,
                },
            ],
            links: [
                {
                    rel: "self",
                    href: "/api/jobs/12345678-abcd-ef12-3456-7890abcdef12",
                },
            ],
            tags: [
                {
                    key: "type",
                    value: "replication",
                },
                {
                    key: "priority",
                    value: "high",
                },
            ],
            isSystem: false,
            resources: [],
        },
        started_at: "2026-01-25T17:25:00.000Z",
        finished_at: "2026-01-25T17:27:30.000Z",
    },
    {
        external_id: "abcdef12-3456-7890-abcd-ef1234567890",
        source: "monitoring",
        name: "Storage Pool Expansion",
        status: "CANCELLED",
        metadata: {
            jobId: "abcdef12-3456-7890-abcd-ef1234567890",
            title: {
                text: "Storage Pool Expansion",
                messageCode: "PoolExpansionTaskTitleMessage",
                parameters: {
                    poolName: "Storage-Pool-A",
                    additionalCapacity: "5TB",
                },
            },
            user: "admin@example.com",
            status: "CANCELLED",
            createdDate: 1769363050000,
            scheduledDate: null,
            startDate: 1769363050000,
            endDate: 1769363080000,
            parentJobId: null,
            reports: [
                {
                    message: {
                        text: "Pool expansion started",
                        messageCode: "EXPANSION_START",
                        parameters: {},
                    },
                    severity: "INFO",
                    timestamp: 1769363050000,
                },
                {
                    message: {
                        text: "Job cancelled by user",
                        messageCode: "JOB_CANCELLED",
                        parameters: { cancelledBy: "admin@example.com" },
                    },
                    severity: "WARNING",
                    timestamp: 1769363080000,
                },
            ],
            links: [
                {
                    rel: "self",
                    href: "/api/jobs/abcdef12-3456-7890-abcd-ef1234567890",
                },
            ],
            tags: [
                {
                    key: "type",
                    value: "expansion",
                },
            ],
            isSystem: false,
            resources: [],
        },
        started_at: "2026-01-25T17:24:10.000Z",
        finished_at: "2026-01-25T17:24:40.000Z",
    },
    {
        external_id: "bbbbbbbb-1111-2222-3333-444444444444",
        source: "backup",
        name: "Incremental Backup - Application Servers",
        status: "SUCCESS",
        metadata: {
            jobId: "bbbbbbbb-1111-2222-3333-444444444444",
            title: {
                text: "Incremental Backup - Application Servers",
                messageCode: "IncrementalBackupTaskTitleMessage",
                parameters: {
                    backupType: "incremental",
                    targetServers: "app-cluster-01",
                },
            },
            user: "backup-scheduler@example.com",
            status: "SUCCESS",
            createdDate: 1769364000000,
            scheduledDate: 1769364000000,
            startDate: 1769364000000,
            endDate: 1769364120000,
            parentJobId: null,
            reports: [
                {
                    message: {
                        text: "Incremental backup started",
                        messageCode: "BACKUP_START",
                        parameters: {},
                    },
                    severity: "INFO",
                    timestamp: 1769364000000,
                },
                {
                    message: {
                        text: "Backed up 250 GB of data",
                        messageCode: "BACKUP_PROGRESS",
                        parameters: { dataSize: "250 GB" },
                    },
                    severity: "INFO",
                    timestamp: 1769364060000,
                },
                {
                    message: {
                        text: "Backup completed successfully",
                        messageCode: "BACKUP_COMPLETE",
                        parameters: {},
                    },
                    severity: "INFO",
                    timestamp: 1769364120000,
                },
            ],
            links: [
                {
                    rel: "self",
                    href: "/api/jobs/bbbbbbbb-1111-2222-3333-444444444444",
                },
            ],
            tags: [
                {
                    key: "type",
                    value: "backup",
                },
                {
                    key: "backup-type",
                    value: "incremental",
                },
            ],
            isSystem: false,
            resources: [],
        },
        started_at: "2026-01-25T18:00:00.000Z",
        finished_at: "2026-01-25T18:02:00.000Z",
    },
    {
        external_id: "cccccccc-2222-3333-4444-555555555555",
        source: "monitoring",
        name: "System Performance Analysis",
        status: "SUCCESS",
        metadata: {
            jobId: "cccccccc-2222-3333-4444-555555555555",
            title: {
                text: "System Performance Analysis",
                messageCode: "PerformanceAnalysisTaskTitleMessage",
                parameters: {
                    systemId: "all-systems",
                    analysisType: "comprehensive",
                },
            },
            user: "system-monitor@example.com",
            status: "SUCCESS",
            createdDate: 1769363500000,
            scheduledDate: 1769363500000,
            startDate: 1769363500000,
            endDate: 1769363800000,
            parentJobId: null,
            reports: [
                {
                    message: {
                        text: "Starting performance analysis",
                        messageCode: "ANALYSIS_START",
                        parameters: {},
                    },
                    severity: "INFO",
                    timestamp: 1769363500000,
                },
                {
                    message: {
                        text: "Analyzing CPU and memory usage patterns",
                        messageCode: "ANALYSIS_PROGRESS",
                        parameters: {},
                    },
                    severity: "INFO",
                    timestamp: 1769363650000,
                },
                {
                    message: {
                        text: "Performance analysis completed",
                        messageCode: "ANALYSIS_COMPLETE",
                        parameters: {},
                    },
                    severity: "INFO",
                    timestamp: 1769363800000,
                },
            ],
            links: [
                {
                    rel: "self",
                    href: "/api/jobs/cccccccc-2222-3333-4444-555555555555",
                },
            ],
            tags: [
                {
                    key: "type",
                    value: "monitoring",
                },
                {
                    key: "priority",
                    value: "medium",
                },
            ],
            isSystem: true,
            resources: [],
        },
        started_at: "2026-01-25T17:45:00.000Z",
        finished_at: "2026-01-25T17:50:00.000Z",
    },
    {
        external_id: "dddddddd-3333-4444-5555-666666666666",
        source: "backup",
        name: "Full System Backup - Production Environment",
        status: "RUNNING",
        metadata: {
            jobId: "dddddddd-3333-4444-5555-666666666666",
            title: {
                text: "Full System Backup - Production Environment",
                messageCode: "FullBackupTaskTitleMessage",
                parameters: {
                    backupType: "full",
                    environment: "production",
                },
            },
            user: "backup-admin@example.com",
            status: "RUNNING",
            createdDate: 1769364500000,
            scheduledDate: 1769364500000,
            startDate: 1769364500000,
            endDate: 0,
            parentJobId: null,
            reports: [
                {
                    message: {
                        text: "Full backup initiated",
                        messageCode: "BACKUP_START",
                        parameters: {},
                    },
                    severity: "INFO",
                    timestamp: 1769364500000,
                },
                {
                    message: {
                        text: "Backing up 2.5 TB of data...",
                        messageCode: "BACKUP_IN_PROGRESS",
                        parameters: { estimatedSize: "2.5 TB" },
                    },
                    severity: "INFO",
                    timestamp: 1769364600000,
                },
            ],
            links: [
                {
                    rel: "self",
                    href: "/api/jobs/dddddddd-3333-4444-5555-666666666666",
                },
            ],
            tags: [
                {
                    key: "type",
                    value: "backup",
                },
                {
                    key: "environment",
                    value: "production",
                },
            ],
            isSystem: false,
            resources: [],
        },
        started_at: "2026-01-25T18:15:00.000Z",
        finished_at: "2026-01-25T18:15:00.000Z",
    },
];
