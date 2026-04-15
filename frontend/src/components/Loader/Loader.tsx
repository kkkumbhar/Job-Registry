import React from "react";
import { Box, keyframes, styled } from "@mui/material";

const pulse = keyframes`
  0%, 100% {
    transform: scaleY(1);
    opacity: 1;
  }
  50% {
    transform: scaleY(0.5);
    opacity: 0.5;
  }
`;

const LoaderWrapper = styled(Box)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "30px",
    gap: "8px",
    marginBottom: "16px",
});

const Bar = styled(Box)(() => ({
    width: "4px",
    height: "30px",
    background: `#CC0000`,
    animation: `${pulse} 1s infinite ease-in-out`,
    borderRadius: "8px",
}));

const Loader: React.FC = () => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                outline: "none",
            }}
        >
            <LoaderWrapper>
                <Bar sx={{ animationDelay: "0s" }} />
                <Bar sx={{ animationDelay: "0.1s" }} />
                <Bar sx={{ animationDelay: "0.2s" }} />
            </LoaderWrapper>
        </Box>
    );
};

export default Loader;
