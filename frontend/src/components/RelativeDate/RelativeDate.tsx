
import Typography, { type TypographyProps } from "@mui/material/Typography";
import { type DateLike, type RelativeDateDirection, dateTimeFormatter, relativeDateFormatter } from "../../utils/date";

import CustomTooltip from "../CustomTooltip/Customtooltip";
import withHyphen from "../withHyphen";
import useRenderOnInterval from "../../hooks/useRenderOnInterval";

interface Props extends TypographyProps {
    value: DateLike;
    direction: RelativeDateDirection;
}

const RelativeDate = withHyphen(({ value, direction, ...typographyProps }: Props) => {
    useRenderOnInterval();

    return (
        <CustomTooltip title={dateTimeFormatter(value)} arrow placement="top">
            <Typography {...typographyProps}>{relativeDateFormatter(value, direction)}</Typography>
        </CustomTooltip>
    );
});

export default RelativeDate;
