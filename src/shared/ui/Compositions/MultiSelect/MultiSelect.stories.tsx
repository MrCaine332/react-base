import React, { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"

import { MultiSelect } from "@/shared/ui/Compositions/MultiSelect"
import { SelectOption } from "@/shared/ui/Compositions/Select/types"
import { Button } from "@/shared/ui/Core/Button"

import "@/shared/ui/Compositions/Input/Input.css"
import "@/shared/ui/Compositions/Trigger/Trigger.css"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof MultiSelect> = {
    title: "Components/Compositions/MultiSelect",
    component: MultiSelect,
    argTypes: {},
}
export default meta

type Story = StoryObj<typeof MultiSelect>

const options: SelectOption[] = [
    { value: "value1", label: "Label1Label1" },
    { value: "value2", label: "Label2Label2" },
    { value: "value3", label: "Label3Label3" },
    { value: "value4", label: "Label4Label4" },
    { value: "value5", label: "Label5Label5" },
    { value: "value6", label: "Label6Label6" },
    { value: "value7", label: "Label7Label7" },
    { value: "value8", label: "Label8Label8" },
    { value: "value9", label: "Label9Label9" },
    { value: "value10", label: "Label10Label10" },
    { value: "value11", label: "Label11Label11" },
    { value: "value12", label: "Label12Label12" },
    { value: "value13", label: "Label13Label13" },
    { value: "value14", label: "Label14Label14" },
    { value: "value15", label: "Label15Label15" },
]

export const Demo = {
    render: () => {
        const [open, setOpen] = useState(false)
        const [disabled, setDisabled] = useState(false)
        const [loading, setLoading] = useState(false)

        const [searchable, setSearchable] = useState(false)
        const [shouldFilter, setShouldFilter] = useState(false)

        const [creatable, setCreatable] = useState(false)
        const [forceCreatableMount, setForceCreatableMount] = useState(false)

        const [value, setValue] = useState<SelectOption[]>([])

        const [lastSelected, setLastSelected] = useState<{ option: SelectOption; selected: boolean }>()

        const a = ['1', '2']

        const b = a ?? []

        return (
            <div className="flex flex-col gap-3 items-center pb-20">
                <div className="flex gap-3">
                    <Button className="w-[200px]" onClick={() => setOpen(!open)}>
                        Toggle Open: {open ? "true" : "false"}
                    </Button>
                    <Button className="w-[200px]" onClick={() => setDisabled(!disabled)}>
                        Toggle Disabled: {disabled ? "true" : "false"}
                    </Button>
                    <Button className="w-[200px]" onClick={() => setLoading(!loading)}>
                        Toggle Loading: {loading ? "true" : "false"}
                    </Button>
                </div>
                <div className="flex gap-3">
                    <Button className="w-[200px]" onClick={() => setSearchable(!searchable)}>
                        Searchable: {searchable ? "true" : "false"}
                    </Button>
                    <Button variant="outlined" className="w-[200px]" onClick={() => setShouldFilter(!shouldFilter)}>
                        Auto Filtering: {shouldFilter ? "true" : "false"}
                    </Button>
                </div>
                <div className="flex gap-3">
                    <Button className="w-[200px]" onClick={() => setCreatable(!creatable)}>
                        Creatable: {creatable ? "true" : "false"}
                    </Button>
                    <Button
                        variant="outlined"
                        className="w-[250px]"
                        onClick={() => setForceCreatableMount(!forceCreatableMount)}
                    >
                        Force Creatable Render: {forceCreatableMount ? "true" : "false"}
                    </Button>
                </div>

                <div className="">
                    <h3>Last Selected:</h3>
                    {lastSelected ? (
                        <>
                            <div>Option: {JSON.stringify(lastSelected.option)}</div>
                            <div>Is Selected: {JSON.stringify(lastSelected.selected)}</div>
                        </>
                    ) : (
                        <>
                            <div>Option: Select option first</div>
                            <div>Is Selected: Select option first</div>
                            <div>Index: Select option first</div>
                        </>
                    )}
                </div>

                <MultiSelect
                    open={open}
                    onOpenChange={setOpen}
                    disabled={disabled}
                    loading={loading}
                    className="w-[350px]"
                    value={b}
                    options={options}
                    onValueChange={(v, option, selected) => {
                        setLastSelected({ option, selected })
                        setValue(v)
                    }}
                    searchable={searchable}
                    shouldFilter={shouldFilter}
                    creatable={creatable}
                    forceCreatableMount={forceCreatableMount}
                />
            </div>
        )
    },
}
