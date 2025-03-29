import * as React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'

import { cn } from '@/shared/utils/cn'

export type ScrollAreaProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    orientation?: 'horizontal' | 'vertical'

    viewportClassName?: string
    viewportProps?: Omit<React.ComponentProps<typeof ScrollAreaPrimitive.Viewport>, 'className'>

    scrollbarClassName?: string
    scrollbarProps?: Omit<
        React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
        'className' | 'orientation'
    >

    thumbClassName?: string
    thumbProps?: Omit<React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaThumb>, 'className'>

    cornerClassName?: string
    cornerProps?: Omit<React.ComponentProps<typeof ScrollAreaPrimitive.Corner>, 'className'>
}

const ScrollArea = React.forwardRef<React.ElementRef<typeof ScrollAreaPrimitive.Root>, ScrollAreaProps>(
    (
        {
            className,
            orientation,

            viewportClassName,
            viewportProps,

            scrollbarClassName,
            scrollbarProps,

            thumbClassName,
            thumbProps,

            cornerClassName,
            cornerProps,

            children,
            ...props
        },
        ref,
    ) => (
        <ScrollAreaPrimitive.Root ref={ref} className={cn('relative overflow-hidden', className)} {...props}>
            <ScrollAreaPrimitive.Viewport
                className={cn('h-full w-full rounded-[inherit]', viewportClassName)}
                {...viewportProps}
            >
                {children}
            </ScrollAreaPrimitive.Viewport>
            <ScrollAreaScrollbar
                className={scrollbarClassName}
                orientation={orientation}
                thumbClassName={thumbClassName}
                thumbProps={thumbProps}
                {...scrollbarProps}
            />
            <ScrollAreaPrimitive.Corner className={cornerClassName} {...cornerProps} />
        </ScrollAreaPrimitive.Root>
    ),
)
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

export type ScrollBarProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> & {
    thumbClassName?: string
    thumbProps?: Omit<React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaThumb>, 'className'>
}

const ScrollAreaScrollbar = React.forwardRef<
    React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
    ScrollBarProps
>(({ className, orientation = 'vertical', thumbClassName, thumbProps, ...props }, ref) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
        ref={ref}
        orientation={orientation}
        className={cn(
            'flex touch-none select-none transition-colors',
            orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]',
            orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-[1px]',
            className,
        )}
        {...props}
    >
        <ScrollAreaPrimitive.ScrollAreaThumb
            className={cn('relative flex-1 rounded-full bg-border', thumbClassName)}
            {...thumbProps}
        />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollAreaScrollbar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollAreaScrollbar }
