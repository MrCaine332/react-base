import { FieldExtraProps } from "@/shared/ui/Core/Field"
import { AddonBoxExtraProps } from "@/shared/ui/Core/AddonBox"
import { castDataPropToBoolean } from "@/shared/utils/castDataPropToBoolean"
import { useExtractedProps } from "@/shared/hooks/useExtractedProps"

const keys: (keyof (FieldExtraProps & AddonBoxExtraProps))[] = [
    "variant",
    "status",
    "color",
    "disabled",
    "active",
    "label",
    "labelClassName",
    "labelProps",
    "addonBefore",
    "addonBeforeClassName",
    "addonBeforeProps",
    "addonAfter",
    "addonAfterClassName",
    "addonAfterProps",
]

export const useFieldProps = <T extends FieldExtraProps & AddonBoxExtraProps>(props: T) => {
    const { extracted, remaining } = useExtractedProps(props, keys)

    extracted.status = extracted.status ?? props["data-status" as never]
    extracted.color = extracted.color ?? props["data-color" as never]
    extracted.active = extracted.active ?? castDataPropToBoolean(props["data-active" as never])
    extracted.disabled = extracted.disabled ?? castDataPropToBoolean(props["data-disabled" as never])

    return { extracted, remaining }
}
