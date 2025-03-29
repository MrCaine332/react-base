/* Takes data prop from component props and tries to cast it to boolean,
    or returns undefined if no prop found.
    Example usage: const disabled = _disabled ?? castDataPropToBool(props["data-disabled"] as never) */

export const castDataPropToBoolean = (prop: never) => {
    if (prop === undefined) return undefined
    return prop === "true"
}
