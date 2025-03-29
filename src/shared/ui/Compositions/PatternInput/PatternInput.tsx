import React from "react"

import { BaseInput } from "@/shared/ui/Compositions/Input"
import { Field, FieldPassableProps } from "@/shared/ui/Core/Field"
import { FieldWrapper, FieldWrapperPassableProps } from "@/shared/ui/Core/FieldWrapper"
import { useFieldProps } from "@/shared/ui/Core/Field/hooks"
import { useFieldWrapperProps } from "@/shared/ui/Core/FieldWrapper/hooks"
import { PatternFormat, PatternFormatProps } from "react-number-format"

/*-----------------------------------------------------------------------------------------------*/
/* PatternDisplay */
/*-----------------------------------------------------------------------------------------------*/

export type PatternDisplayProps = Omit<PatternFormatProps, "customInput" | "displayType" | "getInputRef">

const PatternDisplay = React.forwardRef<HTMLSpanElement, PatternDisplayProps>((props, ref) => (
    <PatternFormat getInputRef={ref} displayType="text" {...props} />
))
PatternDisplay.displayName = "PatternDisplay"

/*-----------------------------------------------------------------------------------------------*/
/* BasePatternInput */
/*-----------------------------------------------------------------------------------------------*/

export type BasePatternInputProps = Omit<PatternFormatProps, "customInput" | "displayType" | "getInputRef">

const BasePatternInput = React.forwardRef<React.ElementRef<typeof BaseInput>, BasePatternInputProps>((props, ref) => {
    return <PatternFormat getInputRef={ref} displayType="input" customInput={BaseInput} {...props} />
})
BasePatternInput.displayName = "BasePatternInput"

/*-----------------------------------------------------------------------------------------------*/
/* PatternInputField */
/*-----------------------------------------------------------------------------------------------*/

export type PatternInputFieldBaseProps = Omit<React.ComponentPropsWithoutRef<typeof BasePatternInput>, "color">

export type PatternInputFieldExtraProps = FieldPassableProps & { inputClassName?: string }

export type PatternInputFieldProps = PatternInputFieldBaseProps & PatternInputFieldExtraProps

const PatternInputField = React.forwardRef<HTMLInputElement, PatternInputFieldProps>((props, ref) => {
    const { extracted, remaining } = useFieldProps(props)
    const { id, className, containerProps, inputClassName, ...inputProps } = remaining

    return (
        <Field {...containerProps} {...extracted} containerId={containerProps?.id} className={className} id={id}>
            {(ctx) => <BasePatternInput ref={ref} className={inputClassName} {...ctx} {...inputProps} />}
        </Field>
    )
})
PatternInputField.displayName = "PatternInputField"

/*-----------------------------------------------------------------------------------------------*/
/* PatternInput */
/*-----------------------------------------------------------------------------------------------*/

export type PatternInputBaseProps = React.ComponentPropsWithoutRef<typeof PatternInputField>

export type PatternInputExtraProps = FieldWrapperPassableProps

export type PatternInputProps = PatternInputBaseProps & PatternInputExtraProps

const PatternInput = React.forwardRef<React.ElementRef<typeof PatternInputField>, PatternInputProps>((props, ref) => {
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
            <PatternInputField ref={ref} {...inputFieldProps} />
        </FieldWrapper>
    )
})
PatternInput.displayName = "PatternInput"

export { PatternDisplay, BasePatternInput, PatternInputField, PatternInput }
