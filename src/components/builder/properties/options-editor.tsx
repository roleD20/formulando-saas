"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { FormElementInstance, useBuilder } from "@/context/builder-context"

interface OptionsEditorProps {
    elementInstance: FormElementInstance
}

export function OptionsEditor({ elementInstance }: OptionsEditorProps) {
    const { updateElement } = useBuilder()
    const options: string[] = elementInstance.extraAttributes?.options || []

    const handleAddOption = () => {
        const newOptions = [...options, `Opção ${options.length + 1}`]
        updateElement(elementInstance.id, {
            ...elementInstance,
            extraAttributes: {
                ...elementInstance.extraAttributes,
                options: newOptions
            }
        })
    }

    const handleRemoveOption = (index: number) => {
        const newOptions = [...options]
        newOptions.splice(index, 1)
        updateElement(elementInstance.id, {
            ...elementInstance,
            extraAttributes: {
                ...elementInstance.extraAttributes,
                options: newOptions
            }
        })
    }

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options]
        newOptions[index] = value
        updateElement(elementInstance.id, {
            ...elementInstance,
            extraAttributes: {
                ...elementInstance.extraAttributes,
                options: newOptions
            }
        })
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <Label>Opções</Label>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleAddOption}>
                    <Plus className="h-4 w-4" />
                    Adicionar
                </Button>
            </div>

            <div className="flex flex-col gap-2">
                {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Opção ${index + 1}`}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveOption(index)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}

                {options.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm p-4 border border-dashed rounded-md">
                        Nenhuma opção adicionada.
                    </div>
                )}
            </div>
        </div>
    )
}
