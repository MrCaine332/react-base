import * as React from "react"

export const useValueDefinitionTrack = (value: unknown) => {
    const previousValue = React.useRef<unknown>(value)

    React.useEffect(() => {
        const valueDefined = value !== undefined
        const prevValueDefined = previousValue.current !== undefined

        if (valueDefined && !prevValueDefined) {
            throw new Error(
                "A component is changing a controlled value to be uncontrolled. " +
                    "This is likely caused by the value changing from a defined to undefined, which should not happen. " +
                    "Decide between using a controlled or uncontrolled input element for the lifetime of the component. " +
                    "More info: https://react.dev/link/controlled-components"
            )
        }
        if (!prevValueDefined && valueDefined) {
            throw new Error(
                "A component is changing a uncontrolled value to be controlled. " +
                    "This is likely caused by the value changing from a defined to undefined, which should not happen. " +
                    "Decide between using a controlled or uncontrolled input element for the lifetime of the component. " +
                    "More info: https://react.dev/link/controlled-components"
            )
        }

        previousValue.current = value
    }, [value])
}
