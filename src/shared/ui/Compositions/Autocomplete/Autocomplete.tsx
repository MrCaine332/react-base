import * as React from "react"

import { PopoverContent, PopoverRoot } from "@/shared/ui/Primitives/Popover"
import { SelectOption, SelectOptionGroup, SelectOptionsProps, SelectValue } from "@/shared/ui/Compositions/Select/types"
import {
    SelectContent,
    SelectSearchableProps,
    useSelectContentProps,
} from "@/shared/ui/Compositions/Select/SelectContent"

import { normalizeSingleSelectValue } from "@/shared/ui/Compositions/Select/utils/normalizeSingleSelectValue"
import { __DEV__ } from "@/shared/constants"

import { useValueDefinitionTrack } from "@/shared/hooks/useValueDefinitionTrack"
import { usePopoverContentExtraProps } from "@/shared/ui/Primitives/Popover/hooks/usePopoverContentExtraProps"
import { useSelectOptionsProps } from "@/shared/ui/Compositions/Select/hooks/useSelectOptionsProps"
import { Input } from "@/shared/ui/Compositions/Input"
import { SelectExtraProps, SelectRootProps } from "@/shared/ui/Compositions/Select"
import { PopoverAnchor } from "@radix-ui/react-popover"

/*-----------------------------------------------------------------------------------------------*/
/* Select */
/*-----------------------------------------------------------------------------------------------*/

export type AutocompleteBaseProps = Omit<React.ComponentProps<typeof Input>, "value" | "defaultValue" | "onValueChange">

export type SelectValueOptionsProps<Option extends SelectOption> = SelectOptionsProps<Option> & {
    inputValue?: string
    defaultInputValue?: string
    onInputValueChange?: (value: string) => void

    value?: SelectValue<Option>
    defaultValue?: SelectValue<Option>
    onValueChange?: (option: Option | null, index: number, group: SelectOptionGroup) => void
}

export type SelectProps<Option extends SelectOption> = SelectRootProps &
    AutocompleteBaseProps &
    Omit<SelectExtraProps, keyof SelectSearchableProps> &
    SelectValueOptionsProps<Option>

const Autocomplete = <Option extends SelectOption = SelectOption>({
    disabled,

    open: _open,
    defaultOpen,
    onOpenChange: _onOpenChange,
    modal,

    inputValue: _inputValue,
    defaultInputValue,
    onInputValueChange: _onInputValueChange,

    value: _value,
    defaultValue,
    onValueChange: _onValueChange,

    contentClassName,
    contentProps,

    children,
    addonAfter,
    ...props
}: SelectProps<Option>) => {
    const { extracted: popoverContentProps, remaining: _ } = usePopoverContentExtraProps(props)
    const { extracted: selectOptionsProps, remaining: __ } = useSelectOptionsProps<Option>(_)
    const { extracted: selectContentProps, remaining: rest } = useSelectContentProps(__)
    const options = selectOptionsProps.options

    if (__DEV__) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useValueDefinitionTrack(_value)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useValueDefinitionTrack(_inputValue)
    }

    const [open, setOpen] = React.useState(defaultOpen ?? false)
    const onOpenChange = (o: boolean) => {
        if (_open === undefined) setOpen(o)
        _onOpenChange?.(o)
    }

    const [innerValue, setInnerValue] = React.useState(() =>
        defaultValue ? normalizeSingleSelectValue(options ?? [], defaultValue) : null
    )
    const value = _value ? normalizeSingleSelectValue(options ?? [], _value) : innerValue
    const onValueChange = (value: Option | null, index: number, group: SelectOptionGroup) => {
        if (_value === undefined) setInnerValue(value)
        _onValueChange?.(value, index, group)
    }

    const onOptionSelected = (option: Option, selected: boolean, index: number, group: SelectOptionGroup) => {
        onValueChange(selected ? option : null, index, group)
    }

    const getOptionSelected = (option: Option) => option.value === value?.value

    return (
        <PopoverRoot open={open} onOpenChange={onOpenChange} modal={modal}>
            <PopoverAnchor asChild>
                <Input />
            </PopoverAnchor>
            <PopoverContent className="p-0 min-w-[var(--radix-popover-trigger-width)]" asChild {...popoverContentProps}>
                <SelectContent
                    disabled={disabled}
                    defaultValue={value?.label}
                    className={contentClassName}
                    {...contentProps}
                    {...selectContentProps}
                    {...selectOptionsProps}
                    onOptionSelected={onOptionSelected}
                    getOptionSelected={getOptionSelected}
                    searchable={false}
                >
                    {children}
                </SelectContent>
            </PopoverContent>
        </PopoverRoot>
    )
}

export { Autocomplete }
