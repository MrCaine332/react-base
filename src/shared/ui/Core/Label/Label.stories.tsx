import React from "react"
import type { Meta, StoryObj } from "@storybook/react"

import { Label } from "@/shared/ui/Core/Label"
// import { Checkbox } from '@/shared/ui/Primitives/Checkbox'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Label> = {
    title: "Components/Core/Label",
    component: Label,
    parameters: {
        layout: "centered",
    },
    argTypes: {},
    args: {},
}

export default meta
type Story = StoryObj<typeof meta>

export const Demo = {
    render: () => (
        <div className="flex items-center gap-5">
            <div className="space-y-3">
                <div className="text-sm font-semibold">Default</div>
                <div className="flex items-center gap-2">
                    {/*<Checkbox id="terms" />*/}
                    <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
            </div>

            <div className="space-y-3">
                <div className="text-sm font-semibold">Disabled</div>
                <div className="flex items-center gap-2">
                    {/*<Checkbox id="terms" disabled />*/}
                    <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
            </div>
        </div>
    ),
}
