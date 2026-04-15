import React from "react";
import { Box, Table, TableBody, TableRow, TableCell, TableContainer, Paper, useMediaQuery } from "@mui/material";
import { formatLabel } from "../../../../../utils/CommonFunctions";
import CustomTooltip from "../../../../../components/CustomTooltip/Customtooltip";
import TableHeader from "../../../../../components/TableHeader";
import NoMatchesFound from "../../../../../components/NoMatchesFound";
import { thinDarkScrollbar } from "../../../../Inventory/tableStyles/TableStyles";
import { ClampedText } from "../../../../Inventory/components/StyledComponents";

/* ---------------- Types ---------------- */

interface ColumnConfig<T> {
    id: keyof T | string;
    label: string;
    width?: string | number;
    format?: (value: unknown, row: T) => React.ReactNode;
}

interface DynamicTableProps<T> {
    data: T[];
    columns: ColumnConfig<T>[];
    loading?: boolean;
}

/* ---------------- Component ---------------- */

const DynamicTable = <T extends Record<string, unknown>>({ data, columns, loading = false }: DynamicTableProps<T>) => {
    const isMax1279 = useMediaQuery("(max-width:1279px)");
    const enableSticky = isMax1279 && columns.length > 2;

    const renderWithTooltip = (value: string) => {
        // const displayText = value.length > 12 ? `${value.substring(0, 12)}...` : value;

        return (
            <CustomTooltip title={value.length > 12 ? value : ""} placement="top-start">
                <ClampedText>{value}</ClampedText>
            </CustomTooltip>
        );
    };

    /*  Map columns → TableHeader headCells */
    const headCells = columns.map((column) => ({
        id: column.id as keyof T,
        label: formatLabel(column.label),
        sortable: false,
        width: column.width as string,
    }));

    // Decide minWidth based on number of columns
    const minWidth = columns.length <= 2 ? "100%" : 800;

    return (
        <Paper
            elevation={0}
            sx={{
                background: "#f4f4f4",
                borderRadius: 0,
                width: "100%",
                overflow: "auto",
                "&::-webkit-scrollbar": {
                    width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#bdbdbd",
                    borderRadius: "10px",
                },
                "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f0f0f0",
                },
            }}
        >
            <TableContainer
                sx={{
                    maxHeight: 400,
                    minHeight: 150,
                    ...thinDarkScrollbar,
                }}
            >
                <Table
                    stickyHeader
                    sx={{
                        minWidth,
                        tableLayout: "fixed",
                        borderCollapse: "separate",
                        borderSpacing: "0 1em",
                    }}
                >
                    {/* ---------------- Header ---------------- */}
                    <TableHeader
                        headCells={headCells}
                        order="asc"
                        orderBy={headCells[0]?.id}
                        selectedCount={0}
                        totalCount={0}
                        onSelectAll={() => { }}
                        onRequestSort={() => { }}
                        commonCellStyles={{ border: "none" }}
                        showCheckbox={false}
                        showEmptyHead={false}
                        jobDetailTable={true}
                    />

                    {/* ---------------- Body ---------------- */}
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} sx={{ p: 0 }}>
                                    <Box minHeight={200} display="flex" justifyContent="center" alignItems="center">
                                        Loading...
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} sx={{ p: 2, textAlign: "center" }}>
                                    <NoMatchesFound />
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, rowIndex) => (
                                <TableRow
                                    key={rowIndex}
                                    hover
                                    sx={{
                                        background: "#fff",
                                        cursor: "pointer",
                                        "& > .MuiTableCell-root:first-of-type": {
                                            borderTopLeftRadius: "8px",
                                            borderBottomLeftRadius: "8px",
                                        },
                                        "& > .MuiTableCell-root:last-of-type": {
                                            borderTopRightRadius: "8px",
                                            borderBottomRightRadius: "8px",
                                        },
                                    }}
                                >
                                    {columns.map((column, colIndex) => {
                                        const value = row[column.id as keyof T];
                                        const formattedValue = typeof value === "string" ? formatLabel(value) : value;

                                        const isFirst = colIndex === 0;
                                        const isLast = colIndex === columns.length - 1;

                                        return (
                                            <TableCell
                                                key={String(column.id)}
                                                sx={{
                                                    border: "none",
                                                    color: "#222",
                                                    background: "#fff",

                                                    position:
                                                        enableSticky && isFirst
                                                            ? "sticky"
                                                            : enableSticky && isLast
                                                                ? "sticky"
                                                                : "static",

                                                    left: enableSticky && isFirst ? 0 : undefined,
                                                    right: enableSticky && isLast ? 0 : undefined,

                                                    zIndex: enableSticky && (isFirst || isLast) ? 1 : "auto",

                                                    boxShadow:
                                                        enableSticky && isFirst
                                                            ? "4px 0 6px -4px rgba(0,0,0,0.2)"
                                                            : enableSticky && isLast
                                                                ? "-4px 0 6px -4px rgba(0,0,0,0.2)"
                                                                : "none",
                                                }}
                                            >
                                                {(() => {
                                                    let displayValue = "";

                                                    if (typeof formattedValue === "object") {
                                                        displayValue = JSON.stringify(formattedValue, null, 1);
                                                    } else {
                                                        displayValue = String(formattedValue ?? "-");
                                                    }

                                                    return renderWithTooltip(displayValue);
                                                })()}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default DynamicTable;
