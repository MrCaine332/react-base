import React, { useEffect, useRef } from "react"
import type { Meta, StoryObj } from "@storybook/react"

import { Button, ButtonRoot } from "@/shared/ui/Core/Button"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Button> = {
    title: "Components/Core/Button",
    component: Button,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "secondary", "link", "ghost", "danger", "plain", "trigger"],
        },
        className: { control: "text" },
    },
    args: {
        children: "Button",
    },
}

export default meta
type Story = StoryObj<typeof meta>

export const Demo = {
    render: () => {

        // return (
        //     <div className="grid grid-cols-7 gap-x-2 gap-y-5 place-items-center">
        //         <div className="flex gap-4 h-full items-center place-self-end">
        //             Colors
        //             <Separator orientation="vertical" className="h-auto self-stretch" />
        //         </div>
        //         <div>Default</div>
        //         <div>Primary</div>
        //         <div>Danger</div>
        //         <div>Success</div>
        //         <div>Warning</div>
        //         <div>Neutral</div>
        //         <Separator className="col-span-7" />
        //
        //         <div className="flex gap-4 h-full items-center place-self-end">
        //             Filled
        //             <Separator orientation="vertical" className="h-auto self-stretch" />
        //         </div>
        //         <Button variant="filled" color="default">
        //             Button
        //         </Button>
        //         <Button variant="filled" color="primary">
        //             Button
        //         </Button>
        //         <Button variant="filled" color="danger">
        //             Button
        //         </Button>
        //         <Button variant="filled" color="success">
        //             Button
        //         </Button>
        //         <Button variant="filled" color="warning">
        //             Button
        //         </Button>
        //         <Button variant="filled" color="neutral">
        //             Button
        //         </Button>
        //
        //         <div className="flex gap-4 h-full items-center place-self-end">
        //             Outlined
        //             <Separator orientation="vertical" className="h-auto self-stretch" />
        //         </div>
        //         <Button variant="outlined" color="default">
        //             Button
        //         </Button>
        //         <Button variant="outlined" color="primary">
        //             Button
        //         </Button>
        //         <Button variant="outlined" color="danger">
        //             Button
        //         </Button>
        //         <Button variant="outlined" color="success">
        //             Button
        //         </Button>
        //         <Button variant="outlined" color="warning">
        //             Button
        //         </Button>
        //         <Button variant="outlined" color="neutral">
        //             Button
        //         </Button>
        //
        //         <div className="flex gap-4 h-full items-center place-self-end">
        //             Filled-Outlined
        //             <Separator orientation="vertical" className="h-auto self-stretch" />
        //         </div>
        //         <Button variant="filled-outlined" color="default">
        //             Button
        //         </Button>
        //         <Button variant="filled-outlined" color="primary">
        //             Button
        //         </Button>
        //         <Button variant="filled-outlined" color="danger">
        //             Button
        //         </Button>
        //         <Button variant="filled-outlined" color="success">
        //             Button
        //         </Button>
        //         <Button variant="filled-outlined" color="warning">
        //             Button
        //         </Button>
        //         <Button variant="filled-outlined" color="neutral">
        //             Button
        //         </Button>
        //
        //         <div className="flex gap-4 h-full items-center place-self-end">
        //             Soft
        //             <Separator orientation="vertical" className="h-auto self-stretch" />
        //         </div>
        //         <Button variant="soft" color="default">
        //             Button
        //         </Button>
        //         <Button variant="soft" color="primary">
        //             Button
        //         </Button>
        //         <Button variant="soft" color="danger">
        //             Button
        //         </Button>
        //         <Button variant="soft" color="success">
        //             Button
        //         </Button>
        //         <Button variant="soft" color="warning">
        //             Button
        //         </Button>
        //         <Button variant="soft" color="neutral">
        //             Button
        //         </Button>
        //
        //         <div className="flex gap-4 h-full items-center place-self-end">
        //             Link
        //             <Separator orientation="vertical" className="h-auto self-stretch" />
        //         </div>
        //         <Button variant="link" color="default">
        //             Button
        //         </Button>
        //         <Button variant="link" color="primary">
        //             Button
        //         </Button>
        //         <Button variant="link" color="danger">
        //             Button
        //         </Button>
        //         <Button variant="link" color="success">
        //             Button
        //         </Button>
        //         <Button variant="link" color="warning">
        //             Button
        //         </Button>
        //         <Button variant="link" color="neutral">
        //             Button
        //         </Button>
        //
        //         <div className="flex gap-4 h-full items-center place-self-end">
        //             Ghost
        //             <Separator orientation="vertical" className="h-auto self-stretch" />
        //         </div>
        //         <Button variant="ghost" color="default">
        //             Button
        //         </Button>
        //         <Button variant="ghost" color="primary">
        //             Button
        //         </Button>
        //         <Button variant="ghost" color="danger">
        //             Button
        //         </Button>
        //         <Button variant="ghost" color="success">
        //             Button
        //         </Button>
        //         <Button variant="ghost" color="warning">
        //             Button
        //         </Button>
        //         <Button variant="ghost" color="neutral">
        //             Button
        //         </Button>
        //
        //         <div className="flex gap-4 h-full items-center place-self-end">
        //             Unstyled
        //             <Separator orientation="vertical" className="h-auto self-stretch" />
        //         </div>
        //         <div className="col-span-6 place-self-start">
        //             <Button variant="unstyled">Button</Button>
        //         </div>
        //     </div>
        // )
    },
}
