/**
 * Hook to extract specific props from a props object
 * @param props - The original props object
 * @param extractKeys - Array of keys to extract
 * @returns Object with extracted props and remaining props
 */
export function useExtractedProps<T extends Record<string, any>, K extends keyof T = keyof T>(
    props: T,
    extractKeys: K[]
): {
    extracted: Pick<T, K>
    remaining: Omit<T, K>
} {
    const extracted = {} as Pick<T, K>
    const remaining = { ...props } as Omit<T, K>

    extractKeys.forEach((key) => {
        if (key in props) {
            // @ts-ignore - TypeScript doesn't track the keys well in this case
            extracted[key] = props[key]
            // @ts-ignore
            delete remaining[key]
        }
    })

    return { extracted, remaining }
}
