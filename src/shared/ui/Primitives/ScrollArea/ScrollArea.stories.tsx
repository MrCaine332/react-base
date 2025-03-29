import React, { useRef } from "react"
import type { Meta, StoryObj } from "@storybook/react"

import * as ScrollAreaPrimitive from "@/shared/lib/ScrollArea"

import { ScrollArea, ScrollAreaScrollbar } from "@/shared/ui/Primitives/ScrollArea"
import { Separator } from "@/shared/ui/Core/Separator"
import { useForceRerender } from "@/shared/hooks/useForceRerender"
import { useLazyRef } from "@/shared/hooks/useLazyRef"
import { Button } from "@/shared/ui/Core/Button"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof ScrollArea> = {
    title: "Components/Primitives/ScrollArea",
    component: ScrollArea,
    parameters: {
        layout: "centered",
    },
    argTypes: {},
    args: {},
}

export default meta
type Story = StoryObj<typeof meta>

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`)

export const Demo = {
    render: () => {
        const count = useRef(1)
        const tags = useLazyRef(() => Array.from({ length: 5 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`))

        const { rerender } = useForceRerender()

        const ref = useRef(null)

        const onClick = () => {
            if (count.current % 5 === 0) {
                const a = count.current / 5
                tags.current.unshift(`v1.2.0-beta.${5 + count.current}`.repeat(a))
            } else {
                tags.current.unshift(`v1.2.0-beta.${5 + count.current}`)
            }
            count.current++
            rerender()
        }

        return (
            <div className="flex flex-col gap-3">
                <Button onClick={onClick}>Add Tag</Button>
                <ScrollArea className="rounded-md border" type="always" viewportClassName="max-h-72">
                    <div ref={ref} className="p-4">
                        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
                        {tags.current.map((tag) => (
                            <React.Fragment key={tag}>
                                <div className="text-sm">{tag}</div>
                                <Separator className="my-2" />
                            </React.Fragment>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        )
    },
}
