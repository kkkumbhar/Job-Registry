import { useEffect, useMemo, useState } from "react";
import { formatDuration } from "../../../utils/formatDuration";

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

        // Update now every second for running jobs
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
