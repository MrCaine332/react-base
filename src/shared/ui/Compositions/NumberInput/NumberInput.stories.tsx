import React, { useEffect, useRef, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"

import { BaseNumberInput, NumberInput, NumberInputField } from "@/shared/ui/Compositions/NumberInput/NumberInput"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof NumberInput> = {
    title: "Components/Compositions/NumberInput",
    component: NumberInput,
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
