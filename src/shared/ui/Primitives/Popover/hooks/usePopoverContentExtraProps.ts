import { PopoverContentExtraProps } from "@/shared/ui/Primitives/Popover"
import { useExtractedProps } from "@/shared/hooks/useExtractedProps"

const keys: (keyof PopoverContentExtraProps)[] = [
    "onOpenAutoFocus",
    "onCloseAutoFocus",
    "onEscapeKeyDown",
    "onPointerDownOutside",
    "onFocusOutside",
    "onInteractOutside",
    "side",
    "sideOffset",
    "align",
    "alignOffset",
    "avoidCollisions",
    "collisionBoundary",
    "collisionPadding",
    "arrowPadding",
    "sticky",
    "hideWhenDetached",
]

export function usePopoverContentExtraProps(props: PopoverContentExtraProps) {
    return useExtractedProps(props, keys)
}
