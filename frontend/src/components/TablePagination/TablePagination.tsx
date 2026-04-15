import React from "react";
import { Box, Stack, Select, MenuItem, Typography, IconButton, type SelectChangeEvent } from "@mui/material";
import FirstPageIcon from "../../assets/FirstPageIcon.svg";
import KeyboardArrowLeftIcon from "../../assets/KeyboardArrowLeftIcon.svg";
import KeyboardArrowRightIcon from "../../assets/KeyboardArrowRightIcon.svg";
import LastPageIcon from "../../assets/LastPageIcon.svg";


interface TablePaginationProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange: (event: SelectChangeEvent<number>) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({
    count,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
}) => {
    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => onPageChange(event, 0);

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => onPageChange(event, page - 1);

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => onPageChange(event, page + 1);

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) =>
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
            }}
        >
            {/* LEFT SECTION - Dropdown */}
            <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
                <Select
                    value={rowsPerPage}
                    onChange={onRowsPerPageChange}
                    size="small"
                    variant="outlined"
                    IconComponent={() => (
                        <Box
                            sx={{
                                right: "10px",
                                position: "absolute",
                                pointerEvents: "none",
                                width: "16px",
                                height: "16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                "&::after": {
                                    content: '"▼"',
                                    fontSize: "12px",
                                    color: "#666"
                                }
                            }}
                        />
                    )}
                    sx={{
                        fontSize: 13,
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                >
                    <MenuItem value={5} sx={{ color: "#222", fontWeight: "600", fontSize: 14 }}>
                        5
                    </MenuItem>
                    <MenuItem value={10} sx={{ color: "#222", fontWeight: "600", fontSize: 14 }}>
                        10
                    </MenuItem>
                    <MenuItem value={25} sx={{ color: "#222", fontWeight: "600", fontSize: 14 }}>
                        25
                    </MenuItem>
                    <MenuItem value={50} sx={{ color: "#222", fontWeight: "600", fontSize: 14 }}>
                        50
                    </MenuItem>
                </Select>
                <Typography sx={{ color: "#222", fontWeight: "400", fontSize: 12, ml: 0.2 }}>
                    of {count} rows
                </Typography>
            </Box>

            {/* CENTER SECTION - Pagination */}
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} size="small">
                        <Box component="img" src={FirstPageIcon} alt="first page" sx={{ color: page === 0 ? "#999" : "#222" }} />
                    </IconButton>
                    <IconButton onClick={handleBackButtonClick} disabled={page === 0} size="small">
                        <Box component="img" src={KeyboardArrowLeftIcon} alt="arrow left" sx={{ color: page === 0 ? "#999" : "#222" }} />
                    </IconButton>
                    <Typography sx={{ fontSize: 13, color: "#222" }}>
                        {page + 1} / {Math.ceil(count / rowsPerPage)}
                    </Typography>
                    <IconButton
                        onClick={handleNextButtonClick}
                        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                        size="small"
                    >
                        <Box component="img" src={KeyboardArrowRightIcon} alt="arrow right" sx={{ color: page >= Math.ceil(count / rowsPerPage) - 1 ? "#999" : "#222" }} />
                    </IconButton>
                    <IconButton
                        onClick={handleLastPageButtonClick}
                        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                        size="small"
                    >
                        <Box component="img" src={LastPageIcon} alt="last page" sx={{ color: page >= Math.ceil(count / rowsPerPage) - 1 ? "#999" : "#222" }} />
                    </IconButton>
                </Stack>
            </Box>

            {/* RIGHT SECTION - Empty (for symmetry) */}
            <Box sx={{ flex: 1 }} />
        </Box>
    );
};

export default TablePagination;
