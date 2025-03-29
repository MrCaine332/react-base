import { autoUpdate, size, useFloating } from "@floating-ui/react"
import { AutoUpdateOptions } from "@floating-ui/dom"

export type UseDimensionCaptureParams = {
    prefix?: string
} & AutoUpdateOptions

export const useDimensionCapture = (prefix: string, options?: UseDimensionCaptureParams) => {
    return useFloating({
        whileElementsMounted: (...args) =>
            autoUpdate(...args, {
                /**
                 * Whether to update the position when an overflow ancestor is scrolled.
                 * @default false
                 */
                ancestorScroll: false,
                /**
                 * Whether to update the position when an overflow ancestor is resized. This
                 * uses the native `resize` event.
                 * @default false
                 */
                ancestorResize: false,
                /**
                 * Whether to update the position when either the reference or floating
                 * elements resized. This uses a `ResizeObserver`.
                 * @default true
                 */
                elementResize: true,
                /**
                 * Whether to update the position when the reference relocated on the screen
                 * due to layout shift.
                 * @default false
                 */
                layoutShift: false,
                /**
                 * Whether to update on every animation frame if necessary. Only use if you
                 * need to update the position in response to an animation using transforms.
                 * @default false
                 */
                animationFrame: false,
                ...options,
            }),
        middleware: [
            size({
                apply: ({ elements, rects }) => {
                    const { width: elementWidth, height: elementHeight } = rects.reference
                    const contentStyle = elements.floating.style
                    contentStyle.setProperty(`--${prefix}-width`, `${elementWidth}px`)
                    contentStyle.setProperty(`--${prefix}-height`, `${elementHeight}px`)
                },
            }),
        ],
    })
}
