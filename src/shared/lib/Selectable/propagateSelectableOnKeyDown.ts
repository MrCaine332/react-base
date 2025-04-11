import * as React from "react"

export function propagateSelectableOnKeyDown(event: React.KeyboardEvent<HTMLDivElement>, element: HTMLDivElement) {
    let shouldPropagate = false

    if (!event.defaultPrevented) {
        // eslint-disable-next-line default-case
        switch (event.key) {
            case "n":
            case "p":
            case "k":
            case "j": {
                if (event.ctrlKey) {
                    shouldPropagate = true
                }
                break
            }
            case "Home":
            case "End":
            case "ArrowUp":
            case "ArrowDown": {
                shouldPropagate = true
                break
            }
            case "Enter": {
                // Check if IME composition is finished before triggering onSelect
                // This prevents unwanted triggering while user is still inputting text with IME
                // e.keyCode === 229 is for the Japanese IME and Safari.
                // isComposing does not work with Japanese IME and Safari combination.
                if (!event.nativeEvent.isComposing && event.keyCode !== 229) {
                    shouldPropagate = true
                }
                break
            }
        }
    }

    if (!shouldPropagate) return

    const clonedEvent = new KeyboardEvent(event.type, {
        bubbles: event.bubbles,
        cancelable: event.cancelable,
        key: event.key,
        code: event.code,
        keyCode: event.keyCode,
        charCode: event.charCode,
        which: event.which,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        metaKey: event.metaKey,
        repeat: event.repeat,
    })

    event.preventDefault()

    element.dispatchEvent(clonedEvent)
}
