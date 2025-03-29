import * as React from "react"
import { SelectableGroup, SelectableHeading, SelectableItem } from "@/shared/ui/Primitives/Selectable"

/*-----------------------------------------------------------------------------------------------*/
/* Select Option definition. can be used across all Select-like components */
/*-----------------------------------------------------------------------------------------------*/

export type SelectOption<T = undefined> = {
    value: string
    label: string
    disabled?: boolean
    group?: string
} & (T extends undefined ? { context?: Record<string, any> } : { context: T })

/*-----------------------------------------------------------------------------------------------*/
/* SelectOptions props. Defines the props connected with Options and Option Groups */
/*-----------------------------------------------------------------------------------------------*/

type SelectOptionsGroup = "__options__"

export type SelectOptionGroup = SelectOptionsGroup | (string & {})

export type SelectOptionsProps<Option extends SelectOption = SelectOption> = {
    options?: Option[]
    optionClassName?: string
    optionPropsBuilder?: (
        option: Option,
        selected: boolean,
        index: number,
        group: SelectOptionGroup
    ) => React.ComponentProps<typeof SelectableItem> | undefined | void
    renderOptionContent?: (
        option: Option,
        selected: boolean,
        index: number,
        group: SelectOptionGroup
    ) => React.ReactNode

    forceOptionIndicatorsMount?: boolean
    renderOptionIndicator?: (
        option: Option,
        selected: boolean,
        index: number,
        group: SelectOptionGroup
    ) => React.ReactNode

    sortGroups?: (groups: SelectOptionGroup[]) => string[]
    groupClassName?: string
    groupPropsBuilder?: (
        group: SelectOptionGroup,
        options: Option[]
    ) => React.ComponentProps<typeof SelectableGroup> | undefined | void

    forceHeadingsMount?: boolean
    headingClassName?: string
    headingPropsBuilder?: (
        group: SelectOptionGroup,
        options: Option[]
    ) => React.ComponentProps<typeof SelectableHeading> | undefined | void
    renderHeadingContent?: (group: SelectOptionGroup, options: Option[]) => React.ReactNode
}

/*-----------------------------------------------------------------------------------------------*/
/* Single Select Value props and types */
/*-----------------------------------------------------------------------------------------------*/

export type SelectValue<Option> = string | Option | null

/*-----------------------------------------------------------------------------------------------*/
/* Multi Select Values props and types */
/*-----------------------------------------------------------------------------------------------*/

export type MultiSelectValue<Option> = string[] | Option[]
