import React, { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"

import { Message } from "@/shared/ui/Core/Message"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Message> = {
    title: "Components/Core/Message",
    component: Message,
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
                <Message>{error}</Message>
                <Message status="error">
                    {error} {"<-"} Error
                </Message>
                <Message status="success">
                    {error} {"<-"} Success
                </Message>
                <Message status="warning">
                    {error} {"<-"} Warning
                </Message>
                <Message status="info">
                    {error} {"<-"} Info
                </Message>
            </div>
        )
    },
}
