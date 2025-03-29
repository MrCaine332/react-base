import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import "./Label.css"

import { cn } from "@/shared/utils/cn"

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
    return <LabelPrimitive.Root ref={ref} className={cn("label", className)} {...props} />
})
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
