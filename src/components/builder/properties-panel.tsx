import { useBuilder } from "@/context/builder-context"
import { FormElements } from "./form-elements"
import { Button } from "../ui/button"
import { X } from "lucide-react"

export function PropertiesPanel() {
    const { selectedElement, setSelectedElement } = useBuilder()

    if (!selectedElement) {
        return (
            <aside className="w-[300px] max-w-[300px] flex flex-col gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full">
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-muted-foreground text-center">Selecione um elemento para editar suas propriedades.</p>
                </div>
            </aside>
        )
    }

    const PropertiesForm = FormElements[selectedElement.type].propertiesComponent

    return (
        <aside className="w-[300px] max-w-[300px] flex flex-col gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Propriedades</p>
                <Button size="icon" variant="ghost" onClick={() => setSelectedElement(null)}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
            <PropertiesForm elementInstance={selectedElement} />
        </aside>
    )
}
