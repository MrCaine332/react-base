import * as React from "react"

const useLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

export function useAsRef<T>(data: T) {
    const ref = React.useRef<T>(data)

    useLayoutEffect(() => {
        ref.current = data
    })

    return ref
}
