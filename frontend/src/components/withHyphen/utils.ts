export const isEmpty = (value: unknown): boolean => {
    let res = false

    // handle null and undefined
    res ||= value == null

    if (typeof value === "string") {
        res ||= !value
    } else if (Array.isArray(value)) {
        res ||= value.length === 0
    }
    return res
}
