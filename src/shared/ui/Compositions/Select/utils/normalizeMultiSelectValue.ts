import { MultiSelectValue, SelectOption } from "@/shared/ui/Compositions/Select/types"

export function normalizeMultiSelectValue<Option extends SelectOption = SelectOption>(
    options: Option[],
    value: MultiSelectValue<Option>
): Option[] {
    if (value.length === 0) return []
    if (typeof value[0] !== "string") return value as Option[]

    const map = new Map(options.map((v) => [v.value, v]))
    return (value as string[]).map((v) => map.get(v) ?? ({ value: v, label: v } as Option))
}
