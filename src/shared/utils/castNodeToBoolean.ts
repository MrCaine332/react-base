import * as React from "react"

export function castNodeToBoolean(node: React.ReactNode): boolean {
    if (node === null || node === undefined || node === false) return false
    if (typeof node === "string") return node.trim().length > 0
    if (typeof node === "number") return true // Numbers (including 0) are valid
    if (React.isValidElement(node)) return true // Valid React elements are truthy
    if (Array.isArray(node)) return node.some(castNodeToBoolean) // Check nested nodes
    return false // Anything else is treated as falsy
}
