import { useCallback } from "react";

export const useEpochFormatter = () => {
    // Format epoch to "YYYY/MM/DD hh:mm AM/PM"
    const formatEpoch = useCallback((epoch: number | string | null | undefined) => {
        if (!epoch) return "";

        const date = new Date(Number(epoch));

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12 || 12;

        return `${year}/${month}/${day} ${hours}:${minutes} ${ampm}`;
    }, []);

    // Duration in minutes
    const getDuration = useCallback(
        (start: number | string | null | undefined, end: number | string | null | undefined) => {
            if (!start || !end) return "-";

            const s = Number(start);
            const e = Number(end);

            if (isNaN(s) || isNaN(e)) return "-";

            const diffMs = e - s;
            if (diffMs < 0) return "-";

            const totalSeconds = Math.floor(diffMs / 1000);

            // convert seconds → readable
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            const parts: string[] = [];
            if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
            if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? "s" : ""}`);
            if (seconds > 0 || parts.length === 0) parts.push(`${seconds} second${seconds > 1 ? "s" : ""}`);

            return parts.join(" ");
        },
        [],
    );

    return { formatEpoch, getDuration };
};
