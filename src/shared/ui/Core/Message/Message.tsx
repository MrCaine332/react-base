import * as React from "react"
import { Primitive } from "@radix-ui/react-primitive"

import { cn } from "@/shared/utils/cn"
import { castNodeToBoolean } from "@/shared/utils/castNodeToBoolean"
import { cva, type VariantProps } from "class-variance-authority"

const messageVariants = cva("text-sm", {
    variants: {
        status: {
            error: "text-danger-500",
            warning: "text-warning-500",
            success: "text-success-500",
            info: "text-primary-500",
        },
    },
})

export type MessageProps = React.ComponentProps<typeof Primitive.div> & VariantProps<typeof messageVariants>

const Message = React.forwardRef<React.ElementRef<typeof Primitive.div>, MessageProps>(
    ({ status, className, children, ...props }, ref) => {
        const isNodeTruthy = castNodeToBoolean(children)
        if (!isNodeTruthy) {
            return null
        }

        return (
            <Primitive.div ref={ref} className={cn(messageVariants({ status }), className)} {...props}>
                {children}
            </Primitive.div>
        )
    }
)
Message.displayName = "Message"

export { Message }
