import React from "react";
import { Box, FormControl, FormGroup, FormControlLabel, Checkbox, Typography, Paper, Chip } from "@mui/material";

interface JobFiltersProps {
    availableSources: string[];
    selectedSources: string[];
    onSourceChange: (sources: string[]) => void;
    availableStatuses: string[];
    selectedStatuses: string[];
    onStatusChange: (statuses: string[]) => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({
    availableSources,
    selectedSources,
    onSourceChange,
    availableStatuses,
    selectedStatuses,
    onStatusChange,
}) => {
    const handleSourceChange = (source: string) => {
        const newSelectedSources = selectedSources.includes(source)
            ? selectedSources.filter((s) => s !== source)
            : [...selectedSources, source];

        onSourceChange(newSelectedSources);
    };

    const handleStatusChange = (status: string) => {
        const newSelectedStatuses = selectedStatuses.includes(status)
            ? selectedStatuses.filter((s) => s !== status)
            : [...selectedStatuses, status];

        onStatusChange(newSelectedStatuses);
    };

    const handleSourceSelectAll = () => {
        if (selectedSources.length === availableSources.length) {
            onSourceChange([]);
        } else {
            onSourceChange([...availableSources]);
        }
    };

    const handleStatusSelectAll = () => {
        if (selectedStatuses.length === availableStatuses.length) {
            onStatusChange([]);
        } else {
            onStatusChange([...availableStatuses]);
        }
    };

    const getSourceBadgeStyles = (source: string) => {
        const styles: Record<string, { bg: string; color: string }> = {
            fleet: { bg: "#e3f2fd", color: "#1565c0" },
            protector: { bg: "#fff3e0", color: "#e65100" },
        };
        return styles[source.toLowerCase()] || { bg: "#f5f5f5", color: "#666" };
    };

    const getStatusBadgeStyles = (status: string) => {
        const styles: Record<string, { bg: string; color: string }> = {
            success: { bg: "#e8f5e9", color: "#2e7d32" },
            failed: { bg: "#ffebee", color: "#dc3545" },
            "in progress": { bg: "#fff8e1", color: "#f57c00" },
            canceled: { bg: "#fafafa", color: "#757575" },
        };
        return styles[status.toLowerCase()] || { bg: "#f5f5f5", color: "#666" };
    };

    return (
        <Paper
            sx={{
                padding: 2,
                marginBottom: 2,
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Source Filter */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, minWidth: "80px", color: "#333" }}>
                        Source:
                    </Typography>
                    <FormControl component="fieldset">
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={
                                            selectedSources.length === availableSources.length &&
                                            availableSources.length > 0
                                        }
                                        indeterminate={
                                            selectedSources.length > 0 &&
                                            selectedSources.length < availableSources.length
                                        }
                                        onChange={handleSourceSelectAll}
                                        size="small"
                                        sx={{
                                            color: "#999",
                                            "&.Mui-checked": {
                                                color: "#667eea",
                                            },
                                        }}
                                    />
                                }
                                label={<strong style={{ fontSize: "14px" }}>All</strong>}
                            />
                            {availableSources.map((source) => {
                                const badgeStyles = getSourceBadgeStyles(source);
                                return (
                                    <FormControlLabel
                                        key={source}
                                        control={
                                            <Checkbox
                                                checked={selectedSources.includes(source)}
                                                onChange={() => handleSourceChange(source)}
                                                size="small"
                                                sx={{
                                                    color: "#999",
                                                    "&.Mui-checked": {
                                                        color: badgeStyles.color,
                                                    },
                                                }}
                                            />
                                        }
                                        label={
                                            <Chip
                                                label={source.charAt(0).toUpperCase() + source.slice(1)}
                                                size="small"
                                                sx={{
                                                    backgroundColor: selectedSources.includes(source)
                                                        ? badgeStyles.bg
                                                        : "#f5f5f5",
                                                    color: selectedSources.includes(source)
                                                        ? badgeStyles.color
                                                        : "#999",
                                                    fontWeight: 600,
                                                    fontSize: "13px",
                                                }}
                                            />
                                        }
                                    />
                                );
                            })}
                        </FormGroup>
                    </FormControl>
                </Box>

                {/* Status Filter */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, minWidth: "80px", color: "#333" }}>
                        Status:
                    </Typography>
                    <FormControl component="fieldset">
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={
                                            selectedStatuses.length === availableStatuses.length &&
                                            availableStatuses.length > 0
                                        }
                                        indeterminate={
                                            selectedStatuses.length > 0 &&
                                            selectedStatuses.length < availableStatuses.length
                                        }
                                        onChange={handleStatusSelectAll}
                                        size="small"
                                        sx={{
                                            color: "#999",
                                            "&.Mui-checked": {
                                                color: "#667eea",
                                            },
                                        }}
                                    />
                                }
                                label={<strong style={{ fontSize: "14px" }}>All</strong>}
                            />
                            {availableStatuses.map((status) => {
                                const badgeStyles = getStatusBadgeStyles(status);
                                return (
                                    <FormControlLabel
                                        key={status}
                                        control={
                                            <Checkbox
                                                checked={selectedStatuses.includes(status)}
                                                onChange={() => handleStatusChange(status)}
                                                size="small"
                                                sx={{
                                                    color: "#999",
                                                    "&.Mui-checked": {
                                                        color: badgeStyles.color,
                                                    },
                                                }}
                                            />
                                        }
                                        label={
                                            <Chip
                                                label={status}
                                                size="small"
                                                sx={{
                                                    backgroundColor: selectedStatuses.includes(status)
                                                        ? badgeStyles.bg
                                                        : "#f5f5f5",
                                                    color: selectedStatuses.includes(status)
                                                        ? badgeStyles.color
                                                        : "#999",
                                                    fontWeight: 600,
                                                    fontSize: "13px",
                                                }}
                                            />
                                        }
                                    />
                                );
                            })}
                        </FormGroup>
                    </FormControl>
                </Box>
            </Box>
        </Paper>
    );
};

export default JobFilters;
