import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/shared/utils/cn"
import { PopoverContentProps } from "@radix-ui/react-popover"

/*-----------------------------------------------------------------------------------------------*/
/* PopoverRoot */
/*-----------------------------------------------------------------------------------------------*/

const PopoverRoot = PopoverPrimitive.Root

/*-----------------------------------------------------------------------------------------------*/
/* PopoverTrigger */
/*-----------------------------------------------------------------------------------------------*/

const PopoverTrigger = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ children, ...props }, ref) => (
    <PopoverPrimitive.Trigger ref={ref} {...props}>
        {children}
    </PopoverPrimitive.Trigger>
))
PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName

/*-----------------------------------------------------------------------------------------------*/
/* PopoverContent */
/*-----------------------------------------------------------------------------------------------*/

export type PopoverContentExtraProps = {
    onOpenAutoFocus?: PopoverContentProps["onOpenAutoFocus"]
    onCloseAutoFocus?: PopoverContentProps["onCloseAutoFocus"]
    onEscapeKeyDown?: PopoverContentProps["onEscapeKeyDown"]
    onPointerDownOutside?: PopoverContentProps["onPointerDownOutside"]
    onFocusOutside?: PopoverContentProps["onFocusOutside"]
    onInteractOutside?: PopoverContentProps["onInteractOutside"]
    side?: PopoverContentProps["side"]
    sideOffset?: PopoverContentProps["sideOffset"]
    align?: PopoverContentProps["align"]
    alignOffset?: PopoverContentProps["alignOffset"]
    avoidCollisions?: PopoverContentProps["avoidCollisions"]
    collisionBoundary?: PopoverContentProps["collisionBoundary"]
    collisionPadding?: PopoverContentProps["collisionPadding"]
    arrowPadding?: PopoverContentProps["arrowPadding"]
    sticky?: PopoverContentProps["sticky"]
    hideWhenDetached?: PopoverContentProps["hideWhenDetached"]
}

const PopoverContent = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            className={cn(
                "z-50 rounded-md border border-border bg-background-secondary p-1 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                className
            )}
            {...props}
        />
    </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

/*-----------------------------------------------------------------------------------------------*/
/* PopoverArrow */
/*-----------------------------------------------------------------------------------------------*/

const PopoverArrow = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Arrow>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>
>(({ className, ...props }, ref) => (
    <PopoverPrimitive.Arrow
        className={cn(
            "h-4 w-4 rotate-45 -translate-y-[calc(50%+1px)] bg-white border border-border border-t-transparent border-l-transparent rounded-br",
            className
        )}
        {...props}
        asChild
    >
        <div />
    </PopoverPrimitive.Arrow>
))
PopoverArrow.displayName = PopoverPrimitive.Arrow.displayName

export { PopoverRoot, PopoverTrigger, PopoverContent, PopoverArrow }
