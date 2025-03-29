import React from "react"
import type { Meta, StoryObj } from "@storybook/react"

import { Trigger } from "@/shared/ui/Compositions/Trigger"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Trigger> = {
    title: "Components/Compositions/Trigger",
    component: Trigger,
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

export const All = {
    render: () => {
        const options = [
            {
                value: "123",
                label: "123",
            },
        ]

        return (
            <div className="flex flex-col gap-5">
                {/*<div className="flex gap-2 items-center">*/}
                {/*    <Trigger active>Trigger</Trigger>*/}
                {/*    <Trigger*/}
                {/*        addonBefore={<AddonClear className="text-foreground-secondary" />}*/}
                {/*        addonAfter={<FaLocationDot className="mx-2 text-foreground-secondary" />}*/}
                {/*        className="w-[200px]"*/}
                {/*    >*/}
                {/*        Triggeras dasdasdha lhgflahsgfl hasgdlfhgashjdgfalhsgdfhjg*/}
                {/*    </Trigger>*/}
                {/*    <Trigger*/}
                {/*        addonBefore={<FaLocationDot className="mx-2 text-foreground-secondary" />}*/}
                {/*        addonAfter={<AddonClear className="text-foreground-secondary" />}*/}
                {/*    >*/}
                {/*        Trigger*/}
                {/*    </Trigger>*/}
                {/*</div>*/}
                {/*<div className="flex gap-2 items-center">*/}
                {/*    <Trigger disabled>Trigger</Trigger>*/}
                {/*    <Trigger*/}
                {/*        disabled*/}
                {/*        addonBefore={<AddonClear className="text-foreground-secondary" />}*/}
                {/*        addonAfter={<FaLocationDot className="mx-2 text-foreground-secondary" />}*/}
                {/*        className="w-[200px]"*/}
                {/*    >*/}
                {/*        Trigger*/}
                {/*    </Trigger>*/}
                {/*    <Trigger*/}
                {/*        disabled*/}
                {/*        addonBefore={<FaLocationDot className="mx-2 text-foreground-secondary" />}*/}
                {/*        addonAfter={<AddonClear className="text-foreground-secondary" />}*/}
                {/*    >*/}
                {/*        Trigger*/}
                {/*    </Trigger>*/}
                {/*</div>*/}
                {/*<div className="flex gap-2 items-center">*/}
                {/*    <Trigger disabled>Trigger</Trigger>*/}
                {/*    <Trigger*/}
                {/*        addonBefore={<AddonClear className="text-foreground-secondary" />}*/}
                {/*        addonAfter={<FaLocationDot className="mx-2 text-foreground-secondary" />}*/}
                {/*        className="w-[200px]"*/}
                {/*    >*/}
                {/*        Trigger*/}
                {/*    </Trigger>*/}
                {/*    <Trigger*/}
                {/*        addonBefore={<FaLocationDot className="mx-2 text-foreground-secondary" />}*/}
                {/*        addonAfter={<AddonClear className="text-foreground-secondary" />}*/}
                {/*    >*/}
                {/*        Trigger*/}
                {/*    </Trigger>*/}
                {/*</div>*/}
            </div>
        )
    },
}
