import * as React from "react"

const getId = (() => {
    let i = 0
    return () => `${i++}`
})()

export const useId = (deterministicId?: string) => {
    const [id] = React.useState(getId)
    return deterministicId || `yoku-${id}`
}
