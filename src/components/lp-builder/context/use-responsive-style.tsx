"use client"

import { useLPBuilder } from "./lp-builder-context"

type EditingDevice = 'desktop' | 'tablet' | 'mobile'

export function useResponsiveStyleUpdate(editingDevice: EditingDevice) {
    const { selectedElement, updateElement } = useLPBuilder()

    const handleStyleChange = (styleKey: string, value: any) => {
        if (!selectedElement) return

        if (editingDevice === 'desktop') {
            // Desktop styles go to base styles
            updateElement(selectedElement.id, {
                styles: {
                    ...selectedElement.styles,
                    [styleKey]: value
                }
            })
        } else {
            // Mobile/Tablet styles go to responsiveStyles
            const newResponsiveStyles = {
                ...selectedElement.responsiveStyles,
                [editingDevice]: {
                    ...selectedElement.responsiveStyles?.[editingDevice],
                    [styleKey]: value
                }
            }

            updateElement(selectedElement.id, {
                responsiveStyles: newResponsiveStyles
            })
        }
    }

    const getCurrentStyleValue = (styleKey: string) => {
        if (!selectedElement) return ''

        if (editingDevice === 'desktop') {
            return selectedElement.styles?.[styleKey] || ''
        }
        // For mobile/tablet, show responsive value if set, otherwise show inherited desktop value
        return selectedElement.responsiveStyles?.[editingDevice]?.[styleKey] || selectedElement.styles?.[styleKey] || ''
    }

    const getStyles = () => {
        if (!selectedElement) return {}

        if (editingDevice === 'desktop') {
            return selectedElement.styles || {}
        }

        // Merge desktop styles with device-specific styles
        return {
            ...selectedElement.styles,
            ...selectedElement.responsiveStyles?.[editingDevice]
        }
    }

    return {
        handleStyleChange,
        getCurrentStyleValue,
        getStyles
    }
}
