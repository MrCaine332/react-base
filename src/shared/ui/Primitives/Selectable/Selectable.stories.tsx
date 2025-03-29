import React, { useRef, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"

import "../../Compositions/Input/Input.css"

import { PopoverRoot, PopoverContent, PopoverTrigger, PopoverArrow } from "@/shared/ui/Primitives/Popover"
import { cn } from "@/shared/utils/cn"
import { ScrollArea } from "@/shared/ui/Primitives/ScrollArea"
import { FaCalendar, FaCheck, FaChevronDown, FaPaperPlane, FaXmark } from "react-icons/fa6"
import { FaSmile } from "react-icons/fa"
import {
    Selectable,
    SelectableEmpty,
    SelectableHeading,
    SelectableInput,
    SelectableItem,
    SelectableList,
} from "@/shared/ui/Primitives/Selectable"

import { AddonClear } from "@/shared/ui/Core/AddonBox/addons"
import { SelectableGroup } from "@/shared/lib/Selectable/Selectable"
import { Separator } from "@/shared/ui/Core/Separator"
import { Trigger } from "@/shared/ui/Compositions/Trigger"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Selectable> = {
    title: "Components/Primitives/Selectable",
    component: Selectable,
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
        return (
            <div className="flex items-center space-x-2">
                <Selectable className="rounded-lg border shadow-md w-[300px]">
                    <SelectableInput />
                    <SelectableList>
                        <SelectableEmpty>No results found.</SelectableEmpty>
                        <SelectableGroup>
                            <SelectableHeading>Suggestions</SelectableHeading>
                            <SelectableItem value="Calendar">
                                <FaCalendar className="mr-2 h-4 w-4" />
                                <span>Calendar</span>
                            </SelectableItem>
                            <SelectableItem value="Search">
                                <FaSmile className="mr-2 h-4 w-4" />
                                <span>Search Emoji</span>
                            </SelectableItem>
                            <SelectableItem value="Email">
                                <FaPaperPlane className="mr-2 h-4 w-4" />
                                <span>Send email</span>
                            </SelectableItem>
                        </SelectableGroup>
                        <Separator />
                        <SelectableGroup>
                            <SelectableHeading>Settings</SelectableHeading>
                            <SelectableItem>
                                <span>Profile</span>
                            </SelectableItem>
                            <SelectableItem>
                                <span>Billing</span>
                            </SelectableItem>
                            <SelectableItem>
                                <span>Settings</span>
                            </SelectableItem>
                        </SelectableGroup>
                    </SelectableList>
                </Selectable>
            </div>
        )
    },
}

export const Combobox = {
    render: () => {
        const frameworks = [
            {
                value: "next.js",
                label: "Next.js",
            },
            {
                value: "sveltekit",
                label: "SvelteKit",
            },
            {
                value: "nuxt.js",
                label: "Nuxt.js",
            },
            {
                value: "remix",
                label: "Remix",
            },
            {
                value: "astro",
                label: "Astro",
            },
            {
                value: "next.js2",
                label: "Next.js2",
            },
            {
                value: "sveltekit2",
                label: "SvelteKit2",
            },
            {
                value: "nuxt.js2",
                label: "Nuxt.js2",
            },
            {
                value: "remix2",
                label: "Remix2",
            },
            {
                value: "astro2",
                label: "Astro2",
            },
            {
                value: "next.js3",
                label: "Next.js3",
            },
            {
                value: "sveltekit3",
                label: "SvelteKit3",
            },
            {
                value: "nuxt.js3",
                label: "Nuxt.js3",
            },
            {
                value: "remix3",
                label: "Remix3",
            },
            {
                value: "astro3",
                label: "Astro3",
            },
        ]

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [open, setOpen] = React.useState(false)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [search, setSearch] = React.useState("")
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, setValue] = React.useState("")

        return (
            <div className="flex gap-5 h-[500px]">
                <PopoverRoot open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Trigger label="Framework" className={cn("", !value && "text-foreground-primary/70")}>
                            {value
                                ? frameworks.find((framework) => framework.value === value)?.label
                                : "Select framework..."}
                        </Trigger>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <PopoverArrow />
                        <Selectable>
                            <SelectableInput
                                placeholder="Search framework..."
                                value={search}
                                onValueChange={setSearch}
                                addonAfter={search ? <AddonClear /> : undefined}
                            />
                            <SelectableList>
                                <ScrollArea>
                                    <div className="max-h-72">
                                        <SelectableEmpty>No framework found.</SelectableEmpty>
                                        <SelectableGroup>
                                            {frameworks.map((framework) => (
                                                <SelectableItem
                                                    key={framework.value}
                                                    value={framework.value}
                                                    onSelect={(currentValue) => {
                                                        setValue(currentValue === value ? "" : currentValue)
                                                        setOpen(false)
                                                    }}
                                                >
                                                    {framework.label}
                                                    <FaCheck
                                                        className={cn(
                                                            "ml-auto h-4 w-4 text-primary",
                                                            value === framework.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </SelectableItem>
                                            ))}
                                        </SelectableGroup>
                                    </div>
                                </ScrollArea>
                            </SelectableList>
                        </Selectable>
                    </PopoverContent>
                </PopoverRoot>
            </div>
        )
    },
}
