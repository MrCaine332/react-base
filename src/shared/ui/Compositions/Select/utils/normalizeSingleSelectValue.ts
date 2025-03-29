import { SelectOption, SelectValue } from "@/shared/ui/Compositions/Select/types"

export function normalizeSingleSelectValue<Option extends SelectOption = SelectOption>(
    options: Option[],
    value: SelectValue<Option>
): Option | null {
    if (value === null) return null
    if (typeof value !== "string") return value as Option
    return options.find((o) => o.value === value) ?? ({ value, label: value } as Option)
}
