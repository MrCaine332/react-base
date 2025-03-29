import React from "react"
import { v4 } from "uuid"

export const useForceRerender = () => {
    const [rerenderKey, setRerenderKey] = React.useState(() => v4())
    const rerender = React.useCallback(() => setRerenderKey(v4()), [])
    return { rerenderKey, rerender }
}
