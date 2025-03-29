import React, { useEffect, useRef, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"

import { PatternInput } from "@/shared/ui/Compositions/PatternInput"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof PatternInput> = {
    title: "Components/Compositions/PatternInput",
    component: PatternInput,
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
