export const toPascalCase = (str?: string): string => {
    if (!str) return "—";

    return str
        .toLowerCase()
        .split(/[_\s-]+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
};

/**
 * Universal JSON-like value type (allows anything except functions)
 */
export type UnknownValue = string | number | boolean | null | UnknownValue[] | UnknownObject;

/**
 * Safe nested object type for unknown API payloads
 */
export type UnknownObject = {
    [key: string]: UnknownValue;
};

export type TableResult = {
    title: string;
    type: "table";
    columns: string[];
    rows: UnknownValue[][];
};

export type KeyValueResult = {
    title: "Request Information";
    parameter: string;
    value: UnknownValue;
};

export type ApiResponseResult = TableResult | KeyValueResult;

/**
 * Step 1: Transform raw API payload into tables / key-value results
 */
export function transformApiResponse(apiResponse: UnknownObject): ApiResponseResult[] {
    const result: ApiResponseResult[] = [];

    for (const key in apiResponse) {
        let value = apiResponse[key];
        // If value is an empty array, replace it with "-"
        if (Array.isArray(value) && value.length === 0) {
            value = "-";
        }

        if (Array.isArray(value)) {
            if (value.length > 0 && typeof value[0] === "object" && value[0] !== null && !Array.isArray(value[0])) {
                const columns = Object.keys(value[0] as UnknownObject);

                const rows = value.map((item) => columns.map((col) => (item as UnknownObject)[col]));

                result.push({
                    title: key,
                    type: "table",
                    columns,
                    rows,
                });
                continue;
            }
        }

        result.push({
            title: "Request Information",
            parameter: key,
            value,
        });
    }

    return result;
}

/**
 * Type guard to check if ApiResponseResult is TableResult
 */
function isTableResult(item: ApiResponseResult): item is TableResult {
    return "type" in item && item.type === "table";
}

/**
 * Step 2: Merge all Request Information entries
 */
export function mergeTargetResources(results: ApiResponseResult[]): ApiResponseResult[] {
    const merged: ApiResponseResult[] = [];
    const targetResources: UnknownObject = {};

    for (const item of results) {
        if (isTableResult(item)) {
            merged.push(item);
        } else if (item.title === "Request Information") {
            if (typeof item.value === "object" && item.value !== null && !Array.isArray(item.value)) {
                Object.assign(targetResources, item.value as UnknownObject);
            } else {
                targetResources[item.parameter] = item.value;
            }
        }
    }

    if (Object.keys(targetResources).length > 0) {
        merged.push({
            title: "Request Information",
            parameter: "Request Information",
            value: targetResources,
        });
    }

    return merged;
}

/**
 * Combined utility: first transform, then merge Target Resources
 */
export function transformAndMergeApiResponse(apiResponse: UnknownObject): ApiResponseResult[] {
    const transformed = transformApiResponse(apiResponse);
    return mergeTargetResources(transformed);
}

// utils/formatLabel.ts
// export const formatLabel = (text: string): string => {
//   if (!text) return "";
//   const result = text.replace(/([A-Z])/g, " $1");
//   return result.charAt(0).toUpperCase() + result.slice(1);
// };
export const formatLabel = (str?: string): string => {
    if (!str) return "—";

    // Remove weird spacing: D E D U P → DEDUP
    const compact = str.replace(/\s+/g, "");

    // Insert space before capital letters in camelCase
    const camelSpaced = compact.replace(/([a-z])([A-Z])/g, "$1 $2");

    // Replace snake_case with spaces
    const cleaned = camelSpaced.replace(/_/g, " ");

    // Convert to Title Case
    return cleaned
        .toLowerCase()
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

/* ================= Volume Name Validation Utils ================= */

/**
 * NEW validation regex
 */
const NEW_VOLUME_NAME_PATTERN = /^[A-Za-z0-9 !#$%&'()+,.\-/:=@[\]^_`{}~]+$/;

/**
 * OLD validation regex
 */
const OLD_VOLUME_NAME_PATTERN = /^(?![ -])[A-Za-z0-9._@\- ]+(?<! )$/;

export const FirmwareVersionPrefixEnum = {
    SVOS103_RH20KM2U: "A3-03-01",
    SVOS102_RH20KM2U: "A3-02-21",
    SVOS987MR_R900_RH10KETP_2023_7E: "90-09-25",
    SVOS987MR_HM900_RH10KMH4_2023_7E: "93-07-24",
    SVOS987_R900_RH10KETP: "90-09-2",
    SVOS987_HM900_RH10KMH4: "93-07-2",
    SVOS981_R900: "90-08-2",
    SVOS961_R900: "90-06-0",
    SVOS951_HM900: "93-03-2",
    SVOS940_HM900: "93-02-0",
    SVOS920_HM900: "93-00-0",
    SVOS912_R900: "90-01-4",
    SVOS910_R900: "90-00-0",
    SVOS910_R850: "88-04-0",
    SVOS831_HM850: "88-03-2",
    SVOS830_HM850: "88-03-0",
    SVOS830_Rx00: "80-06-6",
    SVOS820_HM850: "88-02-0",
    SVOS820_Rx00: "80-06-4",
    SVOS810_HM850: "88-01-0",
    SVOS741_HM800: "83-06-0",
    SVOS740_HM800: "83-05-2",
    SVOS740_Rx00: "80-06-2",
    SVOS731_HM800: "83-05-0",
    SVOS731_Rx00: "80-06-0",
    SVOS730_HM800: "83-04-6",
    SVOS730_Rx00: "80-05-6",
    SVOS720_HM800: "83-04-4",
    SVOS720_Rx00: "80-05-4",
    SVOS712_HM800: "83-04-3",
    SVOS712_Rx00: "80-05-3",
    SVOS710_HM800: "83-04-2",
    SVOS710_Rx00: "80-05-2",
    SVOS700_HM800: "83-04-0",
    SVOS700_Rx00: "80-05-0",
    SVOS641_HM800: "83-03-2",
    SVOS641_Rx00: "80-04-2",
    SVOS640_HM800: "83-03-0",
    SVOS640_Rx00: "80-04-0",
} as const

/**
 * Normalize firmware version
 * Example: "88-03-2" → 88032
 * Example: "88-08-00-60/00" → 880800
 */
const normalizeFirmwareVersion = (version?: string): number => {
    if (!version) return 0;

    const main = version.split("/")[0];
    const numeric = main.replace(/-/g, "");

    const normalized = Number(numeric) || 0;

    return normalized;
};

/**
 * SVOS v8.3 cutoff for HM850
 */
const isHM850NewFirmware = (firmwareVersion?: string): boolean => {
    const base = normalizeFirmwareVersion(FirmwareVersionPrefixEnum.SVOS830_HM850);
    const current = normalizeFirmwareVersion(firmwareVersion);

    return current >= base;
};

/**
 * Decide whether NEW rules apply
 * Firmware logic ONLY applies to HM850
 */
const shouldUseNewVolumeNameRules = (model?: string, firmwareVersion?: string): boolean => {
    if (!model) return false;

    if (model === "HM850") {
        const result = isHM850NewFirmware(firmwareVersion);
        return result;
    }

    if (model === "HM900" || model === "RH10K MH4" || model === "RH20K_MID") {
        return true;
    }

    return false;
};

/**
 * Central volume name validator
 */
export const validateVolumeName = (value: unknown, model?: string, firmwareVersion?: string): string | null => {
    const label = String(value ?? "");

    if (!label.trim()) {
        return "Parameter label carries null or empty value. Please specify appropriate value.";
    }

    if (label.length > 32) {
        return `Parameter label carries invalid value. Value '${label}' is longer than the allowed 32 characters.`;
    }

    const isNewRule = shouldUseNewVolumeNameRules(model, firmwareVersion);
    const pattern = isNewRule ? NEW_VOLUME_NAME_PATTERN : OLD_VOLUME_NAME_PATTERN;

    if (!pattern.test(label)) {
        return isNewRule
            ? `Parameter label carries invalid value: '${label}'. Only alphanumeric characters, '!#$%&'()+,-./:=@[\\]^_\`{}~' and spaces are allowed.`
            : `Parameter label carries invalid value: '${label}'. Only alphanumeric characters, hyphens, periods, underscores, at signs and spaces are allowed. label cannot start with a hyphen or a space and cannot end with a space.`;
    }
    return null;
};

export const isValidHex = (val: string) => /^[0-9a-fA-F:]+$/.test(val);

export const normalizeHex = (val: string) => val.replace(/:/g, "").toUpperCase();

export const validateHexRange = (from?: string, to?: string) => {
  if (!from || !to) return null;

  const f = parseInt(normalizeHex(from), 16);
  const t = parseInt(normalizeHex(to), 16);

  if (Number.isNaN(f) || Number.isNaN(t)) {
    return "Invalid hexadecimal value";
  }

  if (f > t) {
    return "From value must be less than or equal to To value";
  }

  return null;
};
export const formatHexValue = (val: string) => {
  const clean = val.replace(/[^0-9a-fA-F]/g, "").toUpperCase();
  if (clean.length === 2) return `${clean}:`;
  return clean;
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const validateCsvFile = (
    file: File,
    notify: (message: string) => void
): boolean => {
    if (file.size > MAX_FILE_SIZE) {
        notify("File size must be less than 5MB");
        return false;
    }
    return true;
};





