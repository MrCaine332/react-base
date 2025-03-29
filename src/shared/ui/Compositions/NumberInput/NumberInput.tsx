import React from "react"

import { BaseInput } from "@/shared/ui/Compositions/Input"
import { Field, FieldPassableProps } from "@/shared/ui/Core/Field"
import { FieldWrapper, FieldWrapperPassableProps } from "@/shared/ui/Core/FieldWrapper"
import { useFieldProps } from "@/shared/ui/Core/Field/hooks"
import { useFieldWrapperProps } from "@/shared/ui/Core/FieldWrapper/hooks"
import { NumericFormat, NumericFormatProps } from "react-number-format"

/*-----------------------------------------------------------------------------------------------*/
/* NumberDisplay */
/*-----------------------------------------------------------------------------------------------*/

export type NumberDisplayProps = Omit<NumericFormatProps, "customInput" | "displayType" | "getInputRef">

const NumberDisplay = React.forwardRef<HTMLSpanElement, NumberDisplayProps>((props, ref) => (
    <NumericFormat getInputRef={ref} displayType="text" {...props} />
))
NumberDisplay.displayName = "NumberDisplay"

/*-----------------------------------------------------------------------------------------------*/
/* BaseNumberInput */
/*-----------------------------------------------------------------------------------------------*/

export type BaseNumberInputProps = Omit<NumericFormatProps, "customInput" | "displayType" | "getInputRef">

const BaseNumberInput = React.forwardRef<React.ElementRef<typeof BaseInput>, BaseNumberInputProps>((props, ref) => {
    return <NumericFormat getInputRef={ref} displayType="input" customInput={BaseInput} {...props} />
})
BaseNumberInput.displayName = "BaseNumberInput"

/*-----------------------------------------------------------------------------------------------*/
/* NumberInputField */
/*-----------------------------------------------------------------------------------------------*/

export type NumberInputFieldBaseProps = Omit<React.ComponentPropsWithoutRef<typeof BaseNumberInput>, "color">

export type NumberInputFieldExtraProps = FieldPassableProps & { inputClassName?: string }

export type NumberInputFieldProps = NumberInputFieldBaseProps & NumberInputFieldExtraProps

const NumberInputField = React.forwardRef<HTMLInputElement, NumberInputFieldProps>((props, ref) => {
    const { extracted, remaining } = useFieldProps(props)
    const { id, className, containerProps, inputClassName, ...inputProps } = remaining

    return (
        <Field {...containerProps} {...extracted} containerId={containerProps?.id} className={className} id={id}>
            {(ctx) => <BaseNumberInput ref={ref} className={inputClassName} {...ctx} {...inputProps} />}
        </Field>
    )
})
NumberInputField.displayName = "NumberInputField"

/*-----------------------------------------------------------------------------------------------*/
/* NumberInput */
/*-----------------------------------------------------------------------------------------------*/

export type NumberInputBaseProps = React.ComponentPropsWithoutRef<typeof NumberInputField>

export type NumberInputExtraProps = FieldWrapperPassableProps

export type NumberInputProps = NumberInputBaseProps & NumberInputExtraProps

const NumberInput = React.forwardRef<React.ElementRef<typeof NumberInputField>, NumberInputProps>((props, ref) => {
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
            <NumberInputField ref={ref} {...inputFieldProps} />
        </FieldWrapper>
    )
})
NumberInput.displayName = "NumberInput"

export { NumberDisplay, BaseNumberInput, NumberInputField, NumberInput }
