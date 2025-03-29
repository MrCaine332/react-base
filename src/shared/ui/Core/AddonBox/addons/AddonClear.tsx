import React from "react"
import { ButtonRoot, ButtonRootProps } from "@/shared/ui/Core/Button"
import { FaXmark } from "react-icons/fa6"
import { cn } from "@/shared/utils/cn"

export type AddonClearProps = ButtonRootProps

const AddonClear = ({ className, variant = "ghost", ...props }: AddonClearProps) => {
    return (
        <ButtonRoot
            variant={variant}
            className={cn("!px-0 !h-full !rounded-md aspect-square text-foreground-secondary", className)}
            {...props}
        >
            <FaXmark />
        </ButtonRoot>
    )
}

export { AddonClear }
