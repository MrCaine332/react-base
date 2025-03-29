import { SelectOption, SelectOptionsProps } from "@/shared/ui/Compositions/Select/types"
import { useExtractedProps } from "@/shared/hooks/useExtractedProps"

const keys: (keyof SelectOptionsProps)[] = [
    "options",
    "optionClassName",
    "optionPropsBuilder",
    "renderOptionContent",

    "forceOptionIndicatorsMount",
    "renderOptionIndicator",

    "sortGroups",
    "groupClassName",
    "groupPropsBuilder",

    "forceHeadingsMount",
    "headingClassName",
    "headingPropsBuilder",
    "renderHeadingContent",
]

export function useSelectOptionsProps<Option extends SelectOption = SelectOption>(props: SelectOptionsProps<Option>) {
    return useExtractedProps(props, keys)
}
