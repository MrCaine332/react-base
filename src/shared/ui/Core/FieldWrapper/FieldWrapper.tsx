import * as React from "react"
import { Primitive } from "@radix-ui/react-primitive"
import "./FieldWrapper.css"

import { UIStatusProps } from "@/shared/ui/types/UIStatus"
import { cn } from "@/shared/utils/cn"
import { useId } from "@/shared/hooks/useId"
import { castDataPropToBoolean } from "@/shared/utils/castDataPropToBoolean"
import { Message } from "@/shared/ui/Core/Message"
import { Description } from "@/shared/ui/Core/Description"

/*-----------------------------------------------------------------------------------------------*/
/* Field Wrapper Context */
/*-----------------------------------------------------------------------------------------------*/

type FieldWrapperContextValue = {
    id: string
    active?: boolean
    disabled?: boolean
} & UIStatusProps

const FieldWrapperContext = React.createContext<FieldWrapperContextValue | undefined>(undefined)

export const useFieldWrapperContext = () => React.useContext(FieldWrapperContext)

/*-----------------------------------------------------------------------------------------------*/
/* FieldWrapper */
/*-----------------------------------------------------------------------------------------------*/

export type FieldWrapperBaseProps = React.ComponentProps<typeof Primitive.div>

export type FieldWrapperExtraProps = {
    wrapperId?: string
    disabled?: boolean

    message?: React.ReactNode
    messageClassName?: string
    messageProps?: Omit<React.ComponentProps<typeof Message>, "className">

    description?: React.ReactNode
    descriptionClassName?: string
    descriptionProps?: Omit<React.ComponentProps<typeof Description>, "className">
} & UIStatusProps

export type FieldWrapperProps = FieldWrapperBaseProps & FieldWrapperExtraProps

const FieldWrapper = React.forwardRef<React.ElementRef<typeof Primitive.div>, FieldWrapperProps>(
    (
        {
            id: _id,
            wrapperId,

            status: _status,
            disabled: _disabled,

            message,
            messageClassName,
            messageProps,

            description,
            descriptionClassName,
            descriptionProps,

            className,
            children,
            ...props
        },
        ref
    ) => {
        const status = _status ?? props["data-status" as never]
        const disabled = _disabled ?? castDataPropToBoolean(props["data-disabled" as never])

        const id = useId(_id)

        return (
            <FieldWrapperContext.Provider value={{ id: id, status, disabled }}>
                <Primitive.div
                    ref={ref}
                    id={wrapperId}
                    className={cn("field-wrapper overflow-visible", disabled && "field-disabled", className)}
                    {...props}
                >
                    {children}
                    <Message
                        status={status}
                        className={cn("field-message", messageClassName)}
                        id={`${id}-message`}
                        {...messageProps}
                    >
                        {message}
                    </Message>
                    <Description
                        className={cn("field-description", descriptionClassName)}
                        id={`${id}-description`}
                        {...descriptionProps}
                    >
                        {description}
                    </Description>
                </Primitive.div>
            </FieldWrapperContext.Provider>
        )
    }
)
FieldWrapper.displayName = "FieldWrapper"

/*-----------------------------------------------------------------------------------------------*/
/* Utility */
/*-----------------------------------------------------------------------------------------------*/

/* Utility type to transform how "FieldWrapper" props are passed to the component that is wrapping "FieldWrapper" */
export type FieldWrapperPassableProps = {
    wrapperClassName?: string
    wrapperProps?: FieldWrapperBaseProps & { ref?: React.ForwardedRef<React.ElementRef<typeof Primitive.div>> }
} & Omit<FieldWrapperExtraProps, "wrapperId">

export { FieldWrapper }
