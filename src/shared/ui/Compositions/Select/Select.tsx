import * as React from "react"

import { PopoverContent, PopoverRoot, PopoverTrigger } from "@/shared/ui/Primitives/Popover"
import { Trigger } from "@/shared/ui/Compositions/Trigger"
import { Selectable } from "@/shared/ui/Primitives/Selectable"
import { SelectOption, SelectOptionGroup, SelectOptionsProps, SelectValue } from "@/shared/ui/Compositions/Select/types"
import {
    SelectContent,
    SelectContentExtraProps,
    useSelectContentProps,
} from "@/shared/ui/Compositions/Select/SelectContent"

import { normalizeSingleSelectValue } from "@/shared/ui/Compositions/Select/utils/normalizeSingleSelectValue"
import { __DEV__ } from "@/shared/constants"

import { useValueDefinitionTrack } from "@/shared/hooks/useValueDefinitionTrack"
import { usePopoverContentExtraProps } from "@/shared/ui/Primitives/Popover/hooks/usePopoverContentExtraProps"
import { useSelectOptionsProps } from "@/shared/ui/Compositions/Select/hooks/useSelectOptionsProps"
import { cn } from "@/shared/utils/cn"
import { AddonOpenChevron } from "@/shared/ui/Core/AddonBox/addons"

/*-----------------------------------------------------------------------------------------------*/
/* Select */
/*-----------------------------------------------------------------------------------------------*/

export type SelectRootProps = React.ComponentProps<typeof PopoverRoot> &
    Omit<React.ComponentProps<typeof PopoverContent>, "forceMount" | "asChild">

export type SelectBaseProps = Omit<React.ComponentProps<typeof Trigger>, "value" | "defaultValue">

export type SelectExtraProps = SelectContentExtraProps & {
    contentClassName?: string
    contentProps?: React.ComponentProps<typeof Selectable>
}

export type SelectValueOptionsProps<Option extends SelectOption> = SelectOptionsProps<Option> & {
    value?: SelectValue<Option>
    defaultValue?: SelectValue<Option>
    onValueChange?: (option: Option | null, index: number, group: SelectOptionGroup) => void

    renderTrigger?: (value: Option | null) => React.ReactNode
    renderValue?: (value: Option | null) => React.ReactNode
    placeholder?: React.ReactNode
}

export type SelectProps<Option extends SelectOption> = SelectRootProps &
    SelectBaseProps &
    SelectExtraProps &
    SelectValueOptionsProps<Option>

const Select = <Option extends SelectOption = SelectOption>({
    disabled,

    open: _open,
    defaultOpen,
    onOpenChange: _onOpenChange,
    modal,

    value: _value,
    defaultValue,
    onValueChange: _onValueChange,
    placeholder,

    renderTrigger,
    renderValue,

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
            <PopoverTrigger asChild>
                {renderTrigger ? (
                    renderTrigger(value)
                ) : (
                    <Trigger
                        {...rest}
                        disabled={disabled}
                        className={cn(!value && "text-foreground-tertiary", props.className)}
                        active={props.active === undefined ? open : props.active}
                        addonAfter={addonAfter !== undefined ? addonAfter : <AddonOpenChevron open={open} />}
                    >
                        {value ? (renderValue ? renderValue(value) : value.label) : placeholder}
                    </Trigger>
                )}
            </PopoverTrigger>
            <PopoverContent className="p-0 min-w-[var(--radix-popover-trigger-width)]" asChild {...popoverContentProps}>
                <SelectContent
                    defaultValue={value?.label}
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

export { Select }
