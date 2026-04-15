import React from "react";
import { Box, InputBase, IconButton } from "@mui/material";
import searchIcon from "../../../assets/SearchIcon.svg";
import CloseIcon from "../../../assets/CloseIcon.svg";
import CustomTooltip from "../../../components/CustomTooltip/Customtooltip";

interface SearchBoxProps {
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch?: () => void;
    style?: React.CSSProperties;
    onClearSearch?: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
    placeholder = "Search...",
    value,
    onChange,
    onSearch,
    style,
    onClearSearch,
}) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#FBFCFC",
                border: "1px solid #6C6B6B",
                borderRadius: "8px",
                padding: "4px 10px",
                height: "36px",
                boxSizing: "border-box",
                width: "100%",
                fontFamily: "inherit",
                ...style,
            }}
        >
            <CustomTooltip title={placeholder} disableHoverListener={!!value || isFocused} arrow>
                <InputBase
                    placeholder={isFocused ? "" : placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && onSearch) onSearch();
                    }}
                    sx={{
                        flex: 1,
                        fontSize: "14px",
                        color: "#222222",
                        minWidth: 0,
                        fontFamily: "inherit",

                        "&::placeholder": {
                            color: "#6C6B6B",
                            opacity: 1,
                        },
                    }}
                    inputProps={{
                        style: {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontFamily: "inherit",
                        },
                    }}
                />
            </CustomTooltip>

            <IconButton
                onClick={onSearch}
                disableRipple
                disableFocusRipple
                sx={{
                    padding: 0,
                    width: 16,
                    height: 16,
                    outline: "none",
                    boxShadow: "none",

                    "&:focus": {
                        outline: "none",
                        boxShadow: "none",
                    },
                    "&:focus-visible": {
                        outline: "none",
                        boxShadow: "none",
                    },
                    "&.Mui-focusVisible": {
                        outline: "none",
                        boxShadow: "none",
                    },
                }}
            >
                {value ? (
                    <img src={CloseIcon} alt="Clear" onClick={onClearSearch} />
                ) : (
                    <img src={searchIcon} alt="Search" />
                )}
            </IconButton>
        </Box>
    );
};

export default SearchBox;
