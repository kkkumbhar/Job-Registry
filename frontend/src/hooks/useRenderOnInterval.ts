import { useEffect, useState } from "react"

const useRenderOnInterval = (active = true): void => {
    const [, setLastRender] = useState(Date.now())

    useEffect(() => {
        let interval: number
        if (active) {
            interval = window.setInterval(() => setLastRender(Date.now()), 1000)
        }
        return () => {
            window.clearInterval(interval)
        }
    }, [active])
}

export default useRenderOnInterval
