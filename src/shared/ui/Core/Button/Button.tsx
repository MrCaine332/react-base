import * as React from "react"
import { Primitive } from "@radix-ui/react-primitive"
import { Slot, Slottable } from "@radix-ui/react-slot"
import "./Button.css"

import { cn } from "@/shared/utils/cn"
import { cva, type VariantProps } from "class-variance-authority"
import { ImSpinner8 } from "react-icons/im"

const buttonVariants = cva("button", {
    variants: {
        variant: {
            filled: "button-filled",
            outlined: "button-outlined",
            "filled-outlined": "button-filled-outlined",
            soft: "button-soft",
            link: "button-link",
            ghost: "button-ghost",
            unstyled: "button-unstyled",
        },
        color: {
            default: "button-default",
            primary: "button-primary",
            danger: "button-danger",
            warning: "button-warning",
            success: "button-success",
            // info: "button-info",
            neutral: "button-neutral",
        },
    },
    defaultVariants: {
        variant: "filled",
        color: "default",
    },
})

/*-----------------------------------------------------------------------------------------------*/
/* ButtonRoot */
/*-----------------------------------------------------------------------------------------------*/

export type ButtonRootProps = Omit<React.ComponentPropsWithoutRef<typeof Primitive.button>, "color"> &
    VariantProps<typeof buttonVariants>

const ButtonRoot = React.forwardRef<React.ElementRef<typeof Primitive.button>, ButtonRootProps>(
    ({ className, variant, color, asChild = false, ...props }, ref) => {
        return (
            <Primitive.button
                type={asChild ? undefined : "button"}
                className={cn(buttonVariants({ variant, color }), className)}
                ref={ref}
                asChild={asChild}
                {...props}
            />
        )
    }
)
ButtonRoot.displayName = "ButtonRoot"

/*-----------------------------------------------------------------------------------------------*/
/* Button */
/*-----------------------------------------------------------------------------------------------*/

export type ButtonProps = React.ComponentPropsWithoutRef<typeof ButtonRoot> & {
    icon?: React.ReactNode
    iconPosition?: "left" | "right"

    loading?: boolean
    loadingIcon?: React.ReactNode
    loadingIconClassName?: string
}

const Button = React.forwardRef<React.ElementRef<typeof ButtonRoot>, ButtonProps>(
    (
        {
            children,

            loading,
            loadingIcon,
            loadingIconClassName,

            icon,
            iconPosition = "right",

            disabled,
            ...props
        },
        ref
    ) => {
        const actualLoadingIcon =
            loadingIcon !== undefined ? (
                loadingIcon
            ) : (
                <ImSpinner8 className={cn("shrink-0 animate-spin", loadingIconClassName)} />
            )
        const actualIcon = loading ? actualLoadingIcon : icon
        const actualDisabled = disabled || loading

        return (
            <ButtonRoot ref={ref} disabled={actualDisabled} {...props}>
                {iconPosition === "left" && actualIcon}
                <Slottable>{children}</Slottable>
                {iconPosition === "right" && actualIcon}
            </ButtonRoot>
        )
    }
)
Button.displayName = "Button"

export { ButtonRoot, Button, buttonVariants }
