import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import PageHeader from "../../../../components/PageHeader/PageHeader";
import JobSummary from "./components/JobSummary";
import { CardContainer } from "../../../../components/CardContainer/CardContainer";
import JobTableToolbar from "../../components/JobTableToolbar";

export default function JobLayout() {
    const [searchValue, setSearchValue] = useState("");

    const handleSearchChange = (_value: string) => {
        setSearchValue(_value);
    };

    const handleTabChange = () => {
        setSearchValue("");
    };

    const handleRefresh = () => {};

    const tabConfig = [
        { label: "Provisioning Jobs", href: "/monitoring/jobs" },
        { label: "Protection Jobs", href: "/monitoring/jobs/protection" },
    ];

    return (
        <>
            <PageHeader title={<span style={{ marginLeft: 6 }}>Jobs</span>} />

            <Box sx={{ width: "100%" }} mt={5}>
                <JobSummary />

                <CardContainer>
                    <JobTableToolbar
                        onSearch={handleSearchChange}
                        searchValue={searchValue}
                        onRefresh={handleRefresh}
                        pageName={"Job Details"}
                        tabConfig={tabConfig}
                        onTabChange={handleTabChange}
                    />

                    <Outlet context={{ searchValue, onSearchChange: handleSearchChange }} />
                </CardContainer>
            </Box>
        </>
    );
}
