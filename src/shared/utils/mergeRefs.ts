import * as React from "react"

// ESM is still a nightmare with Next.js so I'm just gonna copy the package code in
// https://github.com/gregberge/react-merge-refs
// Copyright (c) 2020 Greg Bergé
export function mergeRefs<T = any>(refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>): React.RefCallback<T> {
    return (value) => {
        refs.forEach((ref) => {
            if (typeof ref === "function") {
                ref(value)
            } else if (ref != null) {
                ;(ref as React.MutableRefObject<T | null>).current = value
            }
        })
    }
}
