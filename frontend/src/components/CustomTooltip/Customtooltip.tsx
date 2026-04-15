import { Tooltip, tooltipClasses, type TooltipProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#ffffff",
        color: "#000000",
        fontSize: "0.8rem",
        padding: "8px 12px",
        borderRadius: "6px",
        boxShadow: theme.shadows[3],
        border: "1px solid #e0e0e0",
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: "#ffffff",
    },
}));

export default CustomTooltip;
