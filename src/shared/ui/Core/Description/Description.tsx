import * as React from "react"
import { Primitive } from "@radix-ui/react-primitive"

import { cn } from "@/shared/utils/cn"
import { castNodeToBoolean } from "@/shared/utils/castNodeToBoolean"

export type DescriptionProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

const Description = React.forwardRef<React.ElementRef<typeof Primitive.div>, DescriptionProps>(
    ({ className, children, ...props }, ref) => {
        const isNodeTruthy = castNodeToBoolean(children)
        if (!isNodeTruthy) {
            return null
        }

        return (
            <Primitive.div ref={ref} className={cn("text-sm text-foreground-secondary", className)} {...props}>
                {children}
            </Primitive.div>
        )
    }
)
Description.displayName = "Description"

export { Description }
