import React, { ReactNode } from "react";
import { Box, Table, TableBody, TableRow, TableCell, TableContainer, Paper, useMediaQuery } from "@mui/material";
import { formatLabel, toPascalCase } from "../../../../../utils/CommonFunctions";
import CenteredLoader from "../../../../../components/CenteredLoader/CenteredLoader";
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
    format?: <K extends keyof T>(value: T[K], row: T) => React.ReactNode;
    align ?: "left" | "right" | "center";

}

interface ReportTableProps<T> {
    data: T[];
    columns: ColumnConfig<T>[];
    loading?: boolean;
}

/* ---------------- Helpers ---------------- */

const extractText = (content: ReactNode): string => {
    if (typeof content === "string") return content;

    if (React.isValidElement<{ children?: ReactNode }>(content)) {
        const children = content.props.children;

        if (typeof children === "string") return children;
        if (Array.isArray(children)) {
            return children.map((c) => (typeof c === "string" ? c : "")).join("");
        }
    }
    return "";
};

const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
        case "critical":
            return "#D32F2F";
        case "high":
            return "#F57C00";
        case "medium":
            return "#FBC02D";
        case "low":
            return "#388E3C";
        default:
            return "#4D4D4D33";
    }
};

/* ---------------- Component ---------------- */

const ReportTable = <T extends object>({ data, columns, loading = false }: ReportTableProps<T>) => {
    const isMax1279 = useMediaQuery("(max-width:1279px)");

    /* Map columns → headCells */
    const headCells = columns.map((column) => ({
        id: column.id as keyof T,
        label: formatLabel(column.label),
        sortable: false,
        width: column.width as string,
        align: column.align as "left" | "right" | "center",
    }));

    return (
        <Paper
            elevation={0}
            sx={{
                background: "#f4f4f4",
                borderRadius: 0,
                width: "100%",
                overflowX: "auto",
            }}
        >
            <TableContainer sx={{ ...thinDarkScrollbar }}>
                <Table
                    sx={{
                        minWidth: 800,
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
                        onSelectAll={() => {}}
                        onRequestSort={() => {}}
                        commonCellStyles={{ border: "none" }}
                        showCheckbox={false}
                        showEmptyHead={false}
                    />

                    {/* ---------------- Body ---------------- */}
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} sx={{ p: 0 }}>
                                    <Box minHeight={200} display="flex" justifyContent="center" alignItems="center">
                                        <CenteredLoader minHeight={200} />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} sx={{ p: 0, textAlign: "center" }}>
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
                                            borderTopLeftRadius: 8,
                                            borderBottomLeftRadius: 8,
                                        },
                                        "& > .MuiTableCell-root:last-of-type": {
                                            borderTopRightRadius: 8,
                                            borderBottomRightRadius: 8,
                                        },
                                    }}
                                >
                                    {columns.map((column, colIndex) => {
                                        const value = row[column.id as keyof T];
                                        const isFirst = colIndex === 0;
                                        const isLast = colIndex === columns.length - 1;

                                        let cellContent: ReactNode;

                                        if (column.format) {
                                            cellContent = column.format(value, row);
                                        } else if (value == null) {
                                            cellContent = "-";
                                        } else if (typeof value === "object") {
                                            cellContent = JSON.stringify(value);
                                        } else {
                                            const textValue = String(value);
                                            const formatted =
                                                textValue === textValue.toUpperCase()
                                                    ? textValue
                                                    : formatLabel(textValue);

                                            cellContent = toPascalCase(formatted);
                                        }

                                        const text = extractText(cellContent);

                                        const clipLength = 140;
                                        const shouldClipText = text.length > clipLength + 3;

                                        return (
                                            <TableCell
                                                key={String(column.id)}
                                                align={column.align}
                                                sx={{
                                                    border: "none",
                                                    color: "#222",
                                                    background: "#fff",

                                                    position: isMax1279 && (isFirst || isLast) ? "sticky" : "static",

                                                    left: isMax1279 && isFirst ? 0 : undefined,
                                                    right: isMax1279 && isLast ? 0 : undefined,

                                                    zIndex: isMax1279 && (isFirst || isLast) ? 1 : "auto",
                                                }}
                                            >
                                                <CustomTooltip
                                                    title={shouldClipText ? text : ""}
                                                    arrow
                                                    placement="top-start"
                                                >
                                                    <Box
                                                        sx={
                                                            column.id === "severity"
                                                                ? {
                                                                      display: "inline-block",
                                                                      px: 1.5,
                                                                      py: 0.5,
                                                                      borderRadius: "12px",
                                                                      backgroundColor: getSeverityColor(text),
                                                                      fontWeight: 500,
                                                                      fontSize: "12px",
                                                                      color: "#222",
                                                                  }
                                                                : {}
                                                        }
                                                    >
                                                        {/* {shouldClipText ? `${text.substring(0, clipLength)}...` : text} */}
                                                        <ClampedText>
                                                            {text}
                                                        </ClampedText>
                                                    </Box>
                                                </CustomTooltip>
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

export default ReportTable;
