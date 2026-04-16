import dayjs from "dayjs";

export const formatDuration = (startTime: string, endTime: string | undefined | null, now: number) => {
    // Use server timestamps for start and end
    const start = dayjs(startTime).valueOf();
    const end = endTime ? dayjs(endTime).valueOf() : now;
    const diffMs = end - start;

    // If clock skew causes negative duration, show "-" instead
    if (diffMs < 0) return "-";

    const seconds = Math.floor(diffMs / 1000);

    if (seconds < 60) return `${seconds} seconds`;

    if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes} minutes ${secs} seconds`;
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours} hours ${minutes} minutes ${secs} seconds`;
};