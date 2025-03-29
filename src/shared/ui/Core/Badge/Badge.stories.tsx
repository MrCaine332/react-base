import React, { useEffect, useRef } from "react"
import type { Meta, StoryObj } from "@storybook/react"

import { Badge } from "@/shared/ui/Core/Badge"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Badge> = {
    title: "Components/Core/Badge",
    component: Badge,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "secondary", "outlined", "success", "warning", "danger", "plain"],
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
        return <Badge>Badge</Badge>

        // return (
        //     <div className="grid grid-cols-6 gap-x-2 gap-y-5 place-items-center">
        //         <div className="flex gap-4 h-full items-center place-self-end">
        //             Colors
        //             <Separator orientation="vertical" className="h-auto self-stretch" />
        //         </div>
        //         <div>Default</div>
        //         <div>Primary</div>
        //         <div>Danger</div>
        //         <div>Success</div>
        //         <div>Warning</div>
        //         <Separator className="col-span-6" />
        //
        //         <div className="flex gap-4 h-full items-center place-self-end">
        //             Filled
        //             <Separator orientation="vertical" className="h-auto self-stretch" />
        //         </div>
        //         <Badge variant="filled" color="default">
        //             Badge
        //         </Badge>
        //         <Badge variant="filled" color="primary">
        //             Badge
        //         </Badge>
        //         <Badge variant="filled" color="danger">
        //             Badge
        //         </Badge>
        //         <Badge variant="filled" color="success">
        //             Badge
        //         </Badge>
        //         <Badge variant="filled" color="warning">
        //             Badge
        //         </Badge>
        //
        //         <div className="flex gap-4 h-full items-center place-self-end">
        //             Outlined
        //             <Separator orientation="vertical" className="h-auto self-stretch" />
        //         </div>
        //         <Badge variant="outlined" color="default">
        //             Badge
        //         </Badge>
        //         <Badge variant="outlined" color="primary">
        //             Badge
        //         </Badge>
        //         <Badge variant="outlined" color="danger">
        //             Badge
        //         </Badge>
        //         <Badge variant="outlined" color="success">
        //             Badge
        //         </Badge>
        //         <Badge variant="outlined" color="warning">
        //             Badge
        //         </Badge>
        //
        //         <div className="flex gap-4 h-full items-center place-self-end">
        //             Filled-Outlined
        //             <Separator orientation="vertical" className="h-auto self-stretch" />
        //         </div>
        //         <Badge variant="filled-outlined" color="default">
        //             Badge
        //         </Badge>
        //         <Badge variant="filled-outlined" color="primary">
        //             Badge
        //         </Badge>
        //         <Badge variant="filled-outlined" color="danger">
        //             Badge
        //         </Badge>
        //         <Badge variant="filled-outlined" color="success">
        //             Badge
        //         </Badge>
        //         <Badge variant="filled-outlined" color="warning">
        //             Badge
        //         </Badge>
        //
        //         <div className="flex gap-4 h-full items-center place-self-end">
        //             Soft
        //             <Separator orientation="vertical" className="h-auto self-stretch" />
        //         </div>
        //         <Badge variant="soft" color="default">
        //             Badge
        //         </Badge>
        //         <Badge variant="soft" color="primary">
        //             Badge
        //         </Badge>
        //         <Badge variant="soft" color="danger">
        //             Badge
        //         </Badge>
        //         <Badge variant="soft" color="success">
        //             Badge
        //         </Badge>
        //         <Badge variant="soft" color="warning">
        //             Badge
        //         </Badge>
        //
        //         <div className="flex gap-4 h-full items-center place-self-end">
        //             Text
        //             <Separator orientation="vertical" className="h-auto self-stretch" />
        //         </div>
        //         <Badge variant="text" color="default">
        //             Badge
        //         </Badge>
        //         <Badge variant="text" color="primary">
        //             Badge
        //         </Badge>
        //         <Badge variant="text" color="danger">
        //             Badge
        //         </Badge>
        //         <Badge variant="text" color="success">
        //             Badge
        //         </Badge>
        //         <Badge variant="text" color="warning">
        //             Badge
        //         </Badge>
        //     </div>
        // )
    },
}
