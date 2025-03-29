import React, { useEffect, useRef } from "react"
import type { Meta, StoryObj } from "@storybook/react"

import { AddonBox } from "@/shared/ui/Core/AddonBox"
import { AddonClear } from "@/shared/ui/Core/AddonBox/addons"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof AddonBox> = {
    title: "Components/Core/AddonBox",
    component: AddonBox,
    parameters: {
        layout: "centered",
    },
    argTypes: {},
    args: {},
}

export default meta
type Story = StoryObj<typeof meta>

export const Demo = {
    render: () => {
        return (
            <div className="flex flex-col gap-5">
                <div className="flex gap-2 items-center">
                    <AddonBox
                        className="h-9 border border-border rounded-md"
                        addonBefore={<AddonClear />}
                        addonAfter={<AddonClear />}
                    >
                        <div className="bg-red-100 w-[200px]"></div>
                    </AddonBox>
                </div>
            </div>
        )
    },
}
