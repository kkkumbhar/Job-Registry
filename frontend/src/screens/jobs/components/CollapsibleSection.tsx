import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import BackIcon from "assets/BackButton.svg";

interface Props {
    title: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
    button?: React.ReactNode;
}

const CollapsibleSection: React.FC<Props> = ({ title, defaultOpen = false, children, button }) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <Box>
            {/* Header Row */}
            <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="space-between" 
                sx={{ cursor: "pointer" }} 
                onClick={() => setOpen(!open)}
            >
                <Box display="flex" alignItems="center" gap="8px">
                    <img
                        src={BackIcon}
                        width={20}
                        height={20}
                        style={{
                            transform: open ? "rotate(90deg)" : "rotate(-90deg)",
                            transition: "0.2s",
                        }}
                    />
                    <Typography fontSize={16} fontWeight={700}>
                        {title}
                    </Typography>
                </Box>
                {button && (
                    <Box onClick={(e) => e.stopPropagation()}>
                        {button}
                    </Box>
                )}
            </Box>

            {/* Content */}
            {open && <Box mt={2}>{children}</Box>}
        </Box>
    );
};

export default CollapsibleSection;
