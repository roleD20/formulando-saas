import { Button } from "@/components/ui/button"
import { useDraggable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { FormElement, FormElements } from "./form-elements"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"

function SidebarBtnElement({ formElement }: { formElement: FormElement }) {
    const { label, icon: Icon } = formElement.designerBtnElement
    const draggable = useDraggable({
        id: `sidebar-btn-${formElement.type}`,
        data: {
            type: formElement.type,
            isDesignerBtn: true,
        },
    })

    return (
        <div
            ref={draggable.setNodeRef}
            className={cn(
                "flex flex-col items-center justify-center gap-2 h-20 w-20 cursor-grab rounded-xl border border-muted bg-card hover:border-primary/50 hover:shadow-sm hover:scale-105 transition-all duration-200 group",
                draggable.isDragging && "ring-2 ring-primary opacity-50"
            )}
            {...draggable.listeners}
            {...draggable.attributes}
        >
            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-colors bg-muted group-hover:bg-primary/10")}>
                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[10px] font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors px-1 line-clamp-2 leading-tight">
                {label}
            </span>
        </div>
    )
}

export function BuilderSidebar() {
    return (
        <aside className="w-[320px] max-w-[320px] flex flex-col flex-grow border-l border-muted bg-background/50 backdrop-blur-sm h-full overflow-hidden">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold tracking-tight">Componentes</h2>
                <p className="text-sm text-muted-foreground">
                    Arraste para o canvas
                </p>
            </div>

            <ScrollArea className="flex-1 h-full px-1">
                <Accordion type="multiple" defaultValue={["basic", "contact", "layout"]} className="w-full pr-0">

                    <AccordionItem value="contact" className="border-b-0 mb-2">
                        <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50 rounded-lg py-3">
                            <span className="text-sm font-semibold">Contato & Identificação</span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                            <div className="grid grid-cols-3 gap-2 place-items-center">
                                <SidebarBtnElement formElement={FormElements.NameField} />
                                <SidebarBtnElement formElement={FormElements.EmailField} />
                                <SidebarBtnElement formElement={FormElements.PhoneField} />
                                <SidebarBtnElement formElement={FormElements.UrlField} />
                                <SidebarBtnElement formElement={FormElements.AddressField} />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="basic" className="border-b-0 mb-2">
                        <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50 rounded-lg py-3">
                            <span className="text-sm font-semibold">Campos Básicos</span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                            <div className="grid grid-cols-3 gap-2 place-items-center">
                                <SidebarBtnElement formElement={FormElements.TextField} />
                                <SidebarBtnElement formElement={FormElements.NumberField} />
                                <SidebarBtnElement formElement={FormElements.TextArea} />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="selection" className="border-b-0 mb-2">
                        <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50 rounded-lg py-3">
                            <span className="text-sm font-semibold">Seleção & Opções</span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                            <div className="grid grid-cols-3 gap-2 place-items-center">
                                <SidebarBtnElement formElement={FormElements.Checkbox} />
                                <SidebarBtnElement formElement={FormElements.Select} />
                                <SidebarBtnElement formElement={FormElements.RadioGroup} />
                                <SidebarBtnElement formElement={FormElements.ToggleField} />
                                <SidebarBtnElement formElement={FormElements.StarRatingField} />
                                <SidebarBtnElement formElement={FormElements.OpinionScaleField} />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="advanced" className="border-b-0 mb-2">
                        <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50 rounded-lg py-3">
                            <span className="text-sm font-semibold">Avançado</span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                            <div className="grid grid-cols-3 gap-2 place-items-center">
                                <SidebarBtnElement formElement={FormElements.FileField} />
                                <SidebarBtnElement formElement={FormElements.SignatureField} />
                                <SidebarBtnElement formElement={FormElements.VerificationField} />
                                <SidebarBtnElement formElement={FormElements.DateField} />
                                <SidebarBtnElement formElement={FormElements.DateRangeField} />
                                <SidebarBtnElement formElement={FormElements.DateTimeField} />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="media" className="border-b-0 mb-2">
                        <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50 rounded-lg py-3">
                            <span className="text-sm font-semibold">Mídia & Layout</span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                            <div className="grid grid-cols-3 gap-2 place-items-center">
                                <SidebarBtnElement formElement={FormElements.TitleField} />
                                <SidebarBtnElement formElement={FormElements.ParagraphField} />
                                <SidebarBtnElement formElement={FormElements.RichTextField} />
                                <SidebarBtnElement formElement={FormElements.ImageField} />
                                <SidebarBtnElement formElement={FormElements.VideoField} />
                                <SidebarBtnElement formElement={FormElements.SeparatorField} />
                                <SidebarBtnElement formElement={FormElements.SpacerField} />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
                <div className="pb-10" />
            </ScrollArea>
        </aside>
    )
}
