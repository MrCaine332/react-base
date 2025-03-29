import React, { useEffect, useRef, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"

import { BaseInput, Input, InputField } from "@/shared/ui/Compositions/Input"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Input> = {
    title: "Components/Compositions/Input",
    component: Input,
    parameters: {
        layout: "centered",
    },
    argTypes: {},
    args: {},
}

export default meta
type Story = StoryObj<typeof meta>

export const Demo = {
    render: () => {},
}
