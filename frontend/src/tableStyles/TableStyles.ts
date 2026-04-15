// tableStyles.ts
export const lastColumnSticky = {
    position: "sticky",
    right: 0,
    zIndex: 11,
    background: "#fff",
    boxShadow: "-4px 0 8px rgba(0,0,0,0.08)",
    borderRadius: "0px 8px 8px 0px",

    // hover style for sticky cell
    ".MuiTableRow-root:hover &": {
        backgroundColor: "#e4e4e4ff",
    },

    "&:hover": {
        boxShadow: "-6px 0 12px rgba(0,0,0,0.15)",
        zIndex: 12,
    },
};
export const firstColumnSticky = {
    position: "sticky",
    left: 0,
    zIndex: 15, // slightly higher than normal cells
    background: "#fff",
    boxShadow: "4px 0 8px rgba(0,0,0,0.08)",

    // hover style when row is hovered
    ".MuiTableRow-root:hover &": {
        backgroundColor: "#e4e4e4ff",
    },

    "&:hover": {
        boxShadow: "6px 0 12px rgba(0,0,0,0.15)",
        zIndex: 20,
    },
};

export const headerDivider = {
    position: "relative",
    "&::after": {
        content: '""',
        position: "absolute",
        right: 0,
        top: "8px",
        bottom: "8px",
        width: "1px",
        backgroundColor: "#D9D9D9",
        zIndex: 5,
    },
};
export const iconButtonSx = (height?: number | string, width?: number | string, borderRadius?: number | string) => ({
    height,
    width,
    minHeight: height,
    borderRadius,
    "&:hover": {
        backgroundColor: "#4D4D4D0A.",
        border: "1px solid #222",
    },
});
export const thinDarkScrollbar = {
    "&::-webkit-scrollbar": {
        width: "6px",
        height: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#6b6b6b",
        borderRadius: "10px",
    },
    "&::-webkit-scrollbar-track": {
        backgroundColor: "#e0e0e0",
    },
};
