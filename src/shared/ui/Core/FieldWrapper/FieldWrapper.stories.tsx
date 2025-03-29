import React, { useEffect, useRef } from "react"
import type { Meta, StoryObj } from "@storybook/react"

import { FieldWrapper } from "@/shared/ui/Core/FieldWrapper"
import { AddonClear } from "@/shared/ui/Core/AddonBox/addons"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof FieldWrapper> = {
    title: "Components/Core/FieldWrapper",
    component: FieldWrapper,
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

    },
}
