import dayjs, { type Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { assertNever } from "./error";

// Extend dayjs with required plugins
dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);

export type DateLike = string | Dayjs | Date;

export type RelativeDateDirection = "to" | "from";

export const dateTimeFormatter = (date: DateLike): string => {
    let str;
    const d = dayjs(date);
    if (!d.isValid()) {
        str = "Invalid Date";
        console.error({ date });
    } else {
        // Format as "h:mm:ss A MM/DD/YYYY" (e.g., "1:17:27 PM 01/01/2026")
        str = d.format("h:mm:ss A MM/DD/YYYY");
    }
    return str;
};

export const dateFormatter = (date: DateLike): string => {
    let str;
    const d = dayjs(date);
    if (!d.isValid()) {
        str = "Invalid Date";
    } else {
        // Format as "MM/DD/YYYY" (e.g., "01/01/2026")
        str = d.format("MM/DD/YYYY");
    }
    return str;
};

/**
 * Formats a date as a relative time with configurable direction
 * @param date - The date to format (string, Dayjs, or Date object)
 * @param direction - "from" for "X ago" or "to" for "in X"
 * @returns Formatted relative time string
 */
export const relativeDateFormatter = (
    date: DateLike,
    direction: RelativeDateDirection,
    options?: { withoutSuffix?: boolean },
): string => {
    let str;
    const relativeDate = dayjs(date);

    if (!relativeDate.isValid()) {
        str = "Invalid Date";
        console.error({ date });
    } else {
        const withoutSuffix = options?.withoutSuffix ?? false;

        switch (direction) {
            case "from":
                str = relativeDate.fromNow(withoutSuffix);
                break;

            case "to":
                str = relativeDate.toNow(withoutSuffix);
                break;

            default:
                assertNever(direction);
        }
    }
    return str;
};

/**
 * Formats a date as a relative time from now (e.g., "2 days ago", "in 3 weeks")
 * @param dateString - The date string to format
 * @returns Formatted relative time string
 */
export function formatRelativeDate(dateString: string): string {
    return relativeDateFormatter(dateString, "from");
}

export const durationFormatter = (start: DateLike, end: DateLike): string => {
    let str;
    const startDate = dayjs(start);
    const endDate = dayjs(end);
    if (!startDate.isValid() || !endDate.isValid()) {
        str = "Invalid Date";

        console.error({ startDate, endDate });
    } else {
        str = startDate.to(endDate, true);
    }

    return str;
};
