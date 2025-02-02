import React, { useState } from 'react'

interface TooltipProps {
    text: string
    children?: React.ReactNode
    position?: 'top' | 'bottom' | 'left' | 'right'
    className?: string
}

export default function MobileTooltip({
    text,
    children,
    position = 'bottom',
    className = '',
}: TooltipProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const positionClasses: Record<string, string> = {
        top: 'bottom-full mb-2',
        bottom: 'top-full mt-2',
        left: 'right-full mr-2',
        right: 'left-full ml-2',
    }

    return (
        <div className={`relative inline-block ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                {children || 'Tap me for info'}
            </button>

            {isOpen && (
                <div
                    className={`absolute z-10 w-64 p-4 bg-white rounded-lg shadow-lg border border-gray-200 ${positionClasses[position]}`}
                    role="tooltip"
                >
                    <p className="text-gray-700 text-sm">{text}</p>

                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        aria-label="Close tooltip"
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    )
}

// Example usage component to demonstrate the tooltip
const TooltipExample: React.FC = () => {
    return (
        <div className="p-8 space-y-4">
            <MobileTooltip
                text="This tooltip appears below the button"
                position="bottom"
            >
                Bottom Tooltip
            </MobileTooltip>

            <MobileTooltip
                text="This tooltip appears above the button"
                position="top"
            >
                Top Tooltip
            </MobileTooltip>

            <MobileTooltip
                text="This is a customized tooltip with different text"
                className="ml-4"
            />
        </div>
    )
}
