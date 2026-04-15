import React from "react";
import { Box } from "@mui/material";
import Loader from "../Loader/Loader";


interface CenteredLoaderProps {
    minHeight?: number;
}

const CenteredLoader: React.FC<CenteredLoaderProps> = ({ minHeight = 240 }) => (
    <Box
        sx={{
            minHeight,
            width: "100%",
            position: "relative",
        }}
    >
        <Box
            sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "100%",
            }}
        >
            <Loader />
        </Box>
    </Box>
);

export default CenteredLoader;
