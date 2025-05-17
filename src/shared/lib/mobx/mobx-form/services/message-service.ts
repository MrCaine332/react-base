import { makeAutoObservable } from "mobx"

export type MessageLevel = "error" | "warning" | "success" | "info"

export interface Message {
    id: string
    text: string
    level: MessageLevel
    source?: string // Optional source identifier (e.g., "validation", "api", etc.)
}

/**
 * MessageService handles different levels of messages for form fields
 * It supports error, warning, success, and info message levels
 */
export class MessageService {
    private readonly _levelPriority: Record<MessageLevel, number> = {
        error: 3,
        warning: 2,
        success: 1,
        info: 0,
    }
    private _messages: Message[] = []

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    /* -----------------------------------------------------------------------------------------------
     * Message Collections
     * ----------------------------------------------------------------------------------------------- */

    /**
     * Get all messages
     */

    get all(): Message[] {
        return this._messages
    }

    /**
     * Get all messages of a specific level
     */
    private getMessagesByLevel(level: MessageLevel): Message[] {
        return this._messages.filter((message) => message.level === level)
    }

    /**
     * Get all error messages
     */
    get errors(): Message[] {
        return this.getMessagesByLevel("error")
    }

    /**
     * Get all warning messages
     */
    get warnings(): Message[] {
        return this.getMessagesByLevel("warning")
    }

    /**
     * Get all success messages
     */
    get successes(): Message[] {
        return this.getMessagesByLevel("success")
    }

    /**
     * Get all info messages
     */
    get infos(): Message[] {
        return this.getMessagesByLevel("info")
    }

    /* -----------------------------------------------------------------------------------------------
     * First Message Getters
     * ----------------------------------------------------------------------------------------------- */

    /**
     * Get the first message by the level priority
     * 1st error, if no errors then 1st warning, etc
     */
    get top(): Message | undefined {
        if (this._messages.length === 0) return undefined
        if (this._messages.length === 1) return this._messages[0]

        let top: Message | undefined

        for (const message of this._messages) {
            /* Return first error as it is top-level message */
            if (message.level === "error") return message

            if (!top || this._levelPriority[message.level] > this._levelPriority[top.level]) {
                top = message
            }
        }

        return top
    }

    /**
     * Get all messages of a specific level
     */
    private getFirstMessageByLevel(level: MessageLevel): Message | undefined {
        return this._messages.find((message) => message.level === level)
    }

    /**
     * Get the first error message text or undefined if none exists
     */
    get error(): Message | undefined {
        return this.getFirstMessageByLevel("error")
    }

    /**
     * Get the first warning message text or undefined if none exists
     */
    get warning(): Message | undefined {
        return this.getFirstMessageByLevel("warning")
    }

    /**
     * Get the first success message text or undefined if none exists
     */
    get success(): Message | undefined {
        return this.getFirstMessageByLevel("success")
    }

    /**
     * Get the first info message text or undefined if none exists
     */
    get info(): Message | undefined {
        return this.getFirstMessageByLevel("info")
    }

    /* -----------------------------------------------------------------------------------------------
     * Message Management
     * ----------------------------------------------------------------------------------------------- */

    /**
     * Add a new message
     * @param text The message text
     * @param level The message level (error, warning, success, info)
     * @param source Optional source identifier
     * @returns The ID of the added message
     */
    add(text: string, level: MessageLevel, source?: string): string {
        const id = this.generateMessageId()
        const message: Message = { id, text, level, source }
        this._messages.push(message)
        return id
    }

    /**
     * Add an error message
     * @param text The error message text
     * @param source Optional source identifier
     * @returns The ID of the added message
     */
    addError(text: string, source?: string): string {
        return this.add(text, "error", source)
    }

    /**
     * Add a warning message
     * @param text The warning message text
     * @param source Optional source identifier
     * @returns The ID of the added message
     */
    addWarning(text: string, source?: string): string {
        return this.add(text, "warning", source)
    }

    /**
     * Add a success message
     * @param text The success message text
     * @param source Optional source identifier
     * @returns The ID of the added message
     */
    addSuccess(text: string, source?: string): string {
        return this.add(text, "success", source)
    }

    /**
     * Add an info message
     * @param text The info message text
     * @param source Optional source identifier
     * @returns The ID of the added message
     */
    addInfo(text: string, source?: string): string {
        return this.add(text, "info", source)
    }

    /**
     * Remove a message by its ID
     * @param id The ID of the message to remove
     */
    removeById(id: string) {
        this._messages = this._messages.filter((message) => message.id !== id)
    }

    /**
     * Remove a message by index. If level is provided, will search index only among messages of that level
     * Ex: removeByIndex(0, "error") will remove the first error message
     * @param index The index of the message to remove
     * @param level The level of the message to search index for
     */
    removeByIndex(index: number, level?: MessageLevel) {
        let i = -1
        this._messages = this._messages.filter((message) => {
            if (!level) i++
            if (level && message.level === level) i++
            return index !== i
        })
    }

    /**
     * Remove all messages of a specific level
     * @param level The level of messages to remove
     * @returns The number of messages removed
     */
    removeAllByLevel(level: MessageLevel): number {
        const initialLength = this._messages.length
        this._messages = this._messages.filter((message) => message.level !== level)
        return initialLength - this._messages.length
    }

    /**
     * Remove all messages from a specific source
     * @param source The source of messages to remove
     * @returns The number of messages removed
     */
    removeAllBySource(source: string): number {
        const initialLength = this._messages.length
        this._messages = this._messages.filter((message) => message.source !== source)
        return initialLength - this._messages.length
    }

    /**
     * Remove all error messages
     * @returns The number of messages removed
     */
    clearErrors(): number {
        return this.removeAllByLevel("error")
    }

    /**
     * Remove all warning messages
     * @returns The number of messages removed
     */
    clearWarnings(): number {
        return this.removeAllByLevel("warning")
    }

    /**
     * Remove all success messages
     * @returns The number of messages removed
     */
    clearSuccesses(): number {
        return this.removeAllByLevel("success")
    }

    /**
     * Remove all info messages
     * @returns The number of messages removed
     */
    clearInfos(): number {
        return this.removeAllByLevel("info")
    }

    /**
     * Remove all messages
     */
    clear(): void {
        this._messages = []
    }

    /**
     * Check if there are any messages
     */
    get hasAny(): boolean {
        return this._messages.length > 0
    }

    /**
     * Check if there are any error messages
     */
    get hasErrors(): boolean {
        return this.errors.length > 0
    }

    /**
     * Check if there are any warning messages
     */
    get hasWarnings(): boolean {
        return this.warnings.length > 0
    }

    /**
     * Check if there are any success messages
     */
    get hasSuccesses(): boolean {
        return this.successes.length > 0
    }

    /**
     * Check if there are any info messages
     */
    get hasInfos(): boolean {
        return this.infos.length > 0
    }

    /**
     * Generate a unique message ID
     */
    private generateMessageId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substring(2)
    }
}
