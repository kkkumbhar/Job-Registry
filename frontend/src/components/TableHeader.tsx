import React, { useRef, useState, useEffect } from "react";
import { TableHead, TableRow, TableCell, Checkbox, TableSortLabel } from "@mui/material";
import SortAscendingIcon from "../assets/SortAscendingIcon.svg";
import styled, { css } from "styled-components";
import CustomTooltip from "./CustomTooltip/Customtooltip";

/* ---------------- Types ---------------- */
interface HeadCell<T> {
    id: keyof T;
    label: string;
    align?: "left" | "right" | "center";
    sortable?: boolean;
    width?: string;
    showDivider?: boolean;
    hideBorderRadius?: boolean;
}

interface TableHeaderProps<T> {
    headCells: readonly HeadCell<T>[];
    order: "asc" | "desc";
    orderBy: keyof T;
    selectedCount: number;
    totalCount: number;
    onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
    commonCellStyles: React.CSSProperties;
    showCheckbox?: boolean;
    showDivider?: boolean;
    showEmptyHead?: boolean;
    freezeColumns?: boolean;
    noData?: boolean;
    showExpandCell?: boolean;
    disableSorting?: boolean;
    showIdColumn?: boolean;
    jobDetailTable?: boolean;
    attachSetting?: boolean;
    isSecondColSticky?: boolean;
}

/* ---------------- Styled Components ---------------- */

const StyledTableRow = styled(TableRow) <{ $noData?: boolean }>`
    height: 56px;
    background: #fff;

    ${({ $noData }) =>
        $noData &&
        css`
            & > th:first-child {
                border-bottom-left-radius: 0 !important;
            }
            & > th:last-child {
                border-bottom-left-radius: 0 !important;
                border-bottom-right-radius: 0 !important;
            }
        `}
`;

const StyledCheckboxCell = styled(TableCell)`
    width: 56px;
    position: sticky;
    left: 0;
    z-index: 12;
    background: #fff;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
`;

const StyledCheckbox = styled(Checkbox)`
    & .MuiSvgIcon-root {
        font-size: 1.25rem;
    }
`;
const StyledTableCell = styled(TableCell) <{
    $showDivider?: boolean;
    $isLast?: boolean;
    $isFirst?: boolean;
    $isSecondSticky?: boolean;
    $noData?: boolean;
    $jobDetailTable?: boolean;
    $attachSetting?: boolean;
    $align?: "left" | "right" | "center";
}>`
    font-weight: 600;
    font-size: 14px;
    color: #222;
    line-height: 21px;
    background: #fff;

    /* ✅ SHOW DIVIDER */
    ${(props) =>
        props.$showDivider &&
        css`
            position: relative;

            &::after {
                content: "";
                position: absolute;
                right: 0;
                top: 8px;
                bottom: 8px;
                width: 1px;
                background-color: #d9d9d9;
                z-index: 5;
            }
        `}

    ${(props) =>
        props.$isFirst &&
        css`
            position: sticky;
            left: 0px;
            z-index: 11;
            background: #fff;
            border-top-left-radius: 8px;
            border-bottom-left-radius: ${props.$noData ? "0px" : "8px"};
        `}

    ${(props) =>
        props.$isSecondSticky &&
        css`
            position: sticky;
            left: 40px;
            z-index: 11;
            background: #fff;
        `}

    ${(props) =>
        props.$isLast &&
        css`
            position: sticky;
            right: 0;
            z-index: 10;
            background: #fff;
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
        `}

    /* ✅ FIXED ALIGNMENT + ELLIPSIS */
    .ellipsis {
        display: ${({ $jobDetailTable }) =>
        $jobDetailTable ? "block" : "flex"};

        justify-content: ${({ $align }) =>
        $align === "right"
            ? "end"
            : $align === "center"
                ? "center"
                : "flex-start"};

        text-align: ${({ $align }) => $align || "left"};

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;

        min-width: ${({ $attachSetting, $jobDetailTable }) =>
        $attachSetting ? "auto" : $jobDetailTable ? "70px" : "90px"};
    }
`;

/* ---------------- Component ---------------- */

function TableHeader<T>({
    headCells,
    order,
    orderBy,
    selectedCount,
    totalCount,
    onSelectAll,
    onRequestSort,
    commonCellStyles,
    showCheckbox = true,
    showEmptyHead = false,
    freezeColumns = true,
    showExpandCell = false,
    noData = false,
    disableSorting = false,
    showIdColumn = false,
    jobDetailTable = false,
    attachSetting = false,
    isSecondColSticky = false,
}: TableHeaderProps<T>) {
    const lastColumnId = headCells[headCells.length - 1].id;

    const [isOverflowing, setIsOverflowing] = useState<boolean[]>([]);
    const headerRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const checkOverflow = () => {
            setIsOverflowing(
                headCells.map((_, index) => {
                    const cell = headerRefs.current[index];
                    return cell ? cell.scrollWidth > cell.clientWidth : false;
                }),
            );
        };

        checkOverflow();
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [headCells]);

    const SortIcon = ({ direction }: { direction: "asc" | "desc" }) =>
        direction === "asc" ? (
            <img src={SortAscendingIcon} />
        ) : (
            <img src={SortAscendingIcon} style={{ transform: "rotate(180deg)" }} />
        );

    return (
        <TableHead>
            <StyledTableRow $noData={noData}>
                {showExpandCell && (
                    <TableCell
                        padding="checkbox"
                        style={{
                            ...commonCellStyles,
                            borderBottom: "none",
                            width: 48,
                        }}
                    />
                )}

                {showCheckbox && (
                    <StyledCheckboxCell
                        padding="checkbox"
                        style={{
                            ...commonCellStyles,
                            position: freezeColumns ? "sticky" : "static",
                        }}
                    >
                        <StyledCheckbox
                            color="primary"
                            indeterminate={selectedCount > 0 && selectedCount < totalCount}
                            checked={totalCount > 0 && selectedCount === totalCount}
                            onChange={onSelectAll}
                        />
                    </StyledCheckboxCell>
                )}
                {showIdColumn && (
                    <StyledTableCell
                        style={{
                            ...commonCellStyles,
                            width: "1%",
                            position: freezeColumns ? "sticky" : "static",
                            left: freezeColumns
                                ? showCheckbox
                                    ? "56px"
                                    : "0"
                                : undefined,
                            zIndex: freezeColumns ? 11 : "auto",
                            background: "#fff",
                        }}
                    />
                )}
                {showEmptyHead && (
                    <StyledTableCell
                        style={{
                            ...commonCellStyles,
                            border: "none",
                            width: "1%",
                            position: freezeColumns ? "sticky" : "static",
                            left: freezeColumns ? (showCheckbox ? "56px" : "0") : undefined,
                            zIndex: freezeColumns ? 11 : "auto",
                            background: "#fff",
                        }}
                        $isFirst={freezeColumns && !showCheckbox}
                        $noData={noData}
                    />
                )}

                {headCells.map((headCell, index) => {
                    const isLastColumn =
                        freezeColumns &&
                        headCell.id === lastColumnId &&
                        headCell.hideBorderRadius !== true;

                    const isFirstColumn =
                        freezeColumns &&
                        !showCheckbox &&
                        index === 0 &&
                        headCell.hideBorderRadius !== true;

                    const isSecondSticky =
                        freezeColumns &&
                        isSecondColSticky &&
                        (
                            (showCheckbox && index === 1) ||
                            (!showCheckbox && index === 0)
                        ) &&
                        headCell.hideBorderRadius !== true;

                    return (
                        <StyledTableCell
                            key={String(headCell.id)}
                            align={headCell.align || "left"}
                            sortDirection={orderBy === headCell.id ? order : false}
                            style={{ ...commonCellStyles, width: headCell.width }}
                            $showDivider={headCell.showDivider}
                            $isLast={isLastColumn}
                            $isFirst={isFirstColumn}
                            $isSecondSticky={isSecondSticky}
                            $jobDetailTable={jobDetailTable}
                            $attachSetting={attachSetting}
                            $align={headCell.align || "left"} 
                        >
                            {!disableSorting && headCell.sortable ? (
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : "asc"}
                                    onClick={(event) =>
                                        onRequestSort(event, String(headCell.id))
                                    }
                                    IconComponent={
                                        orderBy === headCell.id
                                            ? () => <SortIcon direction={order} />
                                            : () => null
                                    }
                                    className="ellipsis"
                                >
                                    <div
                                        ref={(el) => {
                                            headerRefs.current[index] = el;
                                        }}
                                    >
                                        {headCell.label}
                                    </div>
                                </TableSortLabel>
                            ) : (
                                <div
                                    ref={(el) => {
                                        headerRefs.current[index] = el;
                                    }}
                                    className="ellipsis"
                                >
                                    {isOverflowing[index] ? (
                                        <CustomTooltip title={headCell.label} arrow>
                                            <span>{headCell.label}</span>
                                        </CustomTooltip>
                                    ) : (
                                        headCell.label
                                    )}
                                </div>
                            )}
                        </StyledTableCell>
                    );
                })}
            </StyledTableRow>
        </TableHead>
    );
}

export default TableHeader;