/* eslint-disable */
// @ts-nocheck

import * as React from "react"
import { Primitive } from "@radix-ui/react-primitive"
import { commandScore } from "./score"
import { useId } from "@/shared/hooks/useId"
import { useScheduleLayoutEffect } from "@/shared/hooks/useScheduleLayoutEffect"
import { mergeRefs } from "@/shared/utils/mergeRefs"
import { useAsRef } from "@/shared/hooks/useAsRef"
import { useLazyRef } from "@/shared/hooks/useLazyRef"

type Children = { children?: React.ReactNode }
type DivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

const defaultFilter: Filter = (value, search, keywords) => commandScore(value, search, keywords)

/*-----------------------------------------------------------------------------------------------*/
/* Selectors */
/*-----------------------------------------------------------------------------------------------*/

const GROUP_SELECTOR = '[selectable-group=""]'
const GROUP_HEADING_SELECTOR = '[selectable-group-heading=""]'
const ITEM_SELECTOR = '[selectable-item=""]'
const VALID_ITEM_SELECTOR = `${ITEM_SELECTOR}:not([data-disabled="true"])`
const SELECT_EVENT = "selectable-item-select"
const VALUE_ATTR = "data-value"

/*-----------------------------------------------------------------------------------------------*/
/* Types */
/*-----------------------------------------------------------------------------------------------*/

type State = {
    search: string
    value: string
    filtered: { count: number; items: Map<string, number>; groups: Set<string> }
}

type Filter = (value: string, search: string, keywords?: string[]) => number

/*-----------------------------------------------------------------------------------------------*/
/* Context */
/*-----------------------------------------------------------------------------------------------*/

type Context = {
    value: (id: string, value: string, keywords?: string[]) => void
    item: (id: string, groupId: string) => () => void
    group: (id: string) => () => void
    filter: () => boolean
    getDisablePointerSelection: () => boolean
    listInnerRef: React.RefObject<HTMLDivElement | null>
    disabled?: boolean
}

type Store = {
    subscribe: (callback: () => void) => () => void
    snapshot: () => State
    setState: <K extends keyof State>(key: K, value: State[K], opts?: any) => void
    emit: () => void
}

type TGroupContext = {
    id: string
    forceMount?: boolean
    ref: React.RefObject<HTMLDivElement>
}

// @ts-ignore
const SelectableContext = React.createContext<Context>(undefined)
export const useSelectableContext = () => React.useContext(SelectableContext)

// @ts-ignore
const StoreContext = React.createContext<Store>(undefined)
const useStore = () => React.useContext(StoreContext)

// @ts-ignore
const GroupContext = React.createContext<TGroupContext>(undefined)
export const useGroupContext = () => React.useContext(GroupContext)

/*-----------------------------------------------------------------------------------------------*/
/* Selectable */
/*-----------------------------------------------------------------------------------------------*/

type CommandProps = Children &
    DivProps & {
        disabled?: boolean
        /**
         * Optionally set to `false` to turn off the automatic filtering and sorting.
         * If `false`, you must conditionally render valid items based on the search query yourself.
         */
        shouldFilter?: boolean
        /**
         * Custom filter function for whether each command menu item should matches the given search query.
         * It should return a number between 0 and 1, with 1 being the best match and 0 being hidden entirely.
         * By default, uses the `command-score` library.
         */
        filter?: Filter
        /**
         * Optional default item value when it is initially rendered.
         */
        defaultValue?: string
        /**
         * Optional controlled state of the selected command menu item.
         */
        value?: string
        /**
         * Event handler called when the selected item of the menu changes.
         */
        onValueChange?: (value: string) => void
        /**
         * Optionally set to `true` to turn on looping around when using the arrow keys.
         */
        loop?: boolean
        /**
         * Optionally set to `true` to disable selection via pointer events.
         */
        disablePointerSelection?: boolean
    }

const Selectable = React.forwardRef<HTMLDivElement, CommandProps>((props, forwardedRef) => {
    const state = useLazyRef<State>(() => ({
        /** Value of the search query. */
        search: "",
        /** Currently selected item value. */
        value: props.value ?? props.defaultValue ?? "",
        filtered: {
            /** The count of all visible items. */
            count: 0,
            /** Map from visible item id to its search score. */
            items: new Map(),
            /** Set of groups with at least one visible item. */
            groups: new Set(),
        },
    }))
    const allItems = useLazyRef<Set<string>>(() => new Set()) // [...itemIds]
    const allGroups = useLazyRef<Map<string, Set<string>>>(() => new Map()) // groupId → [...itemIds]
    const ids = useLazyRef<Map<string, { value: string; keywords?: string[] }>>(() => new Map()) // id → { value, keywords }
    const listeners = useLazyRef<Set<() => void>>(() => new Set()) // [...rerenders]
    const propsRef = useAsRef(props)

    const {
        children,
        value,
        onValueChange,
        filter,
        shouldFilter,
        loop,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        disablePointerSelection = false,
        disabled,
        ...etc
    } = props

    const listInnerRef = React.useRef<HTMLDivElement>(null)

    const schedule = useScheduleLayoutEffect()

    /** Controlled mode `value` handling. */
    useLayoutEffect(() => {
        if (value !== undefined) {
            const v = value.trim()
            state.current.value = v
            store.emit()
        }
    }, [value])

    useLayoutEffect(() => {
        schedule(6, scrollSelectedIntoView)
    }, [])

    const store: Store = React.useMemo(() => {
        return {
            subscribe: (cb) => {
                listeners.current.add(cb)
                return () => listeners.current.delete(cb)
            },
            snapshot: () => {
                return state.current
            },
            setState: (key, value, opts) => {
                if (Object.is(state.current[key], value)) return
                state.current[key] = value

                if (key === "search") {
                    // Filter synchronously before emitting back to children
                    filterItems()
                    sort()
                    schedule(1, selectFirstItem)
                } else if (key === "value") {
                    // opts is a boolean referring to whether it should NOT be scrolled into view
                    if (!opts) {
                        // Scroll the selected item into view
                        schedule(5, scrollSelectedIntoView)
                    }
                    if (propsRef.current?.value !== undefined) {
                        // If controlled, just call the callback instead of updating state internally
                        const newValue = (value ?? "") as string
                        propsRef.current.onValueChange?.(newValue)
                        return
                    }
                }

                // Notify subscribers that state has changed
                store.emit()
            },
            emit: () => {
                listeners.current.forEach((l) => l())
            },
        }
    }, [])

    const context: Context = React.useMemo(
        () => ({
            // Keep id → {value, keywords} mapping up-to-date
            value: (id, value, keywords) => {
                if (value !== ids.current.get(id)?.value) {
                    ids.current.set(id, { value, keywords })
                    state.current.filtered.items.set(id, score(value, keywords))
                    schedule(2, () => {
                        sort()
                        store.emit()
                    })
                }
            },
            // Track item lifecycle (mount, unmount)
            item: (id, groupId) => {
                allItems.current.add(id)

                // Track this item within the group
                if (groupId) {
                    if (!allGroups.current.has(groupId)) {
                        allGroups.current.set(groupId, new Set([id]))
                    } else {
                        allGroups.current.get(groupId)?.add(id)
                    }
                }

                // Batch this, multiple items can mount in one pass
                // and we should not be filtering/sorting/emitting each time
                schedule(3, () => {
                    filterItems()
                    sort()

                    // Could be initial mount, select the first item if none already selected
                    if (!state.current.value) {
                        selectFirstItem()
                    }

                    store.emit()
                })

                return () => {
                    ids.current.delete(id)
                    allItems.current.delete(id)
                    state.current.filtered.items.delete(id)
                    const selectedItem = getSelectedItem()

                    // Batch this, multiple items could be removed in one pass
                    schedule(4, () => {
                        filterItems()

                        // The item removed have been the selected one,
                        // so selection should be moved to the first
                        if (selectedItem?.getAttribute("id") === id) selectFirstItem()

                        store.emit()
                    })
                }
            },
            // Track group lifecycle (mount, unmount)
            group: (id) => {
                if (!allGroups.current.has(id)) {
                    allGroups.current.set(id, new Set())
                }

                return () => {
                    ids.current.delete(id)
                    allGroups.current.delete(id)
                }
            },
            filter: () => propsRef.current.shouldFilter || false,
            getDisablePointerSelection: () => propsRef.current.disablePointerSelection,
            listInnerRef,
            disabled,
        }),
        [disabled]
    )

    function score(value: string, keywords?: string[]) {
        const filter = propsRef.current?.filter ?? defaultFilter
        return value ? filter(value, state.current.search, keywords) : 0
    }

    /** Sorts items by score, and groups by highest item score. */
    function sort() {
        if (
            !state.current.search ||
            // Explicitly false, because true | undefined is the default
            propsRef.current.shouldFilter === false
        ) {
            return
        }

        const scores = state.current.filtered.items

        // Sort the groups
        const groups: [string, number][] = []
        state.current.filtered.groups.forEach((value) => {
            const items = allGroups.current.get(value)

            // Get the maximum score of the group's items
            let max = 0
            items.forEach((item) => {
                const score = scores.get(item)
                max = Math.max(score, max)
            })

            groups.push([value, max])
        })

        // Sort items within groups to bottom
        // Sort items outside of groups
        // Sort groups to bottom (pushes all non-grouped items to the top)
        const listInsertionElement = listInnerRef.current

        // Sort the items
        getValidItems()
            .sort((a, b) => {
                const valueA = a.getAttribute("id")
                const valueB = b.getAttribute("id")
                return (scores.get(valueB) ?? 0) - (scores.get(valueA) ?? 0)
            })
            .forEach((item) => {
                const group = item.closest(GROUP_SELECTOR)

                if (group) {
                    group.appendChild(
                        item.parentElement === group ? item : item.closest(`${GROUP_SELECTOR} > ${ITEM_SELECTOR}`)
                    )
                } else {
                    listInsertionElement.appendChild(
                        item.parentElement === listInsertionElement
                            ? item
                            : item.closest(`${GROUP_SELECTOR} > ${ITEM_SELECTOR}`)
                    )
                }
            })

        groups
            .sort((a, b) => b[1] - a[1])
            .forEach((group) => {
                const element = listInnerRef.current?.querySelector(
                    `${GROUP_SELECTOR}[${VALUE_ATTR}="${encodeURIComponent(group[0])}"]`
                )
                element?.parentElement.appendChild(element)
            })
    }

    function selectFirstItem() {
        const item = getValidItems().find((item) => item.getAttribute("data-disabled") !== "true")
        const value = item?.getAttribute(VALUE_ATTR)
        store.setState("value", value || undefined)
    }

    /** Filters the current items. */
    function filterItems() {
        if (
            !state.current.search ||
            // Explicitly false, because true | undefined is the default
            propsRef.current.shouldFilter === false
        ) {
            state.current.filtered.count = allItems.current.size
            // Do nothing, each item will know to show itself because search is empty
            return
        }

        // Reset the groups
        state.current.filtered.groups = new Set()
        let itemCount = 0

        // Check which items should be included
        for (const id of allItems.current) {
            const value = ids.current.get(id)?.value ?? ""
            const keywords = ids.current.get(id)?.keywords ?? []
            const rank = score(value, keywords)
            state.current.filtered.items.set(id, rank)
            if (rank > 0) itemCount++
        }

        // Check which groups have at least 1 item shown
        for (const [groupId, group] of allGroups.current) {
            for (const itemId of group) {
                if (state.current.filtered.items.get(itemId) > 0) {
                    state.current.filtered.groups.add(groupId)
                    break
                }
            }
        }

        state.current.filtered.count = itemCount
    }

    function scrollSelectedIntoView() {
        const item = getSelectedItem()

        if (item) {
            if (item.parentElement?.firstChild === item) {
                // First item in Group, ensure heading is in view
                item
                    .closest(GROUP_SELECTOR)
                    ?.querySelector(GROUP_HEADING_SELECTOR)
                    ?.scrollIntoView({ block: "nearest" })
            }

            // Ensure the item is always in view
            item.scrollIntoView({ block: "nearest" })
        }
    }

    /** Getters */

    function getSelectedItem() {
        return listInnerRef.current?.querySelector(`${ITEM_SELECTOR}[data-selected="true"]`)
    }

    function getValidItems() {
        return Array.from(listInnerRef.current?.querySelectorAll(VALID_ITEM_SELECTOR) || [])
    }

    /** Setters */

    function updateSelectedToIndex(index: number) {
        const items = getValidItems()
        const item = items[index]
        if (item) store.setState("value", item.getAttribute(VALUE_ATTR))
    }

    function updateSelectedByItem(change: 1 | -1) {
        const selected = getSelectedItem()
        const items = getValidItems()
        const index = items.findIndex((item) => item === selected)

        // Get item at this index
        let newSelected = items[index + change]

        if (propsRef.current?.loop) {
            newSelected =
                index + change < 0
                    ? items[items.length - 1]
                    : index + change === items.length
                      ? items[0]
                      : items[index + change]
        }

        if (newSelected) store.setState("value", newSelected.getAttribute(VALUE_ATTR))
    }

    function updateSelectedByGroup(change: 1 | -1) {
        const selected = getSelectedItem()
        let group = selected?.closest(GROUP_SELECTOR)
        let item: HTMLElement

        while (group && !item) {
            group = change > 0 ? findNextSibling(group, GROUP_SELECTOR) : findPreviousSibling(group, GROUP_SELECTOR)
            item = group?.querySelector(VALID_ITEM_SELECTOR)
        }

        if (item) {
            store.setState("value", item.getAttribute(VALUE_ATTR))
        } else {
            updateSelectedByItem(change)
        }
    }

    const last = () => updateSelectedToIndex(getValidItems().length - 1)

    const next = (e: React.KeyboardEvent) => {
        e.preventDefault()

        if (e.metaKey) {
            // Last item
            last()
        } else if (e.altKey) {
            // Next group
            updateSelectedByGroup(1)
        } else {
            // Next item
            updateSelectedByItem(1)
        }
    }

    const prev = (e: React.KeyboardEvent) => {
        e.preventDefault()

        if (e.metaKey) {
            // First item
            updateSelectedToIndex(0)
        } else if (e.altKey) {
            // Previous group
            updateSelectedByGroup(-1)
        } else {
            // Previous item
            updateSelectedByItem(-1)
        }
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        etc.onKeyDown?.(e)

        if (!e.defaultPrevented) {
            // eslint-disable-next-line default-case
            switch (e.key) {
                case "n":
                case "j": {
                    if (e.ctrlKey) {
                        next(e)
                    }
                    break
                }
                case "ArrowDown": {
                    next(e)
                    break
                }
                case "p":
                case "k": {
                    if (e.ctrlKey) {
                        prev(e)
                    }
                    break
                }
                case "ArrowUp": {
                    prev(e)
                    break
                }
                case "Home": {
                    // First item
                    e.preventDefault()
                    updateSelectedToIndex(0)
                    break
                }
                case "End": {
                    // Last item
                    e.preventDefault()
                    last()
                    break
                }
                case "Enter": {
                    // Check if IME composition is finished before triggering onSelect
                    // This prevents unwanted triggering while user is still inputting text with IME
                    // e.keyCode === 229 is for the Japanese IME and Safari.
                    // isComposing does not work with Japanese IME and Safari combination.
                    if (!e.nativeEvent.isComposing && e.keyCode !== 229) {
                        // Trigger item onSelect
                        e.preventDefault()
                        const item = getSelectedItem()
                        if (item) {
                            const event = new Event(SELECT_EVENT)
                            item.dispatchEvent(event)
                        }
                    }
                }
            }
        }
    }

    return (
        <Primitive.div ref={forwardedRef} tabIndex={-1} {...etc} selectable-root="" onKeyDown={onKeyDown}>
            {SlottableWithNestedChildren(props, (child) => (
                <StoreContext.Provider value={store}>
                    <SelectableContext.Provider value={context}>{child}</SelectableContext.Provider>
                </StoreContext.Provider>
            ))}
        </Primitive.div>
    )
})
Selectable.displayName = "Selectable"

/*-----------------------------------------------------------------------------------------------*/
/* Selectable.List */
/*-----------------------------------------------------------------------------------------------*/

type ListProps = Children & DivProps

/**
 * Contains `Item` and `Group`.
 */
const List = React.forwardRef<HTMLDivElement, ListProps>((props, forwardedRef) => {
    const { children, ...etc } = props

    const context = useSelectableContext()

    return (
        <Primitive.div ref={mergeRefs([forwardedRef, context.listInnerRef])} selectable-list="" role="listbox" {...etc}>
            {SlottableWithNestedChildren(props, (child) => child as any)}
        </Primitive.div>
    )
})
List.displayName = "SelectableList"

/*-----------------------------------------------------------------------------------------------*/
/* Selectable.Group */
/*-----------------------------------------------------------------------------------------------*/

type GroupProps = Children &
    Omit<DivProps, "value"> & {
        /** If no heading is provided, you must provide a value that is unique for this group. */
        value?: string
        /** Whether this group is forcibly rendered regardless of filtering. */
        forceMount?: boolean
    }

/**
 * Group command menu items together with a heading.
 * Grouped items are always shown together.
 */
const Group = React.forwardRef<HTMLDivElement, GroupProps>((props, forwardedRef) => {
    const { children, forceMount, ...etc } = props
    const id = useId(props.id)
    const ref = React.useRef<HTMLDivElement>(null)
    const context = useSelectableContext()
    const render = useSelectable((state) =>
        forceMount ? true : context.filter() === false ? true : !state.search ? true : state.filtered.groups.has(id)
    )

    useLayoutEffect(() => {
        return context.group(id)
    }, [])

    useValue(id, ref, [props.value])

    const contextValue = React.useMemo(() => ({ id, forceMount, ref }), [forceMount])

    return (
        <Primitive.div
            ref={mergeRefs([ref, forwardedRef])}
            {...etc}
            selectable-group=""
            role="presentation"
            hidden={render ? undefined : true}
        >
            {SlottableWithNestedChildren(props, (child) => (
                <GroupContext.Provider value={contextValue}>{child}</GroupContext.Provider>
            ))}
        </Primitive.div>
    )
})
Group.displayName = "SelectableGroup"

/*-----------------------------------------------------------------------------------------------*/
/* Selectable.Heading */
/*-----------------------------------------------------------------------------------------------*/

type HeadingProps = Children & DivProps

const Heading = React.forwardRef<HTMLDivElement, HeadingProps>(({ children, ...props }, forwardedRef) => {
    const group = useGroupContext()
    const headingRef = React.useRef<HTMLDivElement>(null)

    useValue(group.id, group.ref, [children, headingRef])

    return (
        <div ref={mergeRefs([headingRef, forwardedRef])} selectable-group-heading="" aria-hidden {...props}>
            {children}
        </div>
    )
})
Heading.displayName = "SelectableHeading"

/*-----------------------------------------------------------------------------------------------*/
/* Selectable.Item */
/*-----------------------------------------------------------------------------------------------*/

type ItemProps = Children &
    Omit<DivProps, "disabled" | "onSelect" | "value"> & {
        /** Whether this item is currently disabled. */
        disabled?: boolean
        /** Event handler for when this item is selected, either via click or keyboard selection. */
        onSelect?: (value: string) => void
        /**
         * A unique value for this item.
         * If no value is provided, it will be inferred from `children` or the rendered `textContent`. If your `textContent` changes between renders, you _must_ provide a stable, unique `value`.
         */
        value?: string
        /** Optional keywords to match against when filtering. */
        keywords?: string[]
        /** Whether this item is forcibly rendered regardless of filtering. */
        forceMount?: boolean
    }

/**
 * Command menu item. Becomes active on pointer enter or through keyboard navigation.
 * Preferably pass a `value`, otherwise the value will be inferred from `children` or
 * the rendered item's `textContent`.
 */
const Item = React.forwardRef<HTMLDivElement, ItemProps>((props, forwardedRef) => {
    const id = useId(props.id)
    const ref = React.useRef<HTMLDivElement>(null)
    const groupContext = useGroupContext()
    const context = useSelectableContext()
    const propsRef = useAsRef(props)
    const forceMount = propsRef.current?.forceMount ?? groupContext?.forceMount

    useLayoutEffect(() => {
        if (!forceMount) {
            return context.item(id, groupContext?.id)
        }
    }, [forceMount])

    const value = useValue(id, ref, [props.value, props.children, ref], props.keywords)

    const store = useStore()
    const selected = useSelectable((state) => state.value && state.value === value.current)
    const render = useSelectable((state) =>
        forceMount ? true : context.filter() === false ? true : !state.search ? true : state.filtered.items.get(id) > 0
    )

    React.useEffect(() => {
        const element = ref.current
        if (!element || (props.disabled ?? context.disabled)) return
        element.addEventListener(SELECT_EVENT, onSelect)
        return () => element.removeEventListener(SELECT_EVENT, onSelect)
    }, [render, props.onSelect, props.disabled, context.disabled])

    function onSelect() {
        select()
        propsRef.current.onSelect?.(value.current)
    }

    function select() {
        store.setState("value", value.current, true)
    }

    if (!render) return null

    const { disabled: _disabled, value: _, onSelect: __, forceMount: ___, keywords: ____, ...etc } = props
    const disabled = _disabled ?? context.disabled

    return (
        <Primitive.div
            ref={mergeRefs([ref, forwardedRef])}
            id={id}
            selectable-item=""
            role="option"
            data-disabled={Boolean(disabled)}
            data-selected={Boolean(selected)}
            {...etc}
            onPointerMove={disabled || context.getDisablePointerSelection() ? undefined : select}
            onClick={
                disabled
                    ? undefined
                    : (e) => {
                          etc.onClick?.(e)

                          onSelect()
                      }
            }
        >
            {props.children}
        </Primitive.div>
    )
})
Item.displayName = "SelectableItem"

/*-----------------------------------------------------------------------------------------------*/
/* Selectable.Input */
/*-----------------------------------------------------------------------------------------------*/

type InputProps = Omit<React.ComponentPropsWithoutRef<typeof Primitive.input>, "value" | "onChange" | "type"> & {
    /**
     * Optional controlled state for the value of the search input.
     */
    value?: string
    /**
     * Event handler called when the search value changes.
     */
    onValueChange?: (search: string) => void
}

/**
 * Command menu input.
 * All props are forwarded to the underyling `input` element.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>((props, forwardedRef) => {
    const { onValueChange, ...etc } = props
    const isControlled = props.value != null
    const store = useStore()
    const search = useSelectable((state) => state.search)
    const context = useSelectableContext()

    React.useEffect(() => {
        if (props.value != null) {
            store.setState("search", props.value)
        }
    }, [props.value])

    const disabled = props.disabled ?? context.disabled

    return (
        <Primitive.input
            ref={forwardedRef}
            cmdk-input=""
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            role="combobox"
            type="text"
            value={isControlled ? props.value : search}
            onChange={(e) => {
                if (!isControlled) {
                    store.setState("search", e.target.value)
                }

                onValueChange?.(e.target.value)
            }}
            {...etc}
            disabled={disabled}
        />
    )
})
Input.displayName = "SelectableInput"

/*-----------------------------------------------------------------------------------------------*/
/* Selectable.Empty */
/*-----------------------------------------------------------------------------------------------*/

type EmptyProps = Children & DivProps & {}

/**
 * Automatically renders when there are no results for the search query.
 */
const Empty = React.forwardRef<HTMLDivElement, EmptyProps>((props, forwardedRef) => {
    const render = useSelectable((state) => state.filtered.count === 0)

    if (!render) return null
    return <Primitive.div ref={forwardedRef} {...props} cmdk-empty="" role="presentation" />
})
Empty.displayName = "SelectableEmpty"

/*-----------------------------------------------------------------------------------------------*/
/* Selectable.Separator */
/*-----------------------------------------------------------------------------------------------*/

type SeparatorProps = DivProps & {
    /** Whether this separator should always be rendered. Useful if you disable automatic filtering. */
    alwaysRender?: boolean
}

/**
 * A visual and semantic separator between items or groups.
 * Visible when the search query is empty or `alwaysRender` is true, hidden otherwise.
 */
const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>((props, forwardedRef) => {
    const { alwaysRender, ...etc } = props
    const ref = React.useRef<HTMLDivElement>(null)
    const render = useSelectable((state) => !state.search)

    if (!alwaysRender && !render) return null
    return <Primitive.div ref={mergeRefs([ref, forwardedRef])} {...etc} cmdk-separator="" role="separator" />
})

/*-----------------------------------------------------------------------------------------------*/
/* Utilities */

/*-----------------------------------------------------------------------------------------------*/

/** Run a selector against the store state. */
function useSelectable<T = any>(selector: (state: State) => T): T {
    const store = useStore()
    const cb = () => selector(store.snapshot())
    return React.useSyncExternalStore(store.subscribe, cb, cb)
}

function findNextSibling(el: Element, selector: string) {
    let sibling = el.nextElementSibling

    while (sibling) {
        if (sibling.matches(selector)) return sibling
        sibling = sibling.nextElementSibling
    }
}

function findPreviousSibling(el: Element, selector: string) {
    let sibling = el.previousElementSibling

    while (sibling) {
        if (sibling.matches(selector)) return sibling
        sibling = sibling.previousElementSibling
    }
}

const useLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

function useValue(
    id: string,
    ref: React.RefObject<HTMLElement>,
    deps: (string | React.ReactNode | React.RefObject<HTMLElement>)[],
    aliases: string[] = []
) {
    const valueRef = React.useRef<string>()
    const context = useSelectableContext()

    useLayoutEffect(() => {
        const value = (() => {
            for (const part of deps) {
                if (typeof part === "string") {
                    return part.trim()
                }

                if (typeof part === "object" && "current" in part) {
                    if (part.current) {
                        return part.current.textContent?.trim()
                    }
                    return valueRef.current
                }
            }
        })()

        const keywords = aliases.map((alias) => alias.trim())

        context.value(id, value, keywords)
        ref.current?.setAttribute(VALUE_ATTR, value)
        valueRef.current = value
    })

    return valueRef
}

function renderChildren(children: React.ReactElement) {
    const childrenType = children.type as any
    // The children is a component
    if (typeof childrenType === "function") return childrenType(children.props)
    // The children is a component with `forwardRef`
    else if ("render" in childrenType) return childrenType.render(children.props)
    // It's a string, boolean, etc.
    else return children
}

function SlottableWithNestedChildren(
    { asChild, children }: { asChild?: boolean; children?: React.ReactNode },
    render: (child: React.ReactNode) => JSX.Element
) {
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(
            renderChildren(children),
            { ref: (children as any).ref },
            render(children.props.children)
        )
    }
    return render(children)
}

/*-----------------------------------------------------------------------------------------------*/
/* Exports */
/*-----------------------------------------------------------------------------------------------*/

const pkg = Object.assign(Selectable, {
    List,
    Group,
    Heading,
    Item,
    Input,
    Empty,
    Separator,
})

export { useSelectable }
export { pkg as Selectable }
export { defaultFilter }

export { Selectable as SelectableRoot }
export { List as SelectableList }
export { Item as SelectableItem }
export { Input as SelectableInput }
export { Group as SelectableGroup }
export { Heading as SelectableHeading }
export { Empty as SelectableEmpty }
export { Separator as SelectableSeparator }
