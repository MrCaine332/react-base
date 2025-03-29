import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/shared/ui/Core/Button'
import { StepperItem, StepperRoot } from '@/shared/ui/Primitives/Stepper'
import { FaPaypal, FaUser, FaWarehouse } from 'react-icons/fa6'
import { cn } from '@/shared/utils/cn'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof StepperRoot> = {
    title: 'Components/Primitives/Stepper',
    component: StepperRoot,
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
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [step, setStep] = useState(0)

        const handlePrev = () => {
            if (step > 0) setStep(step - 1)
        }

        const handleNext = () => {
            setStep(step + 1)
        }

        return (
            <div className="flex flex-col gap-10">
                <div className="flex items-center gap-2">
                    <Button onClick={handlePrev}>Prev</Button>
                    <StepperRoot value={step} className="w-[500px]">
                        <StepperItem>Warehouse Info</StepperItem>
                        <StepperItem className="group">
                            <div className="flex gap-2 items-center">
                                <FaWarehouse size={12} /> Warehouse Info
                            </div>
                        </StepperItem>
                        <StepperItem className="group">
                            <div className="flex gap-2 items-center">
                                <FaWarehouse
                                    size={12}
                                    className="text-border group-data-[active=true]:text-primary-500 transition-colors duration-300"
                                />
                                Warehouse Info
                            </div>
                        </StepperItem>
                        <StepperItem>
                            {(active) => (
                                <div className="flex gap-2 items-center">
                                    <FaWarehouse
                                        size={12}
                                        className={cn(
                                            'transition-colors duration-300',
                                            active ? 'text-primary-500 ' : 'text-danger-500',
                                        )}
                                    />
                                    Warehouse Info
                                </div>
                            )}
                        </StepperItem>
                    </StepperRoot>
                    <Button onClick={handleNext}>Next</Button>
                </div>
            </div>
        )
    },
}
