import React, { useEffect, useRef } from "react"
import type { Meta, StoryObj } from "@storybook/react"

import { Field } from "@/shared/ui/Core/Field"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Field> = {
    title: "Components/Core/Field",
    component: Field,
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

        return <Field />
    },
}
