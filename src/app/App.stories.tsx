import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "@/shared/ui/Core/Button"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import { ValidationService } from "@/shared/lib/mobx/mobx-form/services/validation-service"
import { MessageService } from "@/shared/lib/mobx/mobx-form/services/message-service"

const meta: Meta = {
    title: "App",
    parameters: {
        layout: "centered",
    },
    argTypes: {},
    args: {},
}

export default meta

type Story = StoryObj<typeof meta>

// ==================================================================
// ==================================================================

// const schema = z.string({ message: "Name is required" }).min(1)
// const schema2 = z.object({
//     name: z.string().min(1),
//     name2: z.string().min(1),
// })
//
// const isZodError = (error: any): error is ZodError => Array.isArray(error?.errors)
//
// function parseErrorSchema(zodErrors: z.ZodIssue[]) {
//     const errors: Record<string, FieldError> = {}
//     for (; zodErrors.length; ) {
//         const error = zodErrors[0]
//         const { code, message, path } = error
//         const _path = path.join(".")
//
//         if (!errors[_path]) {
//             if ("unionErrors" in error) {
//                 const unionError = error.unionErrors[0].errors[0]
//
//                 errors[_path] = {
//                     message: unionError.message,
//                     type: unionError.code,
//                 }
//             } else {
//                 errors[_path] = { message, type: code }
//             }
//         }
//
//         if ("unionErrors" in error) {
//             error.unionErrors.forEach((unionError) => unionError.errors.forEach((e) => zodErrors.push(e)))
//         }
//
//         zodErrors.shift()
//     }
//
//     return errors
// }
//
// const zodResolver = <T,>(schema: z.ZodSchema) => {
//     return (value: T) => {
//         try {
//             const result = schema.parse(value)
//             console.log("result", result)
//         } catch (error) {
//             if (isZodError(error)) {
//                 return {
//                     values: {},
//                     errors: parseErrorSchema(error.errors),
//                 }
//             }
//
//             throw error
//         }
//     }
// }
//
// console.log(zodResolver(schema2)({ name: "", name2: "" }))

// class TestForm {
//     toggled = false
//
//     field = new Field(0, {
//         validate: zodResolver(schema),
//     })
//
//     form = new FormGroup({}, {})
//
//     constructor() {
//         makeAutoObservable(this, {}, { autoBind: true })
//     }
//
//     click() {
//         this.field.clone()
//     }
//
//     toggle() {
//         this.toggled = !this.toggled
//         console.log("Toggled:", this.toggled)
//     }
// }
//
// const instance = new TestForm()

class TestClass {
    field = {
        property: 1,
    }

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }
}

const ins = new TestClass()

export const Demo = {
    render: () => {
        const Comp = observer(() => {
            // Access the field's options to show they're updating
            // const validationResult = instance.field.options.validate?.(instance.field.value)

            // console.log(instance.field.options)

            const test = () => {
                const val = ins.field
                val.property += 1
            }

            return (
                <div className="flex flex-col gap-5">
                    <div>{ins.field.property}</div>
                    <Button onClick={test}>Increment</Button>
                </div>
            )
        })

        return <Comp />
    },
}

const m = new MessageService()
const s = new ValidationService<string, null>(m)
s.configure({
    validationTransform: (v) => null,
    validate: (value, context) => {
        return null
    }
})
