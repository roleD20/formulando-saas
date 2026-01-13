"use client"

import React, { useState } from "react"
import { useLPBuilder } from "../context/lp-builder-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Lock, Unlock, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"

type SpacingType = 'margin' | 'padding'

export function SpacingControl({ type }: { type: SpacingType }) {
    const { selectedElement, updateElement } = useLPBuilder()
    const [locked, setLocked] = useState(true)

    if (!selectedElement) return null

    const styles = selectedElement?.styles || {}

    // Helper to get value (either generic 'margin' or specific 'marginTop')
    const getValue = (side?: 'Top' | 'Right' | 'Bottom' | 'Left') => {
        if (locked) {
            return styles[type] || ''
        } else if (side) {
            return styles[`${type}${side}` as keyof typeof styles] || ''
        }
        return ''
    }

    const handleChange = (value: string, side?: 'Top' | 'Right' | 'Bottom' | 'Left') => {
        const newStyles = { ...selectedElement.styles }

        if (locked) {
            // Clear specifics, set generic
            delete newStyles[`${type}Top` as keyof typeof styles]
            delete newStyles[`${type}Right` as keyof typeof styles]
            delete newStyles[`${type}Bottom` as keyof typeof styles]
            delete newStyles[`${type}Left` as keyof typeof styles]
            newStyles[type] = value
        } else if (side) {
            // Clear generic, set specific
            delete newStyles[type]
            newStyles[`${type}${side}` as keyof typeof styles] = value
        }

        updateElement(selectedElement.id, { styles: newStyles })
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label className="text-xs capitalize">{type}</Label>
                <Toggle
                    size="sm"
                    pressed={locked}
                    onPressedChange={setLocked}
                    className="h-6 w-6 p-0"
                >
                    {locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                </Toggle>
            </div>

            {locked ? (
                <div className="flex items-center gap-2">
                    <Input
                        value={getValue()}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder="All sides (e.g. 10px)"
                        className="h-8 text-xs"
                    />
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1">
                        <ArrowUp className="h-3 w-3 text-muted-foreground" />
                        <Input
                            value={getValue('Top')}
                            onChange={(e) => handleChange(e.target.value, 'Top')}
                            placeholder="Top"
                            className="h-8 text-xs"
                        />
                    </div>
                    <div className="flex items-center gap-1">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <Input
                            value={getValue('Right')}
                            onChange={(e) => handleChange(e.target.value, 'Right')}
                            placeholder="Right"
                            className="h-8 text-xs"
                        />
                    </div>
                    <div className="flex items-center gap-1">
                        <ArrowDown className="h-3 w-3 text-muted-foreground" />
                        <Input
                            value={getValue('Bottom')}
                            onChange={(e) => handleChange(e.target.value, 'Bottom')}
                            placeholder="Bottom"
                            className="h-8 text-xs"
                        />
                    </div>
                    <div className="flex items-center gap-1">
                        <ArrowLeft className="h-3 w-3 text-muted-foreground" />
                        <Input
                            value={getValue('Left')}
                            onChange={(e) => handleChange(e.target.value, 'Left')}
                            placeholder="Left"
                            className="h-8 text-xs"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export function BorderRadiusControl() {
    const { selectedElement, updateElement } = useLPBuilder()
    const [locked, setLocked] = useState(true)

    if (!selectedElement) return null

    const styles = selectedElement?.styles || {}

    const getValue = (corner?: 'TopLeft' | 'TopRight' | 'BottomRight' | 'BottomLeft') => {
        if (locked) {
            return styles.borderRadius || ''
        } else if (corner) {
            return styles[`border${corner}Radius` as keyof typeof styles] || ''
        }
        return ''
    }

    const handleChange = (value: string, corner?: 'TopLeft' | 'TopRight' | 'BottomRight' | 'BottomLeft') => {
        const newStyles = { ...selectedElement.styles }

        if (locked) {
            // Clear specifics
            delete newStyles.borderTopLeftRadius
            delete newStyles.borderTopRightRadius
            delete newStyles.borderBottomRightRadius
            delete newStyles.borderBottomLeftRadius
            newStyles.borderRadius = value
        } else if (corner) {
            delete newStyles.borderRadius
            newStyles[`border${corner}Radius` as keyof typeof styles] = value
        }

        updateElement(selectedElement.id, { styles: newStyles })
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label className="text-xs">Border Radius</Label>
                <Toggle
                    size="sm"
                    pressed={locked}
                    onPressedChange={setLocked}
                    className="h-6 w-6 p-0"
                >
                    {locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                </Toggle>
            </div>

            {locked ? (
                <Input
                    value={getValue()}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="All corners (e.g. 8px)"
                    className="h-8 text-xs"
                />
            ) : (
                <div className="grid grid-cols-2 gap-2">
                    <Input
                        value={getValue('TopLeft')}
                        onChange={(e) => handleChange(e.target.value, 'TopLeft')}
                        placeholder="TL"
                        className="h-8 text-xs"
                    />
                    <Input
                        value={getValue('TopRight')}
                        onChange={(e) => handleChange(e.target.value, 'TopRight')}
                        placeholder="TR"
                        className="h-8 text-xs"
                    />
                    <Input
                        value={getValue('BottomLeft')}
                        onChange={(e) => handleChange(e.target.value, 'BottomLeft')}
                        placeholder="BL"
                        className="h-8 text-xs"
                    />
                    <Input
                        value={getValue('BottomRight')}
                        onChange={(e) => handleChange(e.target.value, 'BottomRight')}
                        placeholder="BR"
                        className="h-8 text-xs"
                    />
                </div>
            )}
        </div>
    )
}
