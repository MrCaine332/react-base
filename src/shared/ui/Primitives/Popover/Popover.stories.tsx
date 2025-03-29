import React, { useEffect, useRef } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { PopoverRoot, PopoverContent, PopoverTrigger, PopoverArrow } from '@/shared/ui/Primitives/Popover'
import { Label } from '@/shared/ui/Core/Label'
import { Input } from '@/shared/ui/Compositions/Input'
import { FaChevronDown } from 'react-icons/fa6'
import { Trigger } from '@/shared/ui/Compositions/Trigger'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof PopoverRoot> = {
    title: 'Components/Primitives/Popover',
    component: PopoverRoot,
    parameters: {
        layout: 'centered',
    },
    argTypes: {},
    args: {},
}

export default meta
type Story = StoryObj<typeof meta>

export const Demo = {
    render: () => {
        return (
            <PopoverRoot>
                <PopoverTrigger asChild>
                    <Trigger
                        label="Popover"
                        addonAfter={<FaChevronDown size={12} className="mr-3 text-foreground-tertiary" />}
                    >
                        Open Popover
                    </Trigger>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                    <PopoverArrow />
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Dimensions</h4>
                            <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
                        </div>
                        <div className="grid gap-2">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="width">Width</Label>
                                <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="maxWidth">Max. width</Label>
                                <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="height">Height</Label>
                                <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="maxHeight">Max. height</Label>
                                <Input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </PopoverRoot>
        )
    },
}

export const ConstrainSize = {
    render: () => {
        return (
            <PopoverRoot>
                <PopoverTrigger asChild>
                    <Trigger
                        label="Popover"
                        addonAfter={<FaChevronDown size={12} className="mr-3 text-foreground-tertiary" />}
                    >
                        Open Popover
                    </Trigger>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-4">
                    <PopoverArrow />
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Dimensions</h4>
                            <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
                        </div>
                        <div className="grid gap-2">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="width">Width</Label>
                                <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="maxWidth">Max. width</Label>
                                <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="height">Height</Label>
                                <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="maxHeight">Max. height</Label>
                                <Input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </PopoverRoot>
        )
    },
}
