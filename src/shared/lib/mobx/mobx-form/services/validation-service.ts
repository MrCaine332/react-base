import { makeAutoObservable, runInAction } from "mobx"
import { MessageService, MessageLevel } from "@/shared/lib/mobx/mobx-form/services/message-service"

export type ValidationResult = string | undefined | null | void | { level: MessageLevel; message: string }

export type ValidationContext = Record<string, any>

export type ValidatorFn<T> = (value: T, context?: ValidationContext) => ValidationResult | Promise<ValidationResult>

export type ConditionalValidator<T> = {
    validator: ValidatorFn<T>
    when: (value: T, context?: ValidationContext) => boolean
}

export type Validator<T> = ValidatorFn<T> | ConditionalValidator<T>

export type ValidationStrategy = "sync" | "async" | "race"

export type ValidationTrigger = "blur" | "change" | "submit" | "all"

export type ValidationCleanupTarget = MessageLevel | "all"

/**
 * A transform function that prepares a value for validation without modifying the original
 * This is important for MobX observables to prevent unintended mutations
 */
export type ValidationTransform<Value, TransformedValue = Value> = (value: Value) => TransformedValue

export interface ValidationOptions<Value, TransformedValue = Value> {
    /**
     * Validation function or array of validation functions
     */
    validate?: Validator<TransformedValue> | Validator<TransformedValue>[]

    /**
     * Validation strategy:
     * - sync: Run validators in sequence, stop on first error
     * - async: Run all validators in parallel
     * - race: Run all validators in parallel, use the first result
     * @default "async"
     */
    validationStrategy?: ValidationStrategy

    /**
     * When to trigger validation
     * @default ["all"]
     */
    validateOn?: ValidationTrigger[]

    /**
     * Which message types to clear before validation
     * @default ["error"]
     */
    cleanupBeforeValidation?: ValidationCleanupTarget[]

    /**
     * Transform function to prepare the value for validation
     * IMPORTANT: This should NOT modify the original value, only return a new value
     * for validation purposes. The original value remains unchanged.
     */
    validationTransform?: ValidationTransform<Value, TransformedValue>

    /**
     * Additional context to pass to validators
     * This can be used to access other field values or form state
     */
    validationContext?: ValidationContext
}

/**
 * ValidationService handles field validation
 * It works with MessageService to manage validation messages
 */
export class ValidationService<Value, TransformedValue = Value> {
    private _isValidating = false
    private _lastValidationId = 0
    private _options: ValidationOptions<Value, TransformedValue> = {
        validationStrategy: "async",
        validateOn: ["all"],
        cleanupBeforeValidation: ["error"],
    }

    constructor(readonly messages: MessageService) {
        makeAutoObservable(this, { messages: false }, { autoBind: true })
    }

    /**
     * Configure validation options
     */
    configure(options: ValidationOptions<Value, TransformedValue>) {
        this._options = { ...this._options, ...options }
    }

    /**
     * Get validation options
     */
    get options(): ValidationOptions<Value, TransformedValue> {
        return this._options
    }

    /**
     * Check if validation is currently in progress
     */
    get isValidating(): boolean {
        return this._isValidating
    }

    /**
     * Check if validation should be triggered for a specific event
     */
    shouldValidateOn(trigger: ValidationTrigger): boolean {
        return this._options.validateOn?.includes("all") || this._options.validateOn?.includes(trigger) || false
    }

    /**
     * Clean up messages before validation based on configuration
     */
    private cleanupBeforeValidation() {
        const targets = this._options.cleanupBeforeValidation || ["error"]

        if (targets.includes("all")) {
            this.messages.clear()
            return
        }

        targets.forEach((level) => {
            if (level !== "all") {
                this.messages.removeAllByLevel(level)
            }
        })
    }

    /**
     * Process a validation result and update messages
     */
    private processValidationResult(result: ValidationResult, source = "validation"): boolean {
        if (result === undefined || result === null) {
            return true // Valid
        }

        if (typeof result === "string") {
            if (result) {
                this.messages.add(result, "error", source)
                return false // Invalid
            }
            return true // Valid (empty string)
        }

        if (typeof result === "object") {
            this.messages.add(result.message, result.level, source)
            return result.level !== "error" // Only errors make it invalid
        }

        return true // Valid
    }

    /**
     * Safely transform a value for validation without modifying the original
     * @param value The original value
     * @returns The transformed value for validation, or the original if no transform
     */
    private transformValue(value: Value): any {
        if (!this._options.validationTransform) {
            return value
        }

        try {
            // Create a shallow copy to avoid modifying the original
            // For complex objects, consider using a deep clone library
            return this._options.validationTransform(value)
        } catch (error) {
            console.error("Error in validation transform:", error)
            return value
        }
    }

    /**
     * Get the current validation context
     */
    private getValidationContext(): ValidationContext {
        return this._options.validationContext || {}
    }

    /**
     * Normalize validator to handle both direct functions and conditional validators
     */
    private normalizeValidator(
        validator: Validator<TransformedValue>
    ): (value: any, context: ValidationContext) => Promise<ValidationResult> {
        if (typeof validator === "function") {
            return async (value: any, context: ValidationContext) => validator(value, context)
        }

        return async (value: any, context: ValidationContext) => {
            if (validator.when(value, context)) {
                return validator.validator(value, context)
            }
            return undefined
        }
    }

    /**
     * Run validation using the sync strategy
     * Validators are executed in sequence, stopping on first error
     */
    private async runSyncValidation(
        value: any,
        validators: Validator<TransformedValue>[],
        context: ValidationContext
    ): Promise<boolean> {
        let isValid = true

        for (const validator of validators) {
            const normalizedValidator = this.normalizeValidator(validator)
            // eslint-disable-next-line no-await-in-loop
            const result = await normalizedValidator(value, context)

            const resultValid = this.processValidationResult(result)
            if (!resultValid) {
                isValid = false
                break // Stop on first error
            }
        }

        return isValid
    }

    /**
     * Run validation using the async strategy
     * All validators are executed in parallel
     */
    private async runAsyncValidation(
        value: any,
        validators: Validator<TransformedValue>[],
        context: ValidationContext
    ): Promise<boolean> {
        const normalizedValidators = validators.map((v) => this.normalizeValidator(v))

        const results = await Promise.all(normalizedValidators.map((validator) => validator(value, context)))

        let isValid = true
        for (const result of results) {
            const resultValid = this.processValidationResult(result)
            if (!resultValid) {
                isValid = false
                // Don't break, process all results
            }
        }

        return isValid
    }

    /**
     * Run validation using the race strategy
     * Use the first validator that completes
     */
    private async runRaceValidation(
        value: any,
        validators: Validator<TransformedValue>[],
        context: ValidationContext
    ): Promise<boolean> {
        if (validators.length === 0) {
            return true
        }

        const normalizedValidators = validators.map((v) => this.normalizeValidator(v))

        const result = await Promise.race(normalizedValidators.map((validator) => validator(value, context)))

        return this.processValidationResult(result)
    }

    /**
     * Update the validation context
     * @param context Additional context to merge with existing context
     */
    updateContext(context: ValidationContext): void {
        this._options.validationContext = { ...this._options.validationContext, ...context }
    }

    /**
     * Validate a value using the configured strategy
     * @param value The value to validate
     * @param trigger The event that triggered validation
     * @param additionalContext Optional additional context for this validation run
     * @returns Promise resolving to true if valid, false if invalid
     */
    async validate(
        value: Value,
        // eslint-disable-next-line default-param-last
        trigger: ValidationTrigger = "all",
        additionalContext?: ValidationContext
    ): Promise<boolean> {
        // Check if we should validate for this trigger
        if (!this.shouldValidateOn(trigger)) {
            return true
        }

        // Generate a unique ID for this validation run to handle race conditions
        const validationId = ++this._lastValidationId

        runInAction(() => {
            this._isValidating = true
        })

        try {
            // Clean up messages based on configuration
            this.cleanupBeforeValidation()

            // Get validators
            const validators = Array.isArray(this._options.validate)
                ? this._options.validate
                : this._options.validate
                  ? [this._options.validate]
                  : []

            if (validators.length === 0) {
                return true
            }

            // Transform the value (safely)
            const transformedValue = this.transformValue(value)

            // Prepare context
            const context = {
                ...this.getValidationContext(),
                ...additionalContext,
                trigger, // Include the trigger in the context
            }

            // Run validation with the appropriate strategy
            let isValid: boolean

            switch (this._options.validationStrategy) {
                case "sync":
                    isValid = await this.runSyncValidation(transformedValue, validators, context)
                    break
                case "race":
                    isValid = await this.runRaceValidation(transformedValue, validators, context)
                    break
                case "async":
                default:
                    isValid = await this.runAsyncValidation(transformedValue, validators, context)
                    break
            }

            // If this validation run has been superseded by a newer one, discard the result
            if (validationId !== this._lastValidationId) {
                return true
            }

            return isValid
        } finally {
            // Only update state if this is still the current validation
            if (validationId === this._lastValidationId) {
                runInAction(() => {
                    this._isValidating = false
                })
            }
        }
    }
}
