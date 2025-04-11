import * as React from "react"
import { Selectable as SelectablePrimitive, useSelectableContext } from "@/shared/lib/Selectable"
import "./Selectable.css"

import { cn } from "@/shared/utils/cn"
import { Field, FieldPassableProps } from "@/shared/ui/Core/Field"
import { FaSearch } from "react-icons/fa"
import { useFieldProps } from "@/shared/ui/Core/Field/hooks"

/*-----------------------------------------------------------------------------------------------*/
/* Selectable */
/*-----------------------------------------------------------------------------------------------*/

const Selectable = React.forwardRef<
    React.ElementRef<typeof SelectablePrimitive>,
    React.ComponentPropsWithoutRef<typeof SelectablePrimitive>
>(({ className, shouldFilter = false, loop = true, ...props }, ref) => {
    return (
        <SelectablePrimitive
            ref={ref}
            className={cn("selectable", className)}
            shouldFilter={shouldFilter}
            loop={loop}
            {...props}
        />
    )
})
Selectable.displayName = SelectablePrimitive.displayName

/*-----------------------------------------------------------------------------------------------*/
/* SelectableList */
/*-----------------------------------------------------------------------------------------------*/

const SelectableList = React.forwardRef<
    React.ElementRef<typeof SelectablePrimitive.List>,
    React.ComponentPropsWithoutRef<typeof SelectablePrimitive.List>
>(({ className, ...props }, ref) => {
    return <SelectablePrimitive.List ref={ref} className={cn("selectable-list", className)} {...props} />
})
SelectableList.displayName = SelectablePrimitive.List.displayName

/*-----------------------------------------------------------------------------------------------*/
/* SelectableGroup */
/*-----------------------------------------------------------------------------------------------*/

const SelectableGroup = React.forwardRef<
    React.ElementRef<typeof SelectablePrimitive.Group>,
    React.ComponentPropsWithoutRef<typeof SelectablePrimitive.Group>
>(({ className, ...props }, ref) => {
    return <SelectablePrimitive.Group ref={ref} className={cn("selectable-group", className)} {...props} />
})

SelectableGroup.displayName = SelectablePrimitive.Group.displayName

/*-----------------------------------------------------------------------------------------------*/
/* SelectableHeading */
/*-----------------------------------------------------------------------------------------------*/

const SelectableHeading = React.forwardRef<
    React.ElementRef<typeof SelectablePrimitive.Heading>,
    React.ComponentPropsWithoutRef<typeof SelectablePrimitive.Heading>
>(({ className, ...props }, ref) => {
    return <SelectablePrimitive.Heading ref={ref} className={cn("selectable-group-heading", className)} {...props} />
})

SelectableGroup.displayName = SelectablePrimitive.Group.displayName

/*-----------------------------------------------------------------------------------------------*/
/* SelectableItem */
/*-----------------------------------------------------------------------------------------------*/

const SelectableItem = React.forwardRef<
    React.ElementRef<typeof SelectablePrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectablePrimitive.Item>
>(({ className, ...props }, ref) => {
    return <SelectablePrimitive.Item ref={ref} className={cn("selectable-item", className)} {...props} />
})
SelectableItem.displayName = SelectablePrimitive.Item.displayName

/*-----------------------------------------------------------------------------------------------*/
/* SelectableInput */
/*-----------------------------------------------------------------------------------------------*/

export type SelectableInputBaseProps = React.ComponentPropsWithoutRef<typeof SelectablePrimitive.Input>

export type SelectableInputExtraProps = FieldPassableProps & { inputClassName?: string }

export type SelectableInputProps = SelectableInputBaseProps & SelectableInputExtraProps

const SelectableInput = React.forwardRef<React.ElementRef<typeof SelectablePrimitive.Input>, SelectableInputProps>(
    (props, ref) => {
        const { extracted: fieldProps, remaining: _props } = useFieldProps(props)
        const { id, className, containerProps, inputClassName, ...inputProps } = _props
        const { addonAfter, variant, disabled: _disabled, ...rest } = fieldProps

        const ctx = useSelectableContext()
        const disabled = _disabled ?? ctx.disabled

        return (
            <Field
                variant={variant === undefined ? "simple" : variant}
                {...containerProps}
                {...rest}
                containerId={containerProps?.id}
                className={className}
                disabled={disabled}
                id={id}
                addonAfter={
                    addonAfter !== undefined ? (
                        addonAfter
                    ) : (
                        <FaSearch size={14} className="mx-2 text-foreground-secondary" />
                    )
                }
            >
                {(fieldCtx) => (
                    <SelectablePrimitive.Input
                        ref={ref}
                        className={cn("input selectable-input", inputClassName)}
                        {...fieldCtx}
                        {...inputProps}
                    />
                )}
            </Field>
        )
    }
)
SelectableInput.displayName = SelectablePrimitive.Input.displayName

/*-----------------------------------------------------------------------------------------------*/
/* SelectableEmpty */
/*-----------------------------------------------------------------------------------------------*/

const SelectableEmpty = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof SelectablePrimitive.Empty>>(
    ({ className, ...props }, ref) => {
        return <SelectablePrimitive.Empty ref={ref} className={cn("command-empty", className)} {...props} />
    }
)
SelectableEmpty.displayName = SelectablePrimitive.Empty.displayName

/*-----------------------------------------------------------------------------------------------*/
/* SelectableSeparator */
/*-----------------------------------------------------------------------------------------------*/

const SelectableSeparator = React.forwardRef<
    React.ElementRef<typeof SelectablePrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof SelectablePrimitive.Separator>
>(({ className, ...props }, ref) => {
    return <SelectablePrimitive.Separator ref={ref} className={cn("-mx-1 h-px bg-border", className)} {...props} />
})
SelectablePrimitive.displayName = SelectablePrimitive.Separator.displayName

/*-----------------------------------------------------------------------------------------------*/
/* Exports */
/*-----------------------------------------------------------------------------------------------*/

export {
    Selectable,
    SelectableList,
    SelectableGroup,
    SelectableHeading,
    SelectableItem,
    SelectableInput,
    SelectableEmpty,
    SelectableSeparator,
}
