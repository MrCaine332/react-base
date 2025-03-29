import React from "react"
import "./Field.css"

import { cn } from "@/shared/utils/cn"
import { cva, type VariantProps } from "class-variance-authority"
import { useId } from "@/shared/hooks/useId"
import { useFieldWrapperContext } from "@/shared/ui/Core/FieldWrapper"
import { castDataPropToBoolean } from "@/shared/utils/castDataPropToBoolean"
import { AddonBox, AddonBoxExtraProps } from "@/shared/ui/Core/AddonBox"
import { Label } from "@/shared/ui/Core/Label"

/*-----------------------------------------------------------------------------------------------*/
/* Field Context */
/*-----------------------------------------------------------------------------------------------*/

type FieldContextValue = {
    id: string
    status?: "error" | "warning" | "success" | "info"
    active?: boolean
    disabled?: boolean
}

const FieldContext = React.createContext<FieldContextValue | undefined>(undefined)

export const useFieldContext = () => React.useContext(FieldContext)

/*-----------------------------------------------------------------------------------------------*/
/* Field */
/*-----------------------------------------------------------------------------------------------*/

const fieldVariants = cva("field", {
    variants: {
        variant: {
            outlined: "field-outlined",
            filled: "field-filled",
            "filled-outlined": "field-filled-outlined",
            simple: "field-simple",
            unstyled: "field-unstyled",
        },
        status: {
            error: "status-error",
            warning: "status-warning",
            success: "status-success",
            info: "status-info",
        },
        color: {
            default: "color-default",
            danger: "color-danger",
            warning: "color-warning",
            success: "color-success",
            info: "color-info",
        },
        active: {
            true: "field-active",
        },
        disabled: {
            true: "field-disabled",
        },
    },
    defaultVariants: {
        variant: "outlined",
        color: "default",
    },
})

export type FieldBaseProps = Omit<React.ComponentPropsWithoutRef<typeof AddonBox>, "color" | "children"> & {
    children?: ((context: FieldContextValue) => React.ReactNode) | React.ReactNode
}

export type FieldExtraProps = {
    containerId?: string

    disabled?: boolean
    active?: boolean
    optional?: boolean

    label?: React.ReactNode
    labelClassName?: string
    labelProps?: React.ComponentProps<typeof Label>
} & VariantProps<typeof fieldVariants>

export type FieldProps = FieldBaseProps & FieldExtraProps

const Field = React.forwardRef<React.ElementRef<typeof AddonBox>, FieldProps>(
    (
        {
            id: _id,

            containerId,

            variant,
            status: _status,
            color: _color,
            disabled: _disabled,
            active: _active,
            optional,

            label,
            labelClassName,
            labelProps,

            className,
            children,
            ...props
        },
        ref
    ) => {
        const ctx = useFieldWrapperContext()

        const status = _status ?? ctx?.status ?? props["data-status" as never]
        const color = _color ?? props["data-color" as never]
        const active = _active ?? castDataPropToBoolean(props["data-active" as never])
        const disabled = _disabled ?? ctx?.disabled ?? castDataPropToBoolean(props["data-disabled" as never])

        const id = useId(_id ?? ctx?.id)

        return (
            <FieldContext.Provider value={{ id: id, status, active, disabled }}>
                <AddonBox
                    ref={ref}
                    className={cn(fieldVariants({ variant, status, color, active, disabled }), className)}
                    id={containerId}
                    {...props}
                >
                    {typeof children === "function" ? children({ id, status, active, disabled }) : children}

                    {label !== undefined && (
                        <Label htmlFor={id} className={cn("field-label", labelClassName)} {...labelProps}>
                            {label}
                        </Label>
                    )}
                </AddonBox>
            </FieldContext.Provider>
        )
    }
)
Field.displayName = "Field"

/*-----------------------------------------------------------------------------------------------*/
/* Utility */
/*-----------------------------------------------------------------------------------------------*/

/* Utility type to transform how "Field" props are passed to the component that is wrapping "Field" */
export type FieldPassableProps = {
    containerProps?: FieldBaseProps & { ref?: React.ForwardedRef<React.ComponentRef<typeof Field>> }
} & AddonBoxExtraProps &
    Omit<FieldExtraProps, "containerId">

export { Field, fieldVariants }
