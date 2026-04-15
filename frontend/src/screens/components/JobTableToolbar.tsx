import React from "react";
import { Stack, Typography, Box, Tabs, Tab } from "@mui/material";
import SearchBox from "./SearchBox/SearchBox";
import { SEARCH_PLACEHOLDER } from "../jobs/components/Constants";

interface JobTableToolbarProps {
    onSearch: (value: string) => void;
    searchValue: string;
    onRefresh?: () => void;
    pageName?: string;
    tabConfig?: { label: string; href: string }[];
    onTabChange?: () => void;
}

const JobTableToolbar: React.FC<JobTableToolbarProps> = ({ onSearch, searchValue }) => {
    return (
        <Box>
            <Stack direction="row" spacing={4} alignItems="center" justifyContent="flex-end">
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <SearchBox
                        placeholder={SEARCH_PLACEHOLDER.JOB}
                        value={searchValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value)}
                        style={{ minWidth: "270px" }}
                        onClearSearch={() => onSearch("")}
                    />
                </Stack>
            </Stack>
        </Box>
    );
};

export default JobTableToolbar;
