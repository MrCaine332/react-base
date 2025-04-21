import * as React from "react"

import { PopoverContent, PopoverRoot, PopoverTrigger } from "@/shared/ui/Primitives/Popover"
import { Trigger } from "@/shared/ui/Compositions/Trigger"
import { MultiSelectValue, SelectOption, SelectOptionsProps } from "@/shared/ui/Compositions/Select/types"
import { SelectContent, useSelectContentProps } from "@/shared/ui/Compositions/Select/SelectContent"

import { __DEV__ } from "@/shared/constants"

import { useValueDefinitionTrack } from "@/shared/hooks/useValueDefinitionTrack"
import { usePopoverContentExtraProps } from "@/shared/ui/Primitives/Popover/hooks/usePopoverContentExtraProps"
import { useSelectOptionsProps } from "@/shared/ui/Compositions/Select/hooks/useSelectOptionsProps"
import { cn } from "@/shared/utils/cn"
import { AddonOpenChevron } from "@/shared/ui/Core/AddonBox/addons"
import { SelectBaseProps, SelectExtraProps, SelectRootProps } from "@/shared/ui/Compositions/Select"
import { normalizeMultiSelectValue } from "@/shared/ui/Compositions/Select/utils/normalizeMultiSelectValue"

/*-----------------------------------------------------------------------------------------------*/
/* Select */
/*-----------------------------------------------------------------------------------------------*/

export type MultiSelectValueOptionsProps<Option extends SelectOption> = SelectOptionsProps<Option> & {
    value?: MultiSelectValue<Option>
    defaultValue?: MultiSelectValue<Option>
    maxSelected?: number
    onValueChange?: (value: Option[], option: Option, selected: boolean) => void

    renderTrigger?: (value: Option[]) => React.ReactNode
    renderValue?: (value: Option[]) => React.ReactNode
    placeholder?: React.ReactNode
}

export type MultiSelectProps<Option extends SelectOption> = SelectRootProps &
    SelectBaseProps &
    SelectExtraProps &
    MultiSelectValueOptionsProps<Option>

const MultiSelect = <Option extends SelectOption = SelectOption>({
    disabled,

    open: _open,
    defaultOpen,
    onOpenChange: _onOpenChange,
    modal,

    value: _value,
    defaultValue,
    maxSelected,
    onValueChange: _onValueChange,
    placeholder,

    renderTrigger,
    renderValue,

    contentClassName,
    contentProps,

    children,
    addonAfter,
    ...props
}: MultiSelectProps<Option>) => {
    const { extracted: popoverContentProps, remaining: _ } = usePopoverContentExtraProps(props)
    const { extracted: selectOptionsProps, remaining: __ } = useSelectOptionsProps<Option>(_)
    const { extracted: selectContentProps, remaining: rest } = useSelectContentProps(__)
    const options = selectOptionsProps.options

    if (__DEV__) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useValueDefinitionTrack(_value)
    }

    const [innerOpen, setInnerOpen] = React.useState(defaultOpen ?? false)
    const open = _open ?? innerOpen
    const onOpenChange = (o: boolean) => {
        if (_open === undefined) setInnerOpen(o)
        _onOpenChange?.(o)
    }

    const [innerValue, setInnerValue] = React.useState(() =>
        defaultValue ? normalizeMultiSelectValue(options ?? [], defaultValue) : []
    )
    const value = _value !== undefined ? normalizeMultiSelectValue(options ?? [], _value) : innerValue
    const onValueChange = (value: Option[], option: Option, selected: boolean) => {
        if (_value === undefined) setInnerValue(value)
        _onValueChange?.(value, option, selected)
    }

    const onOptionSelected = (option: Option, selected: boolean) => {
        if (maxSelected && value.length >= maxSelected && selected) {
            return
        }

        const updatedValue = selected ? [...value, option] : value.filter((o) => o.value !== option.value)

        onValueChange(updatedValue, option, selected)
    }

    const getOptionSelected = (option: Option) => value.some((o) => o.value === option.value)

    const getOptionToScrollTo = () => {
        if (!open) return undefined
        if (value.length === 0) return undefined
        return value[value.length - 1]?.label ?? undefined
    }

    return (
        <PopoverRoot open={open} onOpenChange={onOpenChange} modal={modal}>
            <PopoverTrigger asChild>
                {renderTrigger ? (
                    renderTrigger(value)
                ) : (
                    <Trigger
                        {...rest}
                        disabled={disabled}
                        className={cn(value.length === 0 && "text-foreground-tertiary", props.className)}
                        active={props.active === undefined ? open : props.active}
                        addonAfter={addonAfter !== undefined ? addonAfter : <AddonOpenChevron open={open} />}
                    >
                        {value.length ? (renderValue ? renderValue(value) : `${value.length} selected`) : placeholder}
                    </Trigger>
                )}
            </PopoverTrigger>
            <PopoverContent className="p-0 min-w-[var(--radix-popover-trigger-width)]" asChild {...popoverContentProps}>
                <SelectContent
                    disabled={disabled}
                    defaultValue={getOptionToScrollTo()}
                    className={contentClassName}
                    {...contentProps}
                    {...selectContentProps}
                    {...selectOptionsProps}
                    onOptionSelected={onOptionSelected}
                    getOptionSelected={getOptionSelected}
                >
                    {children}
                </SelectContent>
            </PopoverContent>
        </PopoverRoot>
    )
}

export { MultiSelect }
