import React from "react";
import { Box, Typography } from "@mui/material";
import InfoIcon from "../assets/InfoIcon.svg";

const NoMatchesFound: React.FC<{ message?: string, showSearchHint?: boolean }> = ({ message = "No Data Available", showSearchHint = false }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100%",
                width: "100%",
                pt: 1,
                background: "#fff",
                borderRadius: 2,
            }}
        >
            {/* You can replace this emoji with an icon if you prefer */}
            <Typography
                variant="h6"
                color="textPrimary"
                sx={{
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    fontSize: "16px",
                }}
            >
                <img src={InfoIcon} alt="" /> {message}
            </Typography>
            {showSearchHint &&

                <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 500, fontSize: "14px" }}>
                    Change the parameters and try again.
                </Typography>}
        </Box>
    );
};



export default NoMatchesFound;
