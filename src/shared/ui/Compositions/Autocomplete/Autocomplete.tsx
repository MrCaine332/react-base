import * as React from "react"

import { PopoverContent, PopoverRoot } from "@/shared/ui/Primitives/Popover"
import { SelectOption, SelectOptionsProps, SelectValue } from "@/shared/ui/Compositions/Select/types"
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
import { propagateSelectableOnKeyDown } from "@/shared/lib/Selectable"

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
    onValueChange?: (value: Option | null) => void
}

export type AutocompleteExtraProps = Omit<SelectExtraProps, keyof SelectSearchableProps> & {
    renderInput?: () => React.ReactNode

    freeMode?: boolean

    openOnFocus?: boolean
    closeOnSelect?: boolean
    closeOnEmptyInputValue?: boolean
}

export type SelectProps<Option extends SelectOption> = SelectRootProps &
    AutocompleteBaseProps &
    AutocompleteExtraProps &
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

    freeMode,
    openOnFocus,
    closeOnSelect = true,
    closeOnEmptyInputValue,

    children,
    onFocus: _onFocus,
    onBlur: _onBlur,
    onKeyDown: _onKeyDown,
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

    /* State definition - open, inputValue, value */
    /*-----------------------------------------------------------------------------------------------*/
    const [innerOpen, setInnerOpen] = React.useState(defaultOpen ?? false)
    const open = _open ?? innerOpen
    const onOpenChange = (o: boolean) => {
        if (_open === undefined) setInnerOpen(o)
        _onOpenChange?.(o)
    }

    const [innerValue, setInnerValue] = React.useState(() =>
        defaultValue ? normalizeSingleSelectValue(options ?? [], defaultValue) : null
    )
    const value = _value !== undefined ? normalizeSingleSelectValue(options ?? [], _value) : innerValue
    const onValueChange = (value: Option | null) => {
        if (_value === undefined) setInnerValue(value)
        _onValueChange?.(value)
    }

    const [innerInputValue, setInnerInputValue] = React.useState(defaultInputValue ?? "")
    const inputValue = _inputValue ?? innerInputValue
    const onInputValueChange = (v: string) => {
        if (_inputValue === undefined) setInnerInputValue(v)
        _onInputValueChange?.(v)
    }

    /* Refs */
    /*-----------------------------------------------------------------------------------------------*/

    const inputRef = React.useRef<HTMLInputElement>(null)

    const selectableRef = React.useRef<HTMLDivElement>(null)

    /* Events */
    /*-----------------------------------------------------------------------------------------------*/

    const [focused, setFocused] = React.useState(false)

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(true)

        _onFocus?.(e)
        if (e.defaultPrevented) return

        if (openOnFocus) onOpenChange(true)
    }

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(false)

        _onBlur?.(e)
        if (e.defaultPrevented) return

        if (selectableRef.current?.contains(e.relatedTarget)) {
            inputRef.current?.focus()
        }
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        _onKeyDown?.(e)

        if (selectableRef.current) {
            propagateSelectableOnKeyDown(e, selectableRef.current)
            return
        }

        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            onOpenChange(true)
        }
    }

    const onOptionSelected = (option: Option) => {
        onValueChange(option)
        onInputValueChange(option.label)
        if (closeOnSelect) onOpenChange(false)
    }

    const onInputChange = (v: string) => {
        if (!open && v) onOpenChange(true)
        if (closeOnEmptyInputValue && !v) onOpenChange(false)

        onInputValueChange(v)

        if (!v) {
            onValueChange(null)
        }
    }

    /* value and inputValue synchronization */
    /*-----------------------------------------------------------------------------------------------*/

    React.useEffect(() => {
        if (focused || freeMode) return

        const newInputValue = value === null ? "" : value.label
        if (inputValue === newInputValue) return

        onInputValueChange(newInputValue)
    }, [value, focused, inputValue, freeMode])

    /* Render */
    /*-----------------------------------------------------------------------------------------------*/
    const getOptionSelected = (option: Option) => option.value === value?.value

    return (
        <PopoverRoot open={open} onOpenChange={onOpenChange} modal={modal}>
            <PopoverAnchor asChild>
                <Input
                    value={inputValue}
                    onValueChange={onInputChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onKeyDown={onKeyDown}
                    {...rest}
                    ref={inputRef}
                />
            </PopoverAnchor>
            <PopoverContent
                className="p-0 min-w-[var(--radix-popover-trigger-width)]"
                asChild
                {...popoverContentProps}
                onOpenAutoFocus={(e) => {
                    popoverContentProps.onOpenAutoFocus?.(e)
                    e.preventDefault()
                }}
                onFocusOutside={(e) => {
                    popoverContentProps.onFocusOutside?.(e)
                    const input = inputRef.current
                    if (input && e.target instanceof Node && input.contains(e.target)) {
                        e.preventDefault()
                    }
                }}
            >
                <SelectContent
                    ref={selectableRef}
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
