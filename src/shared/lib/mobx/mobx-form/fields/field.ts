import { makeAutoObservable } from "mobx"
import { MessageService } from "@/shared/lib/mobx/mobx-form/services/message-service"

type Options<T> = {
    validate?: (value: T) => string | undefined | void
}

export class Field<T> {
    readonly initialValue: T
    readonly messages: MessageService

    constructor(
        value: T,
        private readonly options?: Options<T>
    ) {
        makeAutoObservable(
            this,
            {
                messages: false, // Already observable
            },
            { autoBind: true }
        )

        this.initialValue = value
        this._value = value
        this.messages = new MessageService()
    }

    /* -----------------------------------------------------------------------------------------------
     * Value
     * ----------------------------------------------------------------------------------------------- */

    private _value: T

    get value() {
        return this._value
    }

    set value(value: T) {
        this._value = value
    }

    /* -----------------------------------------------------------------------------------------------
     * Events
     * ----------------------------------------------------------------------------------------------- */

    onChange(value: T) {
        this.value = value
    }

    /* -----------------------------------------------------------------------------------------------
     * Cloner
     * ----------------------------------------------------------------------------------------------- */

    clone() {
        return new Field(this.value, this.options)
    }
}
