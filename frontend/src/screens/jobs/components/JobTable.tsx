import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  type SelectChangeEvent,
} from "@mui/material";
import { headCells } from "./headCells";
// import { useLocation, useNavigate } from "react-router-dom";
import InProgressIcon from "../../../assets/InProgressIcon.svg";
import SuccessStatusIcon from "../../../assets/SuccessStatusIcon.svg";
import CriticalIcon from "../../../assets/CriticalIcon.svg";
import WarningIcon from "../../../assets/WarningIcon.svg";
import TablePagination from "../../../components/TablePagination/TablePagination";
import CenteredLoader from "../../../components/CenteredLoader/CenteredLoader";
import { useEpochFormatter } from "../../../hooks/useEpochFormatter";
import { toPascalCase } from "../../../utils/CommonFunctions";
import TableHeader from "../../../components/TableHeader";
import {
  firstColumnSticky,
  thinDarkScrollbar,
} from "../../../tableStyles/TableStyles";
import NoMatchesFound from "../../../components/NoMatchesFound";
import RelativeDate from "../../../components/RelativeDate";
import type { Job } from "../../../types/jobs";

interface JobsTableProps {
  jobs: Job[];
  searchValue: string;
  // onSearchChange: (value: string) => void;
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: SelectChangeEvent<number>) => void;
  order: "asc" | "desc";
  orderBy: string;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Job
  ) => void;
  onShowNotification?: (message: string, type: "success" | "error") => void;
  // onRefresh?: () => void;
  loading: boolean;
}

const JobTable: React.FC<JobsTableProps> = ({
  jobs,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  order,
  orderBy,
  onRequestSort,
  loading,
  searchValue,
}) => {
  const { getDuration } = useEpochFormatter();
  // const navigate = useNavigate();
  // const location = useLocation();

  // Add this helper inside your file (above the component or in utils)
  const getStatusIcon = (status?: string): string | undefined => {
    switch (toPascalCase(status)) {
      case "Inprogress":
        return InProgressIcon;
      case "Success":
        return SuccessStatusIcon;
      case "Failed":
        return CriticalIcon;
      case "Successwitherrors":
        return WarningIcon;
      default:
        return undefined;
    }
  };

  const toTitleCase = (text?: string): string => {
    if (!text) return "-";
    return text
      .toLowerCase()
      .split(/[_\s]+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    onRequestSort(event, property as keyof Job);
  };

  const commonCellStyles = {
    padding: "12px 16px",
    border: "none",
  };

  const headerCellStyles = {
    padding: "16px",
    borderBottom: "2px solid #e0e0e0",
    backgroundColor: "#fafafa",
    fontWeight: 600,
    fontSize: "14px",
    color: "#555",
  };

  return (
    <Paper
      elevation={0}
      sx={{
        background: "#ffffff",
        borderRadius: 0,
        width: "100%",
      }}
    >
      <TableContainer
        sx={{
          ...thinDarkScrollbar,
          overflowX: "auto",
        }}
      >
        <Table
          sx={{
            minWidth: 1000,
            borderCollapse: "separate",
          }}
        >
          <TableHeader
            headCells={headCells}
            order={order}
            orderBy={orderBy}
            totalCount={jobs.length}
            selectedCount={0}
            onSelectAll={() => {}}
            onRequestSort={handleRequestSort}
            commonCellStyles={headerCellStyles}
            showCheckbox={false}
            showDivider={true}
            noData={jobs.length === 0}
          />

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={headCells.length + 1} sx={{ p: 0 }}>
                  <CenteredLoader minHeight={200} />
                </TableCell>
              </TableRow>
            ) : jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} sx={{ p: 0 }} align="center">
                  <Box>
                    <NoMatchesFound showSearchHint={Boolean(searchValue)} />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((row) => {
                // const selectedRow = isSelected(row.id);
                // const isMenuOpen = Boolean(anchorEl) && selectedJob?.id === row.id;

                return (
                  <TableRow
                    key={row.id}
                    hover
                    onClick={() => {}}
                    sx={{
                      background: "#ffffff",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#f8f9fa",
                      },
                      "& > .MuiTableCell-root": {
                        borderBottom: "1px solid #f0f0f0",
                      },
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
                    {/* <TableCell
                                                padding="checkbox"
                                                sx={{
                                                    ...commonCellStyles,
                                                    borderRadius: "8px 0 0 8px",
                                                    padding: "0 0 0 8px",
                                                }}
                                            >
                                                <Checkbox
                                                    color="primary"
                                                    onChange={() => handleSelectRow(row.id)}
                                                    checked={selectedRow}
                                                    sx={{
                                                        "& .MuiSvgIcon-root": {
                                                            fontSize: "1.25rem",
                                                        },
                                                    }}
                                                />
                                            </TableCell> */}

                    <TableCell
                      sx={{
                        ...commonCellStyles,
                        "@media (max-width:1421px)": {
                          ...firstColumnSticky,
                        },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {getStatusIcon(toPascalCase(row.status)) && (
                          <img
                            src={getStatusIcon(toPascalCase(row.status))}
                            alt={row.status}
                            style={
                              toPascalCase(row.status) == "InProgress"
                                ? { width: 24, height: 24 }
                                : { width: 28, height: 28 }
                            }
                          />
                        )}
                        {toTitleCase(row.status)}
                      </Box>
                    </TableCell>

                    <TableCell sx={{ ...commonCellStyles, color: "#222" }}>
                      {row.name}
                    </TableCell>

                    <TableCell sx={{ ...commonCellStyles, color: "#222" }}>
                      <Box
                        sx={{
                          display: "inline-block",
                          padding: "6px 16px",
                          borderRadius: "20px",
                          backgroundColor:
                            row.source === "fleet" ? "#e3f2fd" : "#fff3e0",
                          color: row.source === "fleet" ? "#1565c0" : "#e65100",
                          fontSize: "13px",
                          fontWeight: 600,
                          textTransform: "capitalize",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        }}
                      >
                        {row.source}
                      </Box>
                    </TableCell>

                    <TableCell sx={{ ...commonCellStyles, color: "#222" }}>
                      {row.duration ?? getDuration(row.started, row.endDate)}
                    </TableCell>

                    <TableCell sx={{ ...commonCellStyles, color: "#222" }}>
                      <RelativeDate
                        value={row.started}
                        direction="from"
                        style={{ fontSize: "14px" }}
                      />
                    </TableCell>

                    <TableCell sx={{ ...commonCellStyles, color: "#222" }}>
                      {row.createdBy === "" ? "-" : row.createdBy}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {count >= 10 && (
        <TablePagination
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      )}
    </Paper>
  );
};

export default JobTable;
