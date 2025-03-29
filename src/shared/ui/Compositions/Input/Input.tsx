import React from "react"
import { Primitive } from "@radix-ui/react-primitive"
import "./Input.css"

import { cn } from "@/shared/utils/cn"
import { Field, FieldPassableProps } from "@/shared/ui/Core/Field"
import { FieldWrapper, FieldWrapperPassableProps } from "@/shared/ui/Core/FieldWrapper"
import { useFieldProps } from "@/shared/ui/Core/Field/hooks"
import { useFieldWrapperProps } from "@/shared/ui/Core/FieldWrapper/hooks"

/*-----------------------------------------------------------------------------------------------*/
/* BaseInput */
/*-----------------------------------------------------------------------------------------------*/

export type BaseInputProps = React.ComponentPropsWithoutRef<typeof Primitive.input> & {
    onValueChange?: (value: string) => void
}

const BaseInput = React.forwardRef<React.ElementRef<typeof Primitive.input>, BaseInputProps>(
    ({ className, onChange: _onChange, onValueChange, ...props }, ref) => {
        const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            _onChange?.(e)
            onValueChange?.(e.target.value)
        }

        return <Primitive.input ref={ref} className={cn("input", className)} {...props} onChange={onChange} />
    }
)
BaseInput.displayName = "BaseInput"

/*-----------------------------------------------------------------------------------------------*/
/* InputField */
/*-----------------------------------------------------------------------------------------------*/

export type InputFieldBaseProps = Omit<React.ComponentPropsWithoutRef<typeof BaseInput>, "color">

export type InputFieldExtraProps = FieldPassableProps & { inputClassName?: string }

export type InputFieldProps = InputFieldBaseProps & InputFieldExtraProps

const InputField = React.forwardRef<React.ElementRef<typeof BaseInput>, InputFieldProps>((props, ref) => {
    const { extracted, remaining } = useFieldProps(props)
    const { id, className, containerProps, inputClassName, ...inputProps } = remaining

    return (
        <Field {...containerProps} {...extracted} containerId={containerProps?.id} className={className} id={id}>
            {(ctx) => <BaseInput ref={ref} className={inputClassName} {...ctx} {...inputProps} />}
        </Field>
    )
})
InputField.displayName = "InputField"

/*-----------------------------------------------------------------------------------------------*/
/* Input */
/*-----------------------------------------------------------------------------------------------*/

export type InputBaseProps = React.ComponentPropsWithoutRef<typeof InputField>

export type InputExtraProps = FieldWrapperPassableProps

export type InputProps = InputBaseProps & InputExtraProps

const Input = React.forwardRef<React.ElementRef<typeof InputField>, InputProps>((props, ref) => {
    const { extracted, remaining } = useFieldWrapperProps(props)
    const { id, wrapperProps, wrapperClassName, ...inputFieldProps } = remaining

    return (
        <FieldWrapper
            {...wrapperProps}
            {...extracted}
            className={wrapperClassName}
            wrapperId={wrapperProps?.id}
            id={id}
        >
            <InputField ref={ref} {...inputFieldProps} />
        </FieldWrapper>
    )
})
Input.displayName = "Input"

export { BaseInput, InputField, Input }
