import { Button } from "@/components/ui/button"
import { useDraggable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { FormElement, FormElements } from "./form-elements"

// function SidebarBtnElement({ formElement }: { formElement: FormElement }) {
//     const { label, icon: Icon } = formElement.designerBtnElement
//     const draggable = useDraggable({
//         id: `sidebar-btn-${formElement.type}`,
//         data: {
//             type: formElement.type,
//             isDesignerBtn: true,
//         },
//     })

//     return (
//         <Button
//             ref={draggable.setNodeRef}
//             variant="outline"
//             className={cn("flex flex-col gap-2 h-[110px] w-[110px] cursor-grab bg-card hover:bg-accent/50 hover:border-primary/50 transition-all shadow-sm border-2", draggable.isDragging && "ring-2 ring-primary")}
//             {...draggable.listeners}
//             {...draggable.attributes}
//         >
//             <div className="h-10 w-10 bg-primary/5 rounded-md flex items-center justify-center">
//                  <Icon className="h-6 w-6 text-primary cursor-grab" />
//             </div>
//             <span className="text-sm font-medium text-center leading-tight">{label}</span>
//         </Button>
//     )
// }

// Better implementation using the screenshot style
function SidebarBtnElement({ formElement }: { formElement: FormElement }) {
    const { label, icon: Icon } = formElement.designerBtnElement
    const draggable = useDraggable({
        id: `sidebar-btn-${formElement.type}`,
        data: {
            type: formElement.type,
            isDesignerBtn: true,
        },
    })

    // Custom styling based on type for visual variety (optional, but nice)
    // For now, consistent clean style

    return (
        <div
            ref={draggable.setNodeRef}
            className={cn(
                "flex flex-col items-center justify-center gap-3 h-[110px] w-full max-w-[120px] cursor-grab rounded-xl border-2 border-muted bg-card hover:border-primary/50 hover:shadow-md transition-all",
                draggable.isDragging && "ring-2 ring-primary opacity-50"
            )}
            {...draggable.listeners}
            {...draggable.attributes}
        >
            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center transition-colors",
                "bg-muted" // Default gray background for icon
            )}>
                <Icon className="h-6 w-6 text-foreground" />
            </div>
            <span className="text-xs font-semibold text-center text-muted-foreground">{label}</span>
        </div>
    )
}

export function BuilderSidebar() {
    return (
        <aside className="w-[400px] max-w-[400px] flex flex-col flex-grow gap-6 border-l border-muted p-6 bg-background/50 backdrop-blur-sm overflow-y-auto h-full scrollbar-hide">

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Contato</h3>
                <div className="grid grid-cols-2 gap-4 place-items-center">
                    <SidebarBtnElement formElement={FormElements.NameField} />
                    <SidebarBtnElement formElement={FormElements.EmailField} />
                    <SidebarBtnElement formElement={FormElements.PhoneField} />
                    <SidebarBtnElement formElement={FormElements.UrlField} />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Geral</h3>
                <div className="grid grid-cols-2 gap-4 place-items-center">
                    <SidebarBtnElement formElement={FormElements.TextField} />
                    <SidebarBtnElement formElement={FormElements.NumberField} />
                    <SidebarBtnElement formElement={FormElements.TextArea} />
                    <SidebarBtnElement formElement={FormElements.TitleField} />
                    <SidebarBtnElement formElement={FormElements.ParagraphField} />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Seleção</h3>
                <div className="grid grid-cols-2 gap-4 place-items-center">
                    <SidebarBtnElement formElement={FormElements.Checkbox} />
                    <SidebarBtnElement formElement={FormElements.Select} />
                    <SidebarBtnElement formElement={FormElements.RadioGroup} />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Datas</h3>
                <div className="grid grid-cols-2 gap-4 place-items-center">
                    <SidebarBtnElement formElement={FormElements.DateField} />
                    <SidebarBtnElement formElement={FormElements.DateRangeField} />
                    <SidebarBtnElement formElement={FormElements.DateTimeField} />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Especial</h3>
                <div className="grid grid-cols-2 gap-4 place-items-center">
                    <SidebarBtnElement formElement={FormElements.AddressField} />
                    <SidebarBtnElement formElement={FormElements.FileField} />
                    <SidebarBtnElement formElement={FormElements.SignatureField} />
                    <SidebarBtnElement formElement={FormElements.StarRatingField} />
                    <SidebarBtnElement formElement={FormElements.OpinionScaleField} />
                    <SidebarBtnElement formElement={FormElements.ToggleField} />
                    <SidebarBtnElement formElement={FormElements.VerificationField} />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Conteúdo</h3>
                <div className="grid grid-cols-2 gap-4 place-items-center">
                    <SidebarBtnElement formElement={FormElements.ImageField} />
                    <SidebarBtnElement formElement={FormElements.VideoField} />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Layout</h3>
                <div className="grid grid-cols-2 gap-4 place-items-center">
                    <SidebarBtnElement formElement={FormElements.SeparatorField} />
                    <SidebarBtnElement formElement={FormElements.SpacerField} />
                </div>
            </div>
        </aside>
    )
}
