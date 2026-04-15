import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

const formatDuration = (startTime: string, endTime: string | undefined | null, now: number) => {
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

export { formatDuration };

export default function JobDuration({
    startTime,
    endTime,
    isRunning,
}: {
    startTime?: string;
    endTime?: string | null;
    isRunning: boolean;
}) {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!isRunning || !startTime) return;

        // Update now immediately and then every second for running jobs
        setNow(Date.now());
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, startTime]);

    const duration = useMemo(() => {
        if (!startTime) return "-";

        return formatDuration(startTime, endTime, now);
    }, [startTime, endTime, now]);

    return <>{duration}</>;
}
