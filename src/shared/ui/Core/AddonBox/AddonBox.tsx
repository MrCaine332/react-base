import * as React from "react"
import { Primitive } from "@radix-ui/react-primitive"
import "./AddonBox.css"

import { cn } from "@/shared/utils/cn"
import { useDimensionCapture } from "@/shared/hooks/useDimensionCapture"
import { useMergeRefs } from "@floating-ui/react"

/*-----------------------------------------------------------------------------------------------*/
/* AddonBoxContainer */
/*-----------------------------------------------------------------------------------------------*/

export type AddonBoxContainerProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

const AddonBoxContainer = React.forwardRef<React.ElementRef<typeof Primitive.div>, AddonBoxContainerProps>(
    ({ className, ...props }, ref) => {
        return <Primitive.div ref={ref} className={cn("addon-box", className)} {...props} />
    }
)
AddonBoxContainer.displayName = "AddonBoxContainer"

/*-----------------------------------------------------------------------------------------------*/
/* AddonBefore / AddonAfter */
/*-----------------------------------------------------------------------------------------------*/

export type AddonBeforeProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

const AddonBefore = React.forwardRef<React.ElementRef<typeof Primitive.div>, AddonBeforeProps>(
    ({ className, ...props }, ref) => {
        return <Primitive.div ref={ref} className={cn("addon-before", className)} {...props} />
    }
)
AddonBefore.displayName = "AddonBefore"

export type AddonAfterProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

const AddonAfter = React.forwardRef<React.ElementRef<typeof Primitive.div>, AddonAfterProps>(
    ({ className, ...props }, ref) => {
        return <Primitive.div ref={ref} className={cn("addon-after", className)} {...props} />
    }
)
AddonAfter.displayName = "AddonAfter"

/*-----------------------------------------------------------------------------------------------*/
/* AddonBox */
/*-----------------------------------------------------------------------------------------------*/

export type AddonBoxBaseProps = React.ComponentPropsWithoutRef<typeof AddonBoxContainer>

export type AddonBoxExtraProps = {
    addonBefore?: React.ReactNode
    addonBeforeClassName?: string
    addonBeforeProps?: React.ComponentProps<typeof AddonBefore>

    addonAfter?: React.ReactNode
    addonAfterClassName?: string
    addonAfterProps?: React.ComponentProps<typeof AddonAfter>
}

export type AddonBoxProps = AddonBoxBaseProps & AddonBoxExtraProps

const AddonBox = React.forwardRef<React.ElementRef<typeof AddonBoxContainer>, AddonBoxProps>(
    (
        {
            addonBefore,
            addonBeforeClassName,
            addonBeforeProps,

            addonAfter,
            addonAfterClassName,
            addonAfterProps,

            className,
            children,
            ...props
        },
        ref
    ) => {
        const { refs: addonBeforeRefs } = useDimensionCapture("addon-before")
        const { refs: addonAfterRefs } = useDimensionCapture("addon-after")

        const mergedContainerRef = useMergeRefs([ref, addonBeforeRefs.setFloating, addonAfterRefs.setFloating])
        const mergedAddonBeforeRef = useMergeRefs([addonBeforeProps?.ref, addonBeforeRefs.setReference])
        const mergedAddonAfterRef = useMergeRefs([addonAfterProps?.ref, addonAfterRefs.setReference])

        return (
            <AddonBoxContainer ref={mergedContainerRef} className={className} {...props}>
                {addonBefore && (
                    <AddonBefore className={addonBeforeClassName} {...addonBeforeProps} ref={mergedAddonBeforeRef}>
                        {addonBefore}
                    </AddonBefore>
                )}

                {children}

                {addonAfter && (
                    <AddonAfter className={addonAfterClassName} {...addonAfterProps} ref={mergedAddonAfterRef}>
                        {addonAfter}
                    </AddonAfter>
                )}
            </AddonBoxContainer>
        )
    }
)
AddonBox.displayName = "AddonBox"

export { AddonBoxContainer, AddonBefore, AddonAfter, AddonBox }
