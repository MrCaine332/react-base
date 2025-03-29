import { FieldWrapperExtraProps } from "@/shared/ui/Core/FieldWrapper"
import { castDataPropToBoolean } from "@/shared/utils/castDataPropToBoolean"
import { useExtractedProps } from "@/shared/hooks/useExtractedProps"

const keys: (keyof FieldWrapperExtraProps)[] = [
    "status",
    "disabled",
    "message",
    "messageClassName",
    "messageProps",
    "description",
    "descriptionClassName",
    "descriptionProps",
]

export const useFieldWrapperProps = <T extends FieldWrapperExtraProps>(props: T) => {
    const { extracted, remaining } = useExtractedProps(props, keys)

    extracted.status = extracted.status ?? props["data-status" as never]
    extracted.disabled = extracted.disabled ?? castDataPropToBoolean(props["data-disabled" as never])

    return { extracted, remaining }
}
