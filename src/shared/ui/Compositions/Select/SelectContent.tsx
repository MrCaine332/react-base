import * as React from "react"

import { ImSpinner8 } from "react-icons/im"
import { FaCheck, FaPlus } from "react-icons/fa6"
import { groupBy } from "lodash"
import {
    Selectable,
    SelectableEmpty,
    SelectableGroup,
    SelectableHeading,
    SelectableInput,
    SelectableItem,
    SelectableList,
    SelectableSeparator,
} from "@/shared/ui/Primitives/Selectable"
import { ScrollArea } from "@/shared/ui/Primitives/ScrollArea"
import { SelectOption, SelectOptionGroup, SelectOptionsProps } from "@/shared/ui/Compositions/Select/types"

import { useSelectable } from "@/shared/lib/Selectable"
import { cn } from "@/shared/utils/cn"
import { sortStrings } from "@/shared/utils/sortStrings"
import { useExtractedProps } from "@/shared/hooks/useExtractedProps"

/*-----------------------------------------------------------------------------------------------*/
/* Searchable and Creatable */
/*-----------------------------------------------------------------------------------------------*/

export const SELECT_OPTIONS_GROUP = "__options__"

export const SELECT_CREATABLE_VALUE = "__creatable__"

export type SelectSearchableProps = {
    searchable?: boolean
    search?: string
    onSearchChange?: (value: string) => void

    searchClassName?: string
    searchProps?: Omit<React.ComponentProps<typeof SelectableInput>, "value" | "onValueChange">
    renderSearch?: () => React.ReactNode

    shouldFilter?: boolean
    filter?: (value: string, search: string, keywords?: string[]) => number
}

export type SelectCreatableProps = {
    creatable?: boolean
    creatableValue?: string
    onCreate?: (value: string) => void

    creatablePosition?: "top" | "bottom"
    creatableClassName?: string
    creatableProps?: React.ComponentProps<typeof SelectableItem>

    creatableGroupClassName?: string
    creatableGroupProps?: React.ComponentProps<typeof SelectableGroup>

    forceCreatableMount?: boolean
    renderCreatableContent?: (value: string) => React.ReactNode
}

type SelectContentCreatableProps = React.ComponentProps<typeof SelectableItem> & {
    value?: string
    onCreate?: (value: string) => void
    renderCreatableContent?: (value: string) => React.ReactNode
}

export const SelectContentCreatable = React.forwardRef<
    React.ElementRef<typeof SelectableItem>,
    SelectContentCreatableProps
>(({ value: _value, onCreate, forceMount, renderCreatableContent, className, ...props }, ref) => {
    const search = useSelectable((state) => state.search)

    const render = forceMount || !!search
    if (!render) return null

    const value = _value ?? search

    return (
        <SelectableItem
            ref={ref}
            value={SELECT_CREATABLE_VALUE}
            onSelect={() => onCreate?.(value)}
            className={cn("gap-1 !h-auto min-h-8 text-primary-500", className)}
            {...props}
        >
            {renderCreatableContent ? (
                renderCreatableContent(value)
            ) : (
                <>
                    <FaPlus className="shrink-0" size={16} />
                    <span className="break-word">{value}</span>
                </>
            )}
        </SelectableItem>
    )
})

/*-----------------------------------------------------------------------------------------------*/
/* SelectContent */
/*-----------------------------------------------------------------------------------------------*/

export type SelectContentExtraProps = {
    loading?: boolean
    loadingIndicator?: React.ReactNode
    loadingIndicatorClassName?: string
    loadingIndicatorProps?: React.ComponentProps<typeof SelectableEmpty>

    emptyIndicator?: React.ReactNode
    emptyIndicatorClassName?: string
    emptyIndicatorProps?: React.ComponentProps<typeof SelectableEmpty>

    listClassName?: string
    listProps?: React.ComponentProps<typeof SelectableList>

    scrollAreaClassName?: string
    scrollAreaProps?: Omit<React.ComponentProps<typeof ScrollArea>, "viewportClassName" | "viewportProps">
    viewportClassName?: string
    viewportProps?: React.ComponentProps<typeof ScrollArea>["viewportProps"]

    footer?: React.ReactNode
    renderFooter?: () => React.ReactNode
    footerGroupClassName?: string
    footerGroupProps?: React.ComponentProps<typeof SelectableGroup>
} & SelectSearchableProps &
    SelectCreatableProps

export type SelectContentBaseProps = React.ComponentPropsWithoutRef<typeof Selectable>

export type SelectContentOptionsProps<Option extends SelectOption = SelectOption> = {
    getOptionSelected?: (option: Option) => boolean
    onOptionSelected?: (option: Option, selected: boolean, index: number, group: SelectOptionGroup) => void
}

export type SelectContentProps<Option extends SelectOption = SelectOption> = SelectContentBaseProps &
    SelectContentExtraProps &
    SelectOptionsProps<Option> &
    SelectContentOptionsProps<Option>

function _SelectContent<Option extends SelectOption = SelectOption>(
    {
        disabled,

        options,
        optionClassName,
        optionPropsBuilder,
        renderOptionContent,
        forceOptionIndicatorsMount,
        renderOptionIndicator,

        onOptionSelected,
        getOptionSelected,

        sortGroups = sortStrings,
        groupClassName,
        groupPropsBuilder,

        forceHeadingsMount,
        headingClassName,
        headingPropsBuilder,
        renderHeadingContent,

        loading,
        loadingIndicator,
        loadingIndicatorClassName,
        loadingIndicatorProps,

        emptyIndicator,
        emptyIndicatorClassName,
        emptyIndicatorProps,

        listClassName,
        listProps,

        scrollAreaClassName,
        scrollAreaProps,
        viewportClassName,
        viewportProps,

        footer,
        renderFooter,
        footerGroupClassName,
        footerGroupProps,

        searchable,
        search,
        onSearchChange,
        searchClassName,
        searchProps,
        renderSearch,

        creatable,
        creatableValue,
        onCreate,
        creatablePosition = "top",
        creatableClassName,
        creatableProps,
        creatableGroupClassName,
        creatableGroupProps,
        forceCreatableMount,
        renderCreatableContent,

        children,
        ...props
    }: SelectContentProps<Option>,
    ref: React.ForwardedRef<React.ComponentRef<typeof Selectable>>
) {
    /* Loading Indicator */
    /* ============================================== */
    const LoadingIndicator = (
        <SelectableEmpty
            className={cn("text-foreground-secondary", loadingIndicatorClassName)}
            {...loadingIndicatorProps}
        >
            {loadingIndicator !== undefined ? (
                loadingIndicator
            ) : (
                <div className="py-4 flex items-center justify-center gap-2 text-sm">
                    Loading...
                    <ImSpinner8 className="animate-spin" />
                </div>
            )}
        </SelectableEmpty>
    )

    /* Empty Indicator */
    /* ============================================== */
    const EmptyIndicator = (
        <SelectableEmpty className={emptyIndicatorClassName} {...emptyIndicatorProps}>
            {emptyIndicator !== undefined ? (
                emptyIndicator
            ) : (
                <div className="py-4 text-center text-sm">No options found.</div>
            )}
        </SelectableEmpty>
    )

    /* Searchable */
    /* ============================================== */
    const Searchable = searchable ? (
        renderSearch ? (
            renderSearch()
        ) : (
            <>
                <SelectableInput
                    value={search}
                    onValueChange={onSearchChange}
                    className={searchClassName}
                    {...searchProps}
                />
                <SelectableSeparator alwaysRender className="mx-auto" />
            </>
        )
    ) : null

    /* Creatable */
    /* ============================================== */
    const Creatable = creatable ? (
        <SelectableGroup forceMount className={creatableGroupClassName} {...creatableGroupProps}>
            <SelectContentCreatable
                forceMount={forceCreatableMount}
                value={creatableValue}
                onCreate={onCreate}
                renderCreatableContent={renderCreatableContent}
                className={creatableClassName}
                {...creatableProps}
            />
        </SelectableGroup>
    ) : null

    /* Options and Groups */
    /* ============================================== */
    const getOptions = () => {
        const grouped = groupBy(options, (o) => o.group || SELECT_OPTIONS_GROUP)
        const groups = Object.keys(grouped)
        const sorted = sortGroups(groups)

        const shouldRenderHeadings = forceHeadingsMount || sorted.length > 1

        return (
            <>
                {sorted.map((group) => {
                    const options = grouped[group]

                    return (
                        <SelectableGroup
                            key={group}
                            className={groupClassName}
                            {...groupPropsBuilder?.(group, options)}
                        >
                            {shouldRenderHeadings ? (
                                <SelectableHeading
                                    className={headingClassName}
                                    {...headingPropsBuilder?.(group, options)}
                                >
                                    {renderHeadingContent
                                        ? renderHeadingContent(group, options)
                                        : group === SELECT_OPTIONS_GROUP
                                          ? "Options"
                                          : group}
                                </SelectableHeading>
                            ) : null}

                            {options.map((option, index) => {
                                const selected = getOptionSelected?.(option) ?? false
                                const optionProps = optionPropsBuilder?.(option, selected, index, group)

                                const optionDisabled = option.disabled ?? optionProps?.disabled ?? disabled

                                return (
                                    <SelectableItem
                                        key={option.value}
                                        value={option.label}
                                        {...optionProps}
                                        disabled={optionDisabled}
                                        className={cn(optionClassName, optionProps?.className)}
                                        onSelect={() => {
                                            onOptionSelected?.(option, !selected, index, group)
                                            optionProps?.onSelect?.(option.value)
                                        }}
                                    >
                                        <>
                                            {renderOptionContent ? (
                                                renderOptionContent(option, selected, index, group)
                                            ) : (
                                                <span className="overflow-hidden text-ellipsis whitespace-pre-wrap pr-0.5">
                                                    {option.label}
                                                </span>
                                            )}
                                            {forceOptionIndicatorsMount || selected ? (
                                                renderOptionIndicator ? (
                                                    renderOptionIndicator(option, selected, index, group)
                                                ) : (
                                                    <FaCheck size={12} className="shrink-0 ml-auto text-primary-500" />
                                                )
                                            ) : null}
                                        </>
                                    </SelectableItem>
                                )
                            })}
                        </SelectableGroup>
                    )
                })}
            </>
        )
    }
    const Options = getOptions()

    /* Footer */
    /* ============================================== */
    const Footer = renderFooter ? (
        renderFooter()
    ) : footer ? (
        <>
            <SelectableSeparator alwaysRender className="mx-auto" />
            <SelectableGroup forceMount className={cn("p-1", footerGroupClassName)} {...footerGroupProps}>
                {footer}
            </SelectableGroup>
        </>
    ) : null

    /* ============================================== */
    return (
        <Selectable ref={ref} disabled={disabled} {...props}>
            {Searchable}

            <SelectableList className={cn("!p-0", listClassName)} {...listProps}>
                {loading ? (
                    LoadingIndicator
                ) : (
                    <ScrollArea
                        className={scrollAreaClassName}
                        {...scrollAreaProps}
                        viewportClassName={cn("max-h-72 w-full [&>div]:!block [&>div]:p-1", viewportClassName)}
                        viewportProps={viewportProps}
                    >
                        {creatablePosition === "top" && Creatable}

                        {EmptyIndicator}

                        {Options}

                        {creatablePosition === "bottom" && Creatable}
                    </ScrollArea>
                )}

                {Footer}
            </SelectableList>

            {children}
        </Selectable>
    )
}

const SelectContent = React.forwardRef(_SelectContent) as <Option extends SelectOption = SelectOption>(
    props: SelectContentProps<Option> & { ref?: React.ForwardedRef<React.ComponentRef<typeof Selectable>> }
) => React.ReactElement

/*-----------------------------------------------------------------------------------------------*/
/* useSelectContentProps */

/*-----------------------------------------------------------------------------------------------*/

const keys: (keyof SelectContentExtraProps)[] = [
    "loading",
    "loadingIndicator",
    "loadingIndicatorClassName",
    "loadingIndicatorProps",

    "emptyIndicator",
    "emptyIndicatorClassName",
    "emptyIndicatorProps",

    "listClassName",
    "listProps",

    "scrollAreaClassName",
    "scrollAreaProps",
    "viewportClassName",
    "viewportProps",

    "search",
    "searchable",
    "onSearchChange",
    "searchClassName",
    "searchProps",
    "renderSearch",
    "filter",
    "shouldFilter",

    "creatable",
    "creatableValue",
    "onCreate",
    "creatablePosition",
    "creatableClassName",
    "creatableProps",
    "creatableGroupClassName",
    "creatableGroupProps",
    "forceCreatableMount",
    "renderCreatableContent",

    "footer",
    "renderFooter",
    "footerGroupClassName",
    "footerGroupProps",
]

function useSelectContentProps(props: SelectContentExtraProps) {
    return useExtractedProps(props, keys)
}

/*-----------------------------------------------------------------------------------------------*/
/* exports */
/*-----------------------------------------------------------------------------------------------*/

export { SelectContent, useSelectContentProps }
