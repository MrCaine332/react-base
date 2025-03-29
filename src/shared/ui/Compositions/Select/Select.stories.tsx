import React, { useRef, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"

import { SelectContent } from "@/shared/ui/Compositions/Select/SelectContent"
import { SelectOption } from "@/shared/ui/Compositions/Select/types"
import "../Input/Input.css"
import { SelectableItem } from "@/shared/ui/Primitives/Selectable"
import { Select } from "@/shared/ui/Compositions/Select/Select"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta = {
    title: "Components/Compositions/Select",
    parameters: {
        layout: "centered",
    },
    argTypes: {},
    args: {},
}

export default meta
type Story = StoryObj<typeof meta>

type Context = {
    field: string
}

const options: SelectOption<{ field: string }>[] = [
    { value: "value1", label: "Label1", context: { field: "field1" } },
    { value: "value2", label: "Label2", context: { field: "field2" } },
    { value: "value3", label: "Label3", context: { field: "field3" } },
    { value: "value4", label: "Label4", context: { field: "field4" } },
    { value: "value5", label: "Label5", context: { field: "field5" } },
    { value: "value6", label: "Label6", context: { field: "field6" } },
    { value: "value7", label: "Label7", context: { field: "field7" } },
    { value: "value8", label: "Label8", context: { field: "field8" } },
    { value: "value9", label: "Label9", context: { field: "field9" } },
    { value: "value10", label: "Label10", context: { field: "field10" } },
    { value: "value11", label: "Label11", context: { field: "field11" } },
    { value: "value12", label: "Label12", context: { field: "field12" } },
    { value: "value13", label: "Label13", context: { field: "field13" } },
    { value: "value14", label: "Label14", context: { field: "field14" } },
    { value: "value15", label: "Label15", context: { field: "field15" } },
    { value: "value16", label: "Label16", context: { field: "field16" } },
    { value: "value17", label: "Label17", context: { field: "field17" } },
    { value: "value18", label: "Label18", context: { field: "field18" } },
]

export const Demo = {
    render: () => {
        const ref = useRef(null)

        React.useEffect(() => {
            const interval = setInterval(() => {
                console.log(ref)
            }, 1000)

            return () => {
                clearInterval(interval)
            }
        }, [])

        const [search, setSearch] = useState("12")

        return (
            <div className="flex items-center space-x-2 pb-20">
                <Select options={options} className="w-[200px]" placeholder="Bibaboba" />
            </div>
        )
    },
}
