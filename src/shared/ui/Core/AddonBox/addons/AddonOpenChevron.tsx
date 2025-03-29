import React from "react"
import { FaChevronDown } from "react-icons/fa6"
import { cn } from "@/shared/utils/cn"

type AddonOpenChevronProps = {
    open: boolean
} & React.ComponentProps<typeof FaChevronDown>

export const AddonOpenChevron = ({ open, className, ...props }: AddonOpenChevronProps) => {
    return (
        <FaChevronDown
            className={cn(
                "text-foreground-tertiary !pointer-events-none mx-2 transition-all duration-150",
                open && "rotate-180",
                className
            )}
            size={12}
            {...props}
        />
    )
}
