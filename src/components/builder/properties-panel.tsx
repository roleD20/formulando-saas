import { useBuilder } from "@/context/builder-context"
import { FormElements } from "./form-elements"
import { Button } from "../ui/button"
import { X, SlidersHorizontal } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export function PropertiesPanel() {
    const { selectedElement, setSelectedElement } = useBuilder()

    if (!selectedElement) {
        return (
            <aside className="w-[320px] max-w-[320px] flex flex-col border-l border-muted bg-background/50 backdrop-blur-sm h-full overflow-hidden">
                <div className="p-6 flex flex-col items-center justify-center h-full text-center gap-4 opacity-50">
                    <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                        <SlidersHorizontal className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg">Propriedades</h3>
                        <p className="text-sm text-muted-foreground max-w-[200px] leading-relaxed">
                            Selecione um elemento no formulário para ajustar suas opções.
                        </p>
                    </div>
                </div>
            </aside>
        )
    }

    const PropertiesForm = FormElements[selectedElement.type].propertiesComponent

    return (
        <aside className="w-[320px] max-w-[320px] flex flex-col border-l border-muted bg-background/50 backdrop-blur-sm h-full overflow-hidden transition-all">
            <div className="p-4 border-b flex items-center justify-between bg-background/50">
                <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">Editar</span>
                    <h2 className="text-sm font-semibold text-foreground">Propriedades</h2>
                </div>
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                    onClick={() => setSelectedElement(null)}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4">
                    <div className="bg-card rounded-xl border shadow-sm p-4 space-y-6">
                        <PropertiesForm elementInstance={selectedElement} />
                    </div>
                </div>
            </ScrollArea>
        </aside>
    )
}
