"use client"

import React from "react"
import { useLPBuilder } from "../context/lp-builder-context"
import { useResponsiveStyle } from "../context/responsive-style-context"
import { useResponsiveStyleUpdate } from "../context/use-responsive-style"
import { Label } from "@/components/ui/label"
import { Toggle } from "@/components/ui/toggle"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    LayoutGrid,
    ArrowRight,
    ArrowDown,
    ArrowLeft,
    ArrowUp,
    AlignStartVertical,
    AlignCenterVertical,
    AlignEndVertical,
    AlignStartHorizontal,
    AlignCenterHorizontal,
    AlignEndHorizontal,
    StretchHorizontal,
    Maximize,
    Columns
} from "lucide-react"
import { cn } from "@/lib/utils"

export function FlexControl() {
    const { selectedElement, updateElement } = useLPBuilder()
    const { editingDevice } = useResponsiveStyle()
    const { handleStyleChange: responsiveStyleChange, getStyles } = useResponsiveStyleUpdate(editingDevice)

    if (!selectedElement) return null

    const styles = getStyles()
    const isFlex = styles.display === 'flex'

    const handleStyleChange = (key: string, value: string) => {
        responsiveStyleChange(key, value)
    }

    const toggleFlex = (pressed: boolean) => {
        if (pressed) {
            // Set multiple properties at once
            const flexStyles = {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'flex-start',
                gap: '16px'
            }

            if (editingDevice === 'desktop') {
                updateElement(selectedElement.id, {
                    styles: {
                        ...selectedElement.styles,
                        ...flexStyles
                    }
                })
            } else {
                updateElement(selectedElement.id, {
                    responsiveStyles: {
                        ...selectedElement.responsiveStyles,
                        [editingDevice]: {
                            ...selectedElement.responsiveStyles?.[editingDevice],
                            ...flexStyles
                        }
                    }
                })
            }
        } else {
            // Remove flex properties
            if (editingDevice === 'desktop') {
                const newStyles = { ...selectedElement.styles }
                delete newStyles.display
                delete newStyles.flexDirection
                delete newStyles.justifyContent
                delete newStyles.alignItems
                delete newStyles.gap
                updateElement(selectedElement.id, { styles: newStyles })
            } else {
                const deviceStyles = { ...selectedElement.responsiveStyles?.[editingDevice] }
                delete deviceStyles.display
                delete deviceStyles.flexDirection
                delete deviceStyles.justifyContent
                delete deviceStyles.alignItems
                delete deviceStyles.gap
                updateElement(selectedElement.id, {
                    responsiveStyles: {
                        ...selectedElement.responsiveStyles,
                        [editingDevice]: deviceStyles
                    }
                })
            }
        }
    }

    const IconButton = ({
        active,
        onClick,
        icon: Icon,
        tooltip
    }: {
        active: boolean,
        onClick: () => void,
        icon: React.ElementType,
        tooltip?: string
    }) => {
        const comp = (
            <button
                onClick={onClick}
                className={cn(
                    "p-1.5 rounded-md border transition-all hover:bg-muted focus:outline-none",
                    active ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input text-muted-foreground"
                )}
            >
                <Icon className="h-4 w-4" />
            </button>
        )

        if (!tooltip) return comp

        return (
            <TooltipProvider>
                <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                        {comp}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-xs">{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-xs">Flex Layout</Label>
                </div>
                <Toggle
                    size="sm"
                    pressed={isFlex}
                    onPressedChange={toggleFlex}
                    className="h-6 px-2 text-xs"
                >
                    {isFlex ? "On" : "Off"}
                </Toggle>
            </div>

            {isFlex && (
                <div className="space-y-4 pt-2">
                    {/* Direction */}
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase text-muted-foreground font-semibold">Direção</Label>
                        <div className="flex gap-1">
                            <IconButton
                                active={styles.flexDirection === 'row'}
                                onClick={() => handleStyleChange('flexDirection', 'row')}
                                icon={ArrowRight}
                                tooltip="Row (Horizontal)"
                            />
                            <IconButton
                                active={styles.flexDirection === 'column'}
                                onClick={() => handleStyleChange('flexDirection', 'column')}
                                icon={ArrowDown}
                                tooltip="Column (Vertical)"
                            />
                            <IconButton
                                active={styles.flexDirection === 'row-reverse'}
                                onClick={() => handleStyleChange('flexDirection', 'row-reverse')}
                                icon={ArrowLeft}
                                tooltip="Row Reverse"
                            />
                            <IconButton
                                active={styles.flexDirection === 'column-reverse'}
                                onClick={() => handleStyleChange('flexDirection', 'column-reverse')}
                                icon={ArrowUp}
                                tooltip="Column Reverse"
                            />
                        </div>
                    </div>

                    {/* Justify Content */}
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase text-muted-foreground font-semibold">Justify (Horizontal se Row)</Label>
                        <div className="flex gap-1 flex-wrap">
                            <IconButton
                                active={styles.justifyContent === 'flex-start'}
                                onClick={() => handleStyleChange('justifyContent', 'flex-start')}
                                icon={AlignStartHorizontal}
                                tooltip="Start"
                            />
                            <IconButton
                                active={styles.justifyContent === 'center'}
                                onClick={() => handleStyleChange('justifyContent', 'center')}
                                icon={AlignCenterHorizontal}
                                tooltip="Center"
                            />
                            <IconButton
                                active={styles.justifyContent === 'flex-end'}
                                onClick={() => handleStyleChange('justifyContent', 'flex-end')}
                                icon={AlignEndHorizontal}
                                tooltip="End"
                            />
                            <IconButton
                                active={styles.justifyContent === 'space-between'}
                                onClick={() => handleStyleChange('justifyContent', 'space-between')}
                                icon={Columns} // Proxy for space-between
                                tooltip="Space Between"
                            />
                            <IconButton
                                active={styles.justifyContent === 'space-around'}
                                onClick={() => handleStyleChange('justifyContent', 'space-around')}
                                icon={Maximize} // Proxy for space-around
                                tooltip="Space Around"
                            />
                        </div>
                    </div>

                    {/* Align Items */}
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase text-muted-foreground font-semibold">Align (Vertical se Row)</Label>
                        <div className="flex gap-1">
                            <IconButton
                                active={styles.alignItems === 'flex-start'}
                                onClick={() => handleStyleChange('alignItems', 'flex-start')}
                                icon={AlignStartVertical}
                                tooltip="Start"
                            />
                            <IconButton
                                active={styles.alignItems === 'center'}
                                onClick={() => handleStyleChange('alignItems', 'center')}
                                icon={AlignCenterVertical}
                                tooltip="Center"
                            />
                            <IconButton
                                active={styles.alignItems === 'flex-end'}
                                onClick={() => handleStyleChange('alignItems', 'flex-end')}
                                icon={AlignEndVertical}
                                tooltip="End"
                            />
                            <IconButton
                                active={styles.alignItems === 'stretch'}
                                onClick={() => handleStyleChange('alignItems', 'stretch')}
                                icon={StretchHorizontal}
                                tooltip="Stretch"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs">Gap</Label>
                        <Select
                            value={styles.gap || '0'}
                            onValueChange={(val) => handleStyleChange('gap', val)}
                        >
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="0" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">0</SelectItem>
                                <SelectItem value="4px">4px</SelectItem>
                                <SelectItem value="8px">8px</SelectItem>
                                <SelectItem value="12px">12px</SelectItem>
                                <SelectItem value="16px">16px</SelectItem>
                                <SelectItem value="24px">24px</SelectItem>
                                <SelectItem value="32px">32px</SelectItem>
                                <SelectItem value="48px">48px</SelectItem>
                                <SelectItem value="64px">64px</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}
        </div>
    )
}
