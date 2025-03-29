import * as React from "react"

import { BaseNumberInput, NumberDisplay, NumberInput, NumberInputField } from "@/shared/ui/Compositions/NumberInput"

/*-----------------------------------------------------------------------------------------------*/
/* CurrencyDisplay */
/*-----------------------------------------------------------------------------------------------*/

const CurrencyDisplay = (props: React.ComponentProps<typeof NumberDisplay>) => {
    return <NumberDisplay prefix="$" thousandSeparator decimalScale={2} fixedDecimalScale {...props} />
}

/*-----------------------------------------------------------------------------------------------*/
/* BaseCurrencyInput */
/*-----------------------------------------------------------------------------------------------*/

const BaseCurrencyInput = (props: React.ComponentProps<typeof BaseNumberInput>) => {
    return <BaseNumberInput prefix="$" thousandSeparator decimalScale={2} fixedDecimalScale {...props} />
}

/*-----------------------------------------------------------------------------------------------*/
/* CurrencyInputField */
/*-----------------------------------------------------------------------------------------------*/

const CurrencyInputField = (props: React.ComponentProps<typeof NumberInputField>) => {
    return <NumberInputField prefix="$" thousandSeparator decimalScale={2} fixedDecimalScale {...props} />
}

/*-----------------------------------------------------------------------------------------------*/
/* CurrencyInput */
/*-----------------------------------------------------------------------------------------------*/

const CurrencyInput = (props: React.ComponentProps<typeof NumberInput>) => {
    return <NumberInput prefix="$" thousandSeparator decimalScale={2} fixedDecimalScale {...props} />
}

export { CurrencyDisplay, BaseCurrencyInput, CurrencyInputField, CurrencyInput }
