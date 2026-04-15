import type { ComponentType } from "react"
import { isEmpty } from "./utils"
import Typography from "@mui/material/Typography"

const withHyphen = <TProps extends { value: unknown }>(WrappedComponent: ComponentType<TProps>) => {
    function WithHyphen({ value, ...props }: Omit<TProps, "value"> & { value: TProps["value"] | undefined }) {
        return !isEmpty(value) ? <WrappedComponent {...(props as TProps)} value={value} /> : <Typography>-</Typography>
    }
    return WithHyphen
}

export default withHyphen
