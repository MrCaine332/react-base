import React from "react"
import { Primitive } from "@radix-ui/react-primitive"
import "./Trigger.css"

import { cn } from "@/shared/utils/cn"
import { Field, FieldPassableProps } from "@/shared/ui/Core/Field"
import { FieldWrapper, FieldWrapperPassableProps } from "@/shared/ui/Core/FieldWrapper"
import { useFieldProps } from "@/shared/ui/Core/Field/hooks"
import { useFieldWrapperProps } from "@/shared/ui/Core/FieldWrapper/hooks"

/*-----------------------------------------------------------------------------------------------*/
/* TriggerButton */
/*-----------------------------------------------------------------------------------------------*/

export type TriggerButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>

const TriggerButton = React.forwardRef<HTMLButtonElement, TriggerButtonProps>(
    ({ className, asChild, ...props }, ref) => {
        return (
            <Primitive.button
                type={asChild ? undefined : "button"}
                ref={ref}
                className={cn("trigger-button", className)}
                asChild={asChild}
                {...props}
            />
        )
    }
)
TriggerButton.displayName = "TriggerButton"

/*-----------------------------------------------------------------------------------------------*/
/* TriggerField */
/*-----------------------------------------------------------------------------------------------*/

export type TriggerFieldBaseProps = Omit<React.ComponentPropsWithoutRef<typeof TriggerButton>, "color">

export type TriggerFieldExtraProps = FieldPassableProps & { buttonClassName?: string }

export type TriggerFieldProps = TriggerFieldBaseProps & TriggerFieldExtraProps

const TriggerField = React.forwardRef<React.ElementRef<typeof TriggerButton>, TriggerFieldProps>((props, ref) => {
    const { extracted, remaining } = useFieldProps(props)
    const { id, className, containerProps, buttonClassName, ...buttonProps } = remaining

    return (
        <Field {...containerProps} {...extracted} containerId={containerProps?.id} className={className} id={id}>
            {/* eslint-disable-next-line @typescript-eslint/no-shadow */}
            {({ id, disabled }) => (
                <TriggerButton ref={ref} className={buttonClassName} id={id} disabled={disabled} {...buttonProps} />
            )}
        </Field>
    )
})
TriggerField.displayName = "TriggerField"

/*-----------------------------------------------------------------------------------------------*/
/* Trigger */
/*-----------------------------------------------------------------------------------------------*/

export type TriggerBaseProps = React.ComponentPropsWithoutRef<typeof TriggerField>

export type TriggerExtraProps = FieldWrapperPassableProps

export type TriggerProps = TriggerBaseProps & TriggerExtraProps

const Trigger = React.forwardRef<React.ElementRef<typeof TriggerField>, TriggerProps>((props, ref) => {
    const { extracted, remaining } = useFieldWrapperProps(props)
    const { id, wrapperProps, wrapperClassName, ...triggerFieldProps } = remaining

    return (
        <FieldWrapper
            {...wrapperProps}
            {...extracted}
            className={wrapperClassName}
            wrapperId={wrapperProps?.id}
            id={id}
        >
            <TriggerField ref={ref} {...triggerFieldProps} />
        </FieldWrapper>
    )
})
Trigger.displayName = "Trigger"

export { TriggerButton, TriggerField, Trigger }
