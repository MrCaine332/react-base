import * as React from "react"
import "./Stepper.css"

import { cn } from "@/shared/utils/cn"
import { useMergeRefs } from "@floating-ui/react"
import { useLazyRef } from "@/shared/hooks/useLazyRef"
import { useScheduleLayoutEffect } from "@/shared/hooks/useScheduleLayoutEffect"
import { useForceRerender } from "@/shared/hooks/useForceRerender"
import { useId } from "@/shared/hooks/useId"

/*-----------------------------------------------------------------------------------------------*/
/* Utils */
/*-----------------------------------------------------------------------------------------------*/

const findSelectableItems = (element: Element): Element[] => {
    const directItems = Array.from(element.querySelectorAll("[stepper-item]"))
    const childItems = Array.from(element.children).flatMap(findSelectableItems)
    return Array.from(new Set([...directItems, ...childItems]))
}

/*-----------------------------------------------------------------------------------------------*/
/* Stepper Context */
/*-----------------------------------------------------------------------------------------------*/

export type StepperContextValue = {
    map: Map<string, number>
    register: (id: string) => void
    value: number
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const StepperContext = React.createContext<StepperContextValue>(undefined)
const useStepperContext = () => React.useContext(StepperContext)

/*-----------------------------------------------------------------------------------------------*/
/* Stepper */
/*-----------------------------------------------------------------------------------------------*/

export type StepperProps = React.HTMLAttributes<HTMLDivElement> & {
    value: number
}

const StepperRoot = React.forwardRef<HTMLDivElement, StepperProps>(
    ({ value: _value, children, className, ...props }, ref) => {
        const wrapperRef = React.useRef<HTMLDivElement>(null)
        const mergedRef = useMergeRefs([ref, wrapperRef])

        const ids = useLazyRef<string[]>(() => [])
        const map = useLazyRef<Map<string, number>>(() => new Map())
        const value = React.useRef(0)

        const schedule = useScheduleLayoutEffect()
        const { rerender } = useForceRerender()

        const mapItems = React.useCallback(() => {
            if (!wrapperRef.current) return
            const el = wrapperRef.current
            const items = findSelectableItems(el)

            const newMap = new Map()

            items.forEach((item, index) => {
                newMap.set(item.id, index + 1)
            })

            map.current = newMap
        }, [])

        const register = React.useCallback((id: string) => {
            ids.current.push(id)

            schedule(1, () => {
                mapItems()
                rerender()
            })
        }, [])

        React.useLayoutEffect(() => {
            if (_value < 0) {
                throw new Error("Value cannot be less than 0")
            }

            mapItems()
            value.current = _value
            rerender()
        }, [_value])

        return (
            <StepperContext.Provider value={{ map: map.current, register, value: value.current }}>
                <div ref={mergedRef} {...props} className={cn("stepper", className)}>
                    {children}
                </div>
            </StepperContext.Provider>
        )
    }
)
StepperRoot.displayName = "StepperRoot"

/*-----------------------------------------------------------------------------------------------*/
/* StepperItem */
/*-----------------------------------------------------------------------------------------------*/

export type StepperItemProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
    fixed?: boolean | "active" | "inactive"

    barClassName?: string
    barProps?: React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>

    children?: ((active: boolean) => React.ReactNode) | React.ReactNode
}

const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
    ({ id: _id, children, fixed, className, barClassName, barProps, ...props }, ref) => {
        const ctx = useStepperContext()
        if (!ctx) {
            throw new Error("StepperItem must be used within a StepperRoot")
        }

        const id = useId(_id)

        React.useLayoutEffect(() => {
            ctx.register(id)
        }, [id])

        const position = ctx.map.get(id)
        let active = position ? position <= ctx.value : false
        if (fixed !== undefined) {
            if (fixed === true || fixed === "active") {
                active = true
            } else if (fixed === "inactive") {
                active = false
            }
        }

        return (
            <div
                ref={ref}
                id={id}
                stepper-item=""
                data-active={active}
                {...props}
                className={cn("stepper-item", className)}
            >
                <div data-active={active} stepper-bar="" {...barProps} className={cn("stepper-bar", barClassName)} />
                {typeof children === "function" ? children(active) : children}
            </div>
        )
    }
)
StepperItem.displayName = "StepperItem"

export { StepperRoot, StepperItem }
