import * as React from "react"
import { Primitive } from "@radix-ui/react-primitive"
import "./Badge.css"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/utils/cn"

const badgeVariants = cva("badge", {
    variants: {
        variant: {
            filled: "badge-filled",
            outlined: "badge-outlined",
            "filled-outlined": "badge-filled-outlined",
            soft: "badge-soft",
            text: "badge-text",
        },
        color: {
            default: "badge-default",
            primary: "badge-primary",
            danger: "badge-danger",
            warning: "badge-warning",
            success: "badge-success",
            info: "badge-info",
        },
    },
    defaultVariants: {
        variant: "filled",
        color: "default",
    },
})

export type BadgeProps = React.ComponentPropsWithoutRef<typeof Primitive.div> & VariantProps<typeof badgeVariants>

const Badge = React.forwardRef<React.ElementRef<typeof Primitive.div>, BadgeProps>(
    ({ className, variant, color, ...props }, ref) => {
        return <Primitive.div ref={ref} className={cn(badgeVariants({ variant, color }), className)} {...props} />
    }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
