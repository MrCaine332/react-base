import React, { useEffect, useRef, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"

import { Description } from "@/shared/ui/Core/Description"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Description> = {
    title: "Components/Core/Description",
    component: Description,
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
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [error, setError] = useState<string | boolean | null | undefined>("Lorem ipsum dolor sit amet.")

        return (
            <div className="flex flex-col gap-4">
                <Description>{error}</Description>
            </div>
        )
    },
}
