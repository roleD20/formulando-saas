import { Type, Hash, AlignLeft, CheckSquare, List, LucideIcon, SeparatorHorizontal, Heading1, Pilcrow, CircleDot, User, Mail, Phone, Link as LinkIcon, Image as ImageIcon, Video, Calendar, CalendarClock, CalendarDays, MapPin, UploadCloud, PenTool, Star, ToggleLeft, ShieldCheck } from "lucide-react"
import { MediaUpload } from "./properties/media-upload"
import { FormElementType } from "@/context/builder-context"

export type FormElement = {
    type: FormElementType
    construct: (id: string) => FormElementInstance
    designerBtnElement: {
        icon: LucideIcon
        label: string
    }
    designerComponent: React.FC<{
        elementInstance: FormElementInstance
    }>
    formComponent: React.FC<{
        elementInstance: FormElementInstance
    }>
    propertiesComponent: React.FC<{
        elementInstance: FormElementInstance
    }>
}

export type FormElementInstance = {
    id: string
    type: FormElementType
    extraAttributes?: Record<string, any>
}

type FormElementsType = {
    [key in FormElementType]: FormElement
}


import { useBuilder } from "@/context/builder-context"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
// Import custom OptionsEditor
import { OptionsEditor } from "./properties/options-editor"
// Import RadioGroup related (using absolute path to avoid build error? No, relative is fine if correct)
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Reusable Properties Component wrapper to include OptionsEditor
function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const { updateElement } = useBuilder()

    const setExtraAttributes = (key: string, value: any) => {
        updateElement(elementInstance.id, {
            ...elementInstance,
            extraAttributes: {
                ...elementInstance.extraAttributes,
                [key]: value,
            }
        })
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-2">
                <Label>Rótulo (Label)</Label>
                <Input
                    placeholder="Rótulo do campo"
                    value={elementInstance.extraAttributes?.label}
                    onChange={(e) => setExtraAttributes("label", e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Placeholder</Label>
                <Input
                    placeholder="Placeholder"
                    value={elementInstance.extraAttributes?.placeHolder}
                    onChange={(e) => setExtraAttributes("placeHolder", e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Texto de Ajuda</Label>
                <Input
                    placeholder="Texto de ajuda"
                    value={elementInstance.extraAttributes?.helperText}
                    onChange={(e) => setExtraAttributes("helperText", e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label>Obrigatório</Label>
                    <div className="text-[0.8rem] text-muted-foreground">
                        O usuário deve preencher este campo.
                    </div>
                </div>
                <Switch
                    checked={elementInstance.extraAttributes?.required}
                    onCheckedChange={(checked) => setExtraAttributes("required", checked)}
                />
            </div>

            {/* Render options editor if the element supports 'options' */}
            {elementInstance.extraAttributes?.options && (
                <div className="border rounded-md p-4 bg-muted/10">
                    <OptionsEditor elementInstance={elementInstance} />
                </div>
            )}
        </div>
    )
}

const TextFieldFormElement: FormElement = {
    type: "TextField",
    construct: (id: string) => ({
        id,
        type: "TextField",
        extraAttributes: {
            label: "Texto Curto",
            helperText: "Texto de ajuda",
            required: false,
            placeHolder: "Valor aqui",
        },
    }),
    designerBtnElement: {
        icon: Type,
        label: "Texto",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full pointer-events-none">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {elementInstance.extraAttributes?.label}
                {elementInstance.extraAttributes?.required && "*"}
            </label>
            <input className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" readOnly disabled placeholder={elementInstance.extraAttributes?.placeHolder} />
            {elementInstance.extraAttributes?.helperText && (
                <p className="text-[0.8rem] text-muted-foreground">{elementInstance.extraAttributes?.helperText}</p>
            )}
        </div>
    ),
    formComponent: ({ elementInstance }) => {
        const { label, required, placeHolder, helperText } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full mb-4">
                <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", elementInstance.extraAttributes?.error && "text-destructive")}>
                    {label}
                    {required && "*"}
                </label>
                <Input
                    name={elementInstance.id}
                    className={cn(elementInstance.extraAttributes?.error && "border-destructive")}
                    placeholder={placeHolder}
                    required={required}
                />
                {helperText && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", elementInstance.extraAttributes?.error && "text-destructive")}>{helperText}</p>
                )}
                {elementInstance.extraAttributes?.error && (
                    <p className="text-[0.8rem] text-destructive">Campo obrigatório</p>
                )}
            </div>
        )
    },
    propertiesComponent: PropertiesComponent
}

const NumberFieldFormElement: FormElement = {
    type: "NumberField",
    construct: (id: string) => ({
        id,
        type: "NumberField",
        extraAttributes: {
            label: "Número",
            helperText: "Ajuda",
            required: false,
            placeHolder: "0",
        },
    }),
    designerBtnElement: {
        icon: Hash,
        label: "Número",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full pointer-events-none">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {elementInstance.extraAttributes?.label}
                {elementInstance.extraAttributes?.required && "*"}
            </label>
            <input type="number" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" readOnly disabled placeholder={elementInstance.extraAttributes?.placeHolder} />
            {elementInstance.extraAttributes?.helperText && (
                <p className="text-[0.8rem] text-muted-foreground">{elementInstance.extraAttributes?.helperText}</p>
            )}
        </div>
    ),
    formComponent: ({ elementInstance }) => {
        const { label, required, placeHolder, helperText } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full mb-4">
                <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", elementInstance.extraAttributes?.error && "text-destructive")}>
                    {label}
                    {required && "*"}
                </label>
                <Input
                    name={elementInstance.id}
                    type="number"
                    className={cn(elementInstance.extraAttributes?.error && "border-destructive")}
                    placeholder={placeHolder}
                    required={required}
                />
                {helperText && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", elementInstance.extraAttributes?.error && "text-destructive")}>{helperText}</p>
                )}
                {elementInstance.extraAttributes?.error && (
                    <p className="text-[0.8rem] text-destructive">Campo obrigatório</p>
                )}
            </div>
        )
    },
    propertiesComponent: PropertiesComponent
}

// --- LAYOUT ELEMENTS ---

const TitleFieldFormElement: FormElement = {
    type: "TitleField",
    construct: (id: string) => ({
        id,
        type: "TitleField",
        extraAttributes: {
            title: "Título do Formulário",
        },
    }),
    designerBtnElement: {
        icon: Type,
        label: "Título",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full">
            <Label className="text-xl font-bold">{elementInstance.extraAttributes?.title}</Label>
        </div>
    ),
    formComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full mb-4">
            <h1 className="text-2xl font-bold">{elementInstance.extraAttributes?.title}</h1>
        </div>
    ),
    propertiesComponent: ({ elementInstance }) => {
        const { updateElement } = useBuilder()
        return (
            <div className="flex flex-col gap-2">
                <Label>Título</Label>
                <Input
                    value={elementInstance.extraAttributes?.title}
                    onChange={(e) => updateElement(elementInstance.id, {
                        ...elementInstance,
                        extraAttributes: { title: e.target.value }
                    })}
                />
            </div>
        )
    }
}

const ParagraphFieldFormElement: FormElement = {
    type: "ParagraphField",
    construct: (id: string) => ({
        id,
        type: "ParagraphField",
        extraAttributes: {
            text: "Texto do parágrafo aqui",
        },
    }),
    designerBtnElement: {
        icon: AlignLeft,
        label: "Parágrafo",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full">
            <p className="text-muted-foreground">{elementInstance.extraAttributes?.text}</p>
        </div>
    ),
    formComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full mb-4">
            <p className="text-muted-foreground">{elementInstance.extraAttributes?.text}</p>
        </div>
    ),
    propertiesComponent: ({ elementInstance }) => {
        const { updateElement } = useBuilder()
        const { TextArea } = require("@/components/ui/textarea")
        return (
            <div className="flex flex-col gap-2">
                <Label>Texto</Label>
                <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={elementInstance.extraAttributes?.text}
                    onChange={(e) => updateElement(elementInstance.id, {
                        ...elementInstance,
                        extraAttributes: { text: e.target.value }
                    })}
                />
            </div>
        )
    }
}

const CheckboxFieldFormElement: FormElement = {
    type: "Checkbox",
    construct: (id: string) => ({
        id,
        type: "Checkbox",
        extraAttributes: {
            label: "Caixa de Seleção",
            helperText: "Selecione as opções",
            required: false,
            options: ["Opção 1", "Opção 2"],
        },
    }),
    designerBtnElement: {
        icon: CheckSquare,
        label: "Checkbox",
    },
    designerComponent: ({ elementInstance }) => {
        const { label, required, helperText, options } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full pointer-events-none">
                <Label>
                    {label}
                    {required && "*"}
                </Label>
                <div className="flex flex-col gap-2">
                    {options?.map((option: string, i: number) => (
                        <div key={i} className="flex items-center space-x-2">
                            <input type="checkbox" disabled className="h-4 w-4 rounded border-gray-300" />
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
                {helperText && (
                    <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>
                )}
            </div>
        )
    },
    formComponent: ({ elementInstance }) => {
        const { label, required, helperText, options } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full mb-4">
                <Label className={cn(elementInstance.extraAttributes?.error && "text-destructive")}>
                    {label}
                    {required && "*"}
                </Label>
                <div className={cn("flex flex-col gap-2 p-3 border rounded-md bg-transparent", elementInstance.extraAttributes?.error && "border-destructive")}>
                    {options?.map((option: string, i: number) => (
                        <div key={i} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name={elementInstance.id}
                                value={option}
                                id={`${elementInstance.id}-${i}`}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <label htmlFor={`${elementInstance.id}-${i}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
                {helperText && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", elementInstance.extraAttributes?.error && "text-destructive")}>{helperText}</p>
                )}
                {elementInstance.extraAttributes?.error && (
                    <p className="text-[0.8rem] text-destructive">Campo obrigatório</p>
                )}
            </div>
        )
    },
    propertiesComponent: PropertiesComponent
}

const SelectFieldFormElement: FormElement = {
    type: "Select",
    construct: (id: string) => ({
        id,
        type: "Select",
        extraAttributes: {
            label: "Seleção",
            helperText: "Escolha uma opção",
            required: false,
            placeHolder: "Selecione...",
            options: ["Opção 1", "Opção 2", "Opção 3"],
        },
    }),
    designerBtnElement: {
        icon: List,
        label: "Seleção",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full pointer-events-none">
            <Label>
                {elementInstance.extraAttributes?.label}
                {elementInstance.extraAttributes?.required && "*"}
            </Label>
            <div className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground text-muted-foreground">
                {elementInstance.extraAttributes?.placeHolder}
                <List className="h-4 w-4 opacity-50" />
            </div>
            {elementInstance.extraAttributes?.helperText && (
                <p className="text-[0.8rem] text-muted-foreground">{elementInstance.extraAttributes?.helperText}</p>
            )}
        </div>
    ),
    formComponent: ({ elementInstance }) => {
        const { label, required, placeHolder, helperText, options } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full mb-4">
                <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", elementInstance.extraAttributes?.error && "text-destructive")}>
                    {label}
                    {required && "*"}
                </label>
                <div className="relative">
                    <select
                        name={elementInstance.id}
                        defaultValue=""
                        className={cn("flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", elementInstance.extraAttributes?.error && "border-destructive")}
                    >
                        <option value="" disabled>{placeHolder}</option>
                        {options?.map((option: string) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                {helperText && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", elementInstance.extraAttributes?.error && "text-destructive")}>{helperText}</p>
                )}
                {elementInstance.extraAttributes?.error && (
                    <p className="text-[0.8rem] text-destructive">Campo obrigatório</p>
                )}
            </div>
        )
    },
    propertiesComponent: PropertiesComponent
}

// Radio Group
const RadioGroupFieldFormElement: FormElement = {
    type: "RadioGroup",
    construct: (id: string) => ({
        id,
        type: "RadioGroup",
        extraAttributes: {
            label: "Botões de Rádio",
            helperText: "Selecione uma",
            required: false,
            options: ["Opção 1", "Opção 2"],
        },
    }),
    designerBtnElement: {
        icon: CircleDot,
        label: "Rádio",
    },
    designerComponent: ({ elementInstance }) => {
        const { label, required, helperText, options } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full pointer-events-none">
                <Label>
                    {label}
                    {required && "*"}
                </Label>
                <div className="flex flex-col gap-2">
                    {options?.map((option: string, i: number) => (
                        <div key={i} className="flex items-center space-x-2">
                            <div className="h-4 w-4 rounded-full border border-primary" />
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
                {helperText && (
                    <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>
                )}
            </div>
        )
    },
    formComponent: ({ elementInstance }) => {
        const { label, required, helperText, options } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full mb-4">
                <Label className={cn(elementInstance.extraAttributes?.error && "text-destructive")}>
                    {label}
                    {required && "*"}
                </Label>
                <RadioGroup name={elementInstance.id} className={cn("flex flex-col space-y-1", elementInstance.extraAttributes?.error && "p-2 border border-destructive rounded-md")}>
                    {options?.map((option: string) => (
                        <div key={option} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`${elementInstance.id}-${option}`} />
                            <Label htmlFor={`${elementInstance.id}-${option}`}>{option}</Label>
                        </div>
                    ))}
                </RadioGroup>
                {helperText && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", elementInstance.extraAttributes?.error && "text-destructive")}>{helperText}</p>
                )}
                {elementInstance.extraAttributes?.error && (
                    <p className="text-[0.8rem] text-destructive">Campo obrigatório</p>
                )}
            </div>
        )
    },
    propertiesComponent: PropertiesComponent
}

const TextAreaFormElement: FormElement = {
    type: "TextArea",
    construct: (id: string) => ({
        id,
        type: "TextArea",
        extraAttributes: {
            label: "Área de Texto",
            helperText: "Descreva em detalhes",
            required: false,
            placeHolder: "Digite aqui...",
            rows: 3,
        },
    }),
    designerBtnElement: {
        icon: AlignLeft,
        label: "Texto Longo",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full pointer-events-none">
            <Label>
                {elementInstance.extraAttributes?.label}
                {elementInstance.extraAttributes?.required && "*"}
            </Label>
            <textarea
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                readOnly disabled
                placeholder={elementInstance.extraAttributes?.placeHolder}
            />
            {elementInstance.extraAttributes?.helperText && (
                <p className="text-[0.8rem] text-muted-foreground">{elementInstance.extraAttributes?.helperText}</p>
            )}
        </div>
    ),
    formComponent: ({ elementInstance }) => {
        const { label, required, placeHolder, helperText, rows } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full mb-4">
                <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", elementInstance.extraAttributes?.error && "text-destructive")}>
                    {label}
                    {required && "*"}
                </label>
                <textarea
                    name={elementInstance.id}
                    className={cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", elementInstance.extraAttributes?.error && "border-destructive")}
                    placeholder={placeHolder}
                    required={required}
                    rows={rows}
                />
                {helperText && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", elementInstance.extraAttributes?.error && "text-destructive")}>{helperText}</p>
                )}
                {elementInstance.extraAttributes?.error && (
                    <p className="text-[0.8rem] text-destructive">Campo obrigatório</p>
                )}
            </div>
        )
    },
    propertiesComponent: PropertiesComponent
}

const SeparatorFieldFormElement: FormElement = {
    type: "SeparatorField",
    construct: (id: string) => ({
        id,
        type: "SeparatorField",
        extraAttributes: {
        },
    }),
    designerBtnElement: {
        icon: SeparatorHorizontal,
        label: "Divisor",
    },
    designerComponent: () => (
        <div className="flex flex-col gap-2 w-full">
            <Label className="text-muted-foreground">Divisor</Label>
            <div className="border-t w-full" />
        </div>
    ),
    formComponent: () => <div className="border-t w-full my-4" />,
    propertiesComponent: () => <div className="p-2 text-muted-foreground">Sem propriedades</div>
}

const SpacerFieldFormElement: FormElement = {
    type: "SpacerField",
    construct: (id: string) => ({
        id,
        type: "SpacerField",
        extraAttributes: {
            height: 20, // px
        },
    }),
    designerBtnElement: {
        icon: SeparatorHorizontal,
        label: "Espaçador",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full items-center">
            <Label className="text-muted-foreground">Espaçador: {elementInstance.extraAttributes?.height}px</Label>
            <SeparatorHorizontal className="h-8 w-8 rotate-90" />
        </div>
    ),
    formComponent: ({ elementInstance }) => (
        <div style={{ height: elementInstance.extraAttributes?.height, width: "100%" }} />
    ),
    propertiesComponent: ({ elementInstance }) => {
        const { updateElement } = useBuilder()
        return (
            <div className="flex flex-col gap-2">
                <Label>Altura (px)</Label>
                <Input
                    type="number"
                    value={elementInstance.extraAttributes?.height}
                    onChange={(e) => updateElement(elementInstance.id, {
                        ...elementInstance,
                        extraAttributes: { height: Number(e.target.value) }
                    })}
                />
            </div>
        )
    },
}

// --- CONTACT FIELDS ---

const NameFieldFormElement: FormElement = {
    type: "NameField",
    construct: (id: string) => ({
        id,
        type: "NameField",
        extraAttributes: {
            label: "Nome Completo",
            helperText: "Digite seu nome",
            required: true,
            placeHolder: "Seu nome aqui",
        },
    }),
    designerBtnElement: {
        icon: User,
        label: "Nome",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full pointer-events-none">
            <Label>
                {elementInstance.extraAttributes?.label}
                {elementInstance.extraAttributes?.required && "*"}
            </Label>
            <div className="relative">
                <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input className="flex h-9 w-full rounded-md border border-input bg-transparent pl-8 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" readOnly disabled placeholder={elementInstance.extraAttributes?.placeHolder} />
            </div>
            {elementInstance.extraAttributes?.helperText && (
                <p className="text-[0.8rem] text-muted-foreground">{elementInstance.extraAttributes?.helperText}</p>
            )}
        </div>
    ),
    formComponent: ({ elementInstance }) => {
        const { label, required, placeHolder, helperText } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full mb-4">
                <Label className={cn(elementInstance.extraAttributes?.error && "text-destructive")}>
                    {label}
                    {required && "*"}
                </Label>
                <div className="relative">
                    <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        name={elementInstance.id}
                        className={cn("pl-8", elementInstance.extraAttributes?.error && "border-destructive")}
                        placeholder={placeHolder}
                        required={required}
                    />
                </div>
                {helperText && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", elementInstance.extraAttributes?.error && "text-destructive")}>{helperText}</p>
                )}
                {elementInstance.extraAttributes?.error && (
                    <p className="text-[0.8rem] text-destructive">Campo obrigatório</p>
                )}
            </div>
        )
    },
    propertiesComponent: PropertiesComponent
}

const EmailFieldFormElement: FormElement = {
    type: "EmailField",
    construct: (id: string) => ({
        id,
        type: "EmailField",
        extraAttributes: {
            label: "E-mail",
            helperText: "Digite seu e-mail",
            required: true,
            placeHolder: "seu@email.com",
        },
    }),
    designerBtnElement: {
        icon: Mail,
        label: "E-mail",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full pointer-events-none">
            <Label>
                {elementInstance.extraAttributes?.label}
                {elementInstance.extraAttributes?.required && "*"}
            </Label>
            <div className="relative">
                <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input className="flex h-9 w-full rounded-md border border-input bg-transparent pl-8 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" readOnly disabled placeholder={elementInstance.extraAttributes?.placeHolder} />
            </div>
            {elementInstance.extraAttributes?.helperText && (
                <p className="text-[0.8rem] text-muted-foreground">{elementInstance.extraAttributes?.helperText}</p>
            )}
        </div>
    ),
    formComponent: ({ elementInstance }) => {
        const { label, required, placeHolder, helperText } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full mb-4">
                <Label className={cn(elementInstance.extraAttributes?.error && "text-destructive")}>
                    {label}
                    {required && "*"}
                </Label>
                <div className="relative">
                    <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="email"
                        name={elementInstance.id}
                        className={cn("pl-8", elementInstance.extraAttributes?.error && "border-destructive")}
                        placeholder={placeHolder}
                        required={required}
                    />
                </div>
                {helperText && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", elementInstance.extraAttributes?.error && "text-destructive")}>{helperText}</p>
                )}
                {elementInstance.extraAttributes?.error && (
                    <p className="text-[0.8rem] text-destructive">E-mail inválido ou obrigatório</p>
                )}
            </div>
        )
    },
    propertiesComponent: PropertiesComponent
}

// Simple phone mask function
const formatPhone = (value: string) => {
    if (!value) return ""
    value = value.replace(/\D/g, "")
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2")
    value = value.replace(/(\d)(\d{4})$/, "$1-$2")
    return value
}

const PhoneFieldFormElement: FormElement = {
    type: "PhoneField",
    construct: (id: string) => ({
        id,
        type: "PhoneField",
        extraAttributes: {
            label: "Telefone",
            helperText: "Digite seu número",
            required: true,
            placeHolder: "(00) 00000-0000",
        },
    }),
    designerBtnElement: {
        icon: Phone,
        label: "Telefone",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full pointer-events-none">
            <Label>
                {elementInstance.extraAttributes?.label}
                {elementInstance.extraAttributes?.required && "*"}
            </Label>
            <div className="relative">
                <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input className="flex h-9 w-full rounded-md border border-input bg-transparent pl-8 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" readOnly disabled placeholder={elementInstance.extraAttributes?.placeHolder} />
            </div>
            {elementInstance.extraAttributes?.helperText && (
                <p className="text-[0.8rem] text-muted-foreground">{elementInstance.extraAttributes?.helperText}</p>
            )}
        </div>
    ),
    formComponent: ({ elementInstance }) => {
        const { label, required, placeHolder, helperText } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full mb-4">
                <Label className={cn(elementInstance.extraAttributes?.error && "text-destructive")}>
                    {label}
                    {required && "*"}
                </Label>
                <div className="relative">
                    <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        name={elementInstance.id}
                        className={cn("pl-8", elementInstance.extraAttributes?.error && "border-destructive")}
                        placeholder={placeHolder}
                        required={required}
                        onInput={(e) => {
                            const input = e.target as HTMLInputElement
                            input.value = formatPhone(input.value)
                        }}
                        maxLength={15} // (11) 91234-5678 = 15 chars
                    />
                </div>
                {helperText && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", elementInstance.extraAttributes?.error && "text-destructive")}>{helperText}</p>
                )}
                {elementInstance.extraAttributes?.error && (
                    <p className="text-[0.8rem] text-destructive">Telefone obrigatório</p>
                )}
            </div>
        )
    },
    propertiesComponent: PropertiesComponent
}

const UrlFieldFormElement: FormElement = {
    type: "UrlField",
    construct: (id: string) => ({
        id,
        type: "UrlField",
        extraAttributes: {
            label: "Site / Link",
            helperText: "Digite a URL",
            required: false,
            placeHolder: "https://",
        },
    }),
    designerBtnElement: {
        icon: LinkIcon,
        label: "URL",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full pointer-events-none">
            <Label>
                {elementInstance.extraAttributes?.label}
                {elementInstance.extraAttributes?.required && "*"}
            </Label>
            <div className="relative">
                <LinkIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input className="flex h-9 w-full rounded-md border border-input bg-transparent pl-8 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" readOnly disabled placeholder={elementInstance.extraAttributes?.placeHolder} />
            </div>
            {elementInstance.extraAttributes?.helperText && (
                <p className="text-[0.8rem] text-muted-foreground">{elementInstance.extraAttributes?.helperText}</p>
            )}
        </div>
    ),
    formComponent: ({ elementInstance }) => {
        const { label, required, placeHolder, helperText } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full mb-4">
                <Label className={cn(elementInstance.extraAttributes?.error && "text-destructive")}>
                    {label}
                    {required && "*"}
                </Label>
                <div className="relative">
                    <LinkIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="url"
                        name={elementInstance.id}
                        className={cn("pl-8", elementInstance.extraAttributes?.error && "border-destructive")}
                        placeholder={placeHolder}
                        required={required}
                    />
                </div>
                {helperText && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", elementInstance.extraAttributes?.error && "text-destructive")}>{helperText}</p>
                )}
                {elementInstance.extraAttributes?.error && (
                    <p className="text-[0.8rem] text-destructive">URL inválida ou obrigatória</p>
                )}
            </div>
        )
    },
    propertiesComponent: PropertiesComponent
}

// --- CONTENT MEDIA FIELDS ---

const ImageFieldFormElement: FormElement = {
    type: "ImageField",
    construct: (id: string) => ({
        id,
        type: "ImageField",
        extraAttributes: {
            // For static content, the 'label' is internal for the builder/accessibility
            label: "Imagem",
            url: "",
            altText: "Imagem do formulário",
        },
    }),
    designerBtnElement: {
        icon: ImageIcon,
        label: "Imagem",
    },
    designerComponent: ({ elementInstance }) => {
        const { url, altText } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full items-center justify-center p-4 border border-dashed rounded-md bg-muted/20">
                <Label className="text-muted-foreground mr-auto">Imagem</Label>
                {url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt={altText} className="max-h-[200px] w-auto object-contain rounded-md shadow-sm" />
                ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                        <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
                        <span className="text-xs">Arraste para editar e adicionar imagem</span>
                    </div>
                )}
            </div>
        )
    },
    formComponent: ({ elementInstance }) => {
        const { url, altText } = elementInstance.extraAttributes || {}
        if (!url) return null
        return (
            <div className="w-full flex justify-center mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={altText} className="max-w-full h-auto rounded-lg shadow-md" />
            </div>
        )
    },
    propertiesComponent: ({ elementInstance }) => {
        const { updateElement } = useBuilder()
        const { MediaUpload } = require("./properties/media-upload") // Dynamic import to avoid cycles? No, static should work but let's try standard.
        // Actually, imports at top file are better. I'll rely on top-level imports.
        // But I need to adding the import to the top of the file in the previous/next step.

        return (
            <div className="flex flex-col gap-4">
                <Label>Propriedades da Imagem</Label>
                <MediaUpload
                    type="image"
                    label="Upload de Imagem"
                    value={elementInstance.extraAttributes?.url}
                    onChange={(url: string) => updateElement(elementInstance.id, {
                        ...elementInstance,
                        extraAttributes: { ...elementInstance.extraAttributes, url }
                    })}
                />
                <div className="flex flex-col gap-2">
                    <Label>Texto Alternativo (Alt)</Label>
                    <Input
                        value={elementInstance.extraAttributes?.altText}
                        onChange={(e) => updateElement(elementInstance.id, {
                            ...elementInstance,
                            extraAttributes: { ...elementInstance.extraAttributes, altText: e.target.value }
                        })}
                    />
                </div>
            </div>
        )
    }
}

const VideoFieldFormElement: FormElement = {
    type: "VideoField",
    construct: (id: string) => ({
        id,
        type: "VideoField",
        extraAttributes: {
            label: "Vídeo",
            url: "",
        },
    }),
    designerBtnElement: {
        icon: Video,
        label: "Vídeo",
    },
    designerComponent: ({ elementInstance }) => {
        const { url } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full items-center justify-center p-4 border border-dashed rounded-md bg-muted/20">
                <Label className="text-muted-foreground mr-auto">Vídeo</Label>
                {url ? (
                    <div className="relative w-full aspect-video bg-black rounded-md flex items-center justify-center text-white">
                        <Video className="h-12 w-12" />
                        <span className="absolute bottom-2 text-xs opacity-70">Preview não disponível no editor</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                        <Video className="h-12 w-12 mb-2 opacity-50" />
                        <span className="text-xs">Selecione para adicionar vídeo</span>
                    </div>
                )}
            </div>
        )
    },
    formComponent: ({ elementInstance }) => {
        const { url } = elementInstance.extraAttributes || {}
        if (!url) return null
        return (
            <div className="w-full mb-6">
                <video src={url} controls className="w-full rounded-lg shadow-md aspect-video bg-black" />
            </div>
        )
    },
    propertiesComponent: ({ elementInstance }) => {
        const { updateElement } = useBuilder()
        const { MediaUpload } = require("./properties/media-upload")

        return (
            <div className="flex flex-col gap-4">
                <Label>Propriedades do Vídeo</Label>
                <MediaUpload
                    type="video"
                    label="Upload de Vídeo"
                    value={elementInstance.extraAttributes?.url}
                    onChange={(url: string) => updateElement(elementInstance.id, {
                        ...elementInstance,
                        extraAttributes: { ...elementInstance.extraAttributes, url }
                    })}
                />
            </div>
        )
    }
}


// --- DATE & TIME FIELDS ---

const DateFieldFormElement: FormElement = {
    type: "DateField",
    construct: (id: string) => ({
        id,
        type: "DateField",
        extraAttributes: {
            label: "Data",
            helperText: "Selecione uma data",
            required: true,
        },
    }),
    designerBtnElement: {
        icon: Calendar,
        label: "Data",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full pointer-events-none">
            <Label>
                {elementInstance.extraAttributes?.label}
                {elementInstance.extraAttributes?.required && "*"}
            </Label>
            <Input type="date" disabled className="w-full" />
            {elementInstance.extraAttributes?.helperText && (
                <p className="text-[0.8rem] text-muted-foreground">{elementInstance.extraAttributes?.helperText}</p>
            )}
        </div>
    ),
    formComponent: ({ elementInstance }) => {
        const { label, required, helperText } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full mb-4">
                <Label className={cn(elementInstance.extraAttributes?.error && "text-destructive")}>
                    {label}
                    {required && "*"}
                </Label>
                <Input
                    type="date"
                    name={elementInstance.id}
                    className={cn(elementInstance.extraAttributes?.error && "border-destructive")}
                    required={required}
                />
                {helperText && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", elementInstance.extraAttributes?.error && "text-destructive")}>{helperText}</p>
                )}
                {elementInstance.extraAttributes?.error && (
                    <p className="text-[0.8rem] text-destructive">Data obrigatória</p>
                )}
            </div>
        )
    },
    propertiesComponent: PropertiesComponent
}

const DateRangeFieldFormElement: FormElement = {
    type: "DateRangeField",
    construct: (id: string) => ({
        id,
        type: "DateRangeField",
        extraAttributes: {
            label: "Período",
            helperText: "Selecione o período",
            required: true,
        },
    }),
    designerBtnElement: {
        icon: CalendarDays,
        label: "Período",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full pointer-events-none">
            <Label>
                {elementInstance.extraAttributes?.label}
                {elementInstance.extraAttributes?.required && "*"}
            </Label>
            <div className="flex gap-2">
                <Input type="date" disabled className="w-full" placeholder="Início" />
                <Input type="date" disabled className="w-full" placeholder="Fim" />
            </div>
            {elementInstance.extraAttributes?.helperText && (
                <p className="text-[0.8rem] text-muted-foreground">{elementInstance.extraAttributes?.helperText}</p>
            )}
        </div>
    ),
    formComponent: ({ elementInstance }) => {
        const { label, required, helperText } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full mb-4">
                <Label className={cn(elementInstance.extraAttributes?.error && "text-destructive")}>
                    {label}
                    {required && "*"}
                </Label>
                <div className="flex gap-2">
                    <Input
                        type="date"
                        name={`${elementInstance.id}_start`}
                        className={cn(elementInstance.extraAttributes?.error && "border-destructive")}
                        required={required}
                    />
                    <Input
                        type="date"
                        name={`${elementInstance.id}_end`}
                        className={cn(elementInstance.extraAttributes?.error && "border-destructive")}
                        required={required}
                    />
                </div>
                {helperText && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", elementInstance.extraAttributes?.error && "text-destructive")}>{helperText}</p>
                )}
                {elementInstance.extraAttributes?.error && (
                    <p className="text-[0.8rem] text-destructive">Período obrigatório</p>
                )}
            </div>
        )
    },
    propertiesComponent: PropertiesComponent
}

const DateTimeFieldFormElement: FormElement = {
    type: "DateTimeField",
    construct: (id: string) => ({
        id,
        type: "DateTimeField",
        extraAttributes: {
            label: "Data e Hora",
            helperText: "Selecione data e hora",
            required: true,
        },
    }),
    designerBtnElement: {
        icon: CalendarClock,
        label: "Data e Hora",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full pointer-events-none">
            <Label>
                {elementInstance.extraAttributes?.label}
                {elementInstance.extraAttributes?.required && "*"}
            </Label>
            <Input type="datetime-local" disabled className="w-full" />
            {elementInstance.extraAttributes?.helperText && (
                <p className="text-[0.8rem] text-muted-foreground">{elementInstance.extraAttributes?.helperText}</p>
            )}
        </div>
    ),
    formComponent: ({ elementInstance }) => {
        const { label, required, helperText } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full mb-4">
                <Label className={cn(elementInstance.extraAttributes?.error && "text-destructive")}>
                    {label}
                    {required && "*"}
                </Label>
                <Input
                    type="datetime-local"
                    name={elementInstance.id}
                    className={cn(elementInstance.extraAttributes?.error && "border-destructive")}
                    required={required}
                />
                {helperText && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", elementInstance.extraAttributes?.error && "text-destructive")}>{helperText}</p>
                )}
                {elementInstance.extraAttributes?.error && (
                    <p className="text-[0.8rem] text-destructive">Data e Hora obrigatórias</p>
                )}
            </div>
        )
    },
    propertiesComponent: PropertiesComponent
}

// --- SPECIAL FIELDS ---

// CEP Mask helper
const formatCEP = (value: string) => {
    return value
        .replace(/\D/g, "")
        .replace(/^(\d{5})(\d)/, "$1-$2")
        .substr(0, 9);
};

const AddressFieldFormElement: FormElement = {
    type: "AddressField",
    construct: (id: string) => ({
        id,
        type: "AddressField",
        extraAttributes: {
            label: "Endereço",
            helperText: "Preencha o endereço completo",
            required: true,
        },
    }),
    designerBtnElement: {
        icon: MapPin,
        label: "Endereço",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full pointer-events-none">
            <Label>{elementInstance.extraAttributes?.label}</Label>
            <div className="grid grid-cols-1 gap-2">
                <Input placeholder="Rua" disabled />
                <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Número" disabled />
                    <Input placeholder="Cidade" disabled />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Estado" disabled />
                    <Input placeholder="CEP" disabled />
                </div>
            </div>
            {elementInstance.extraAttributes?.helperText && (
                <p className="text-[0.8rem] text-muted-foreground">{elementInstance.extraAttributes?.helperText}</p>
            )}
        </div>
    ),
    formComponent: ({ elementInstance }) => {
        const { label, required, helperText } = elementInstance.extraAttributes || {}
        // We need local state for the mask to work properly in a controlled/uncontrolled hybrid if we were fully React,
        // but here formComponent renders inside a form generator usually.
        // However, these inputs are uncontrolled by default in this setup (using name prop for submission).
        // To apply a mask we need to intercept onChange.

        return (
            <div className="flex flex-col gap-2 w-full mb-4">
                <Label className={cn(elementInstance.extraAttributes?.error && "text-destructive")}>
                    {label}
                    {required && "*"}
                </Label>
                <div className="grid grid-cols-1 gap-2">
                    <Input
                        name={`${elementInstance.id}_street`}
                        placeholder="Rua"
                        required={required}
                        className={cn(elementInstance.extraAttributes?.error && "border-destructive")}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            name={`${elementInstance.id}_number`}
                            placeholder="Número"
                            required={required}
                            className={cn(elementInstance.extraAttributes?.error && "border-destructive")}
                        />
                        <Input
                            name={`${elementInstance.id}_city`}
                            placeholder="Cidade"
                            required={required}
                            className={cn(elementInstance.extraAttributes?.error && "border-destructive")}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            name={`${elementInstance.id}_state`}
                            placeholder="Estado"
                            required={required}
                            className={cn(elementInstance.extraAttributes?.error && "border-destructive")}
                        />
                        <Input
                            name={`${elementInstance.id}_zip`}
                            placeholder="CEP"
                            required={required}
                            maxLength={9}
                            className={cn(elementInstance.extraAttributes?.error && "border-destructive")}
                            onChange={(e) => {
                                e.target.value = formatCEP(e.target.value);
                            }}
                        />
                    </div>
                </div>
                {helperText && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", elementInstance.extraAttributes?.error && "text-destructive")}>{helperText}</p>
                )}
                {elementInstance.extraAttributes?.error && (
                    <p className="text-[0.8rem] text-destructive">Endereço obrigatório</p>
                )}
            </div>
        )
    },
    propertiesComponent: PropertiesComponent
}

const FileFieldFormElement: FormElement = {
    type: "FileField",
    construct: (id: string) => ({
        id,
        type: "FileField",
        extraAttributes: {
            label: "Upload de Arquivo",
            helperText: "Selecione um arquivo",
            required: true,
            allowedTypes: ".pdf, .doc, .docx, .png, .jpg",
            maxSize: 5, // MB
        },
    }),
    designerBtnElement: {
        icon: UploadCloud,
        label: "Arquivo",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full pointer-events-none">
            <Label>{elementInstance.extraAttributes?.label}</Label>
            <div className="border-2 border-dashed border-input rounded-md p-10 flex flex-col items-center justify-center text-muted-foreground bg-muted/50">
                <UploadCloud className="h-10 w-10 mb-2" />
                <p>Clique para fazer upload</p>
                <p className="text-xs mt-1">
                    Max: {elementInstance.extraAttributes?.maxSize}MB
                </p>
            </div>
            {elementInstance.extraAttributes?.helperText && (
                <p className="text-[0.8rem] text-muted-foreground">{elementInstance.extraAttributes?.helperText}</p>
            )}
        </div>
    ),
    formComponent: ({ elementInstance }) => {
        const { label, required, helperText, allowedTypes, maxSize } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full mb-4">
                <Label className={cn(elementInstance.extraAttributes?.error && "text-destructive")}>
                    {label}
                    {required && "*"}
                </Label>
                <div className="border-2 border-dashed border-input rounded-md p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer relative">
                    <Input
                        type="file"
                        name={elementInstance.id}
                        required={required}
                        accept={allowedTypes}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        onChange={(e) => {
                            // Basic logic for file size validation could go here, for now it's just UI
                            const file = e.target.files?.[0];
                            if (file && file.size > maxSize * 1024 * 1024) {
                                alert(`Arquivo muito grande! Máximo: ${maxSize}MB`);
                                e.target.value = "";
                            }
                        }}
                    />
                    <UploadCloud className="h-8 w-8 mb-2" />
                    <p>Clique ou arraste arquivo</p>
                    <p className="text-xs mt-1 text-center">
                        Tipos: {allowedTypes} <br />
                        Max: {maxSize}MB
                    </p>
                </div>
                {helperText && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", elementInstance.extraAttributes?.error && "text-destructive")}>{helperText}</p>
                )}
                {elementInstance.extraAttributes?.error && (
                    <p className="text-[0.8rem] text-destructive">Arquivo obrigatório</p>
                )}
            </div>
        )
    },
    propertiesComponent: ({ elementInstance }) => {
        const { updateElement } = useBuilder()
        return (
            <div className="flex flex-col gap-4">
                <PropertiesComponent elementInstance={elementInstance} />
                <div className="flex flex-col gap-2">
                    <Label>Tipos Permitidos (extensões)</Label>
                    <Input
                        value={elementInstance.extraAttributes?.allowedTypes}
                        onChange={(e) => updateElement(elementInstance.id, {
                            ...elementInstance,
                            extraAttributes: { ...elementInstance.extraAttributes, allowedTypes: e.target.value }
                        })}
                        placeholder=".pdf, .png, .jpg"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Tamanho Máximo (MB)</Label>
                    <Input
                        type="number"
                        value={elementInstance.extraAttributes?.maxSize}
                        onChange={(e) => updateElement(elementInstance.id, {
                            ...elementInstance,
                            extraAttributes: { ...elementInstance.extraAttributes, maxSize: Number(e.target.value) }
                        })}
                    />
                </div>
            </div>
        )
    }
}

// Need to dyn import react-signature-canvas for SSR
import SignatureCanvas from "react-signature-canvas"

const SignatureFieldFormElement: FormElement = {
    type: "SignatureField",
    construct: (id: string) => ({
        id,
        type: "SignatureField",
        extraAttributes: {
            label: "Assinatura",
            helperText: "Assine acima",
            required: true,
        },
    }),
    designerBtnElement: {
        icon: PenTool,
        label: "Assinatura",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full pointer-events-none">
            <Label>{elementInstance.extraAttributes?.label}</Label>
            <div className="border rounded-md h-[100px] w-full bg-muted/20 flex items-center justify-center text-muted-foreground">
                <span className="text-sm">Área de assinatura</span>
            </div>
            {elementInstance.extraAttributes?.helperText && (
                <p className="text-[0.8rem] text-muted-foreground">{elementInstance.extraAttributes?.helperText}</p>
            )}
        </div>
    ),
    formComponent: ({ elementInstance }) => {
        const { label, required, helperText } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full mb-4">
                <Label className={cn(elementInstance.extraAttributes?.error && "text-destructive")}>
                    {label}
                    {required && "*"}
                </Label>
                <div className={cn("border rounded-md h-[150px] w-full bg-background relative overflow-hidden", elementInstance.extraAttributes?.error && "border-destructive")}>
                    {/* In a real form submission, we'd need to capture ref and export to data on submit */}
                    <SignatureCanvas
                        penColor="black"
                        canvasProps={{ className: "w-full h-full" }}
                        clearOnResize={false}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-muted-foreground pointer-events-none opacity-50">
                        Assine aqui
                    </div>
                </div>
                {helperText && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", elementInstance.extraAttributes?.error && "text-destructive")}>{helperText}</p>
                )}
                {elementInstance.extraAttributes?.error && (
                    <p className="text-[0.8rem] text-destructive">Assinatura obrigatória</p>
                )}
            </div>
        )
    },
    propertiesComponent: PropertiesComponent
}

// --- INTERACTION FIELDS ---

const StarRatingFieldFormElement: FormElement = {
    type: "StarRatingField",
    construct: (id: string) => ({
        id,
        type: "StarRatingField",
        extraAttributes: {
            label: "Avaliação com Estrelas",
            helperText: "Selecione uma avaliação",
            required: true,
        },
    }),
    designerBtnElement: {
        icon: Star,
        label: "Avaliação",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full pointer-events-none">
            <Label>{elementInstance.extraAttributes?.label}</Label>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((idx) => (
                    <Star key={idx} className="h-6 w-6 text-muted-foreground" />
                ))}
            </div>
            {elementInstance.extraAttributes?.helperText && (
                <p className="text-[0.8rem] text-muted-foreground">{elementInstance.extraAttributes?.helperText}</p>
            )}
        </div>
    ),
    formComponent: ({ elementInstance }) => {
        const { label, required, helperText } = elementInstance.extraAttributes || {}
        // Simulating state for visual feedback in builder/preview if we wanted, but keeping simple for now
        // Normally you'd use a useState here, but formComponent inside generator
        return (
            <div className="flex flex-col gap-2 w-full mb-4">
                <Label className={cn(elementInstance.extraAttributes?.error && "text-destructive")}>
                    {label}
                    {required && "*"}
                </Label>
                <div className="flex gap-1 group">
                    {[1, 2, 3, 4, 5].map((idx) => (
                        <div key={idx} className="relative cursor-pointer">
                            <input
                                type="radio"
                                name={elementInstance.id}
                                value={idx}
                                className="peer opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                                required={required}
                            />
                            <Star className="h-8 w-8 text-muted-foreground hover:fill-yellow-400 hover:text-yellow-400 peer-checked:fill-yellow-400 peer-checked:text-yellow-400 transition-colors" />
                        </div>
                    ))}
                    {/* Note: pure CSS star rating logic is tricky without reversing order or JS, simplified here */}
                </div>
                {helperText && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", elementInstance.extraAttributes?.error && "text-destructive")}>{helperText}</p>
                )}
                {elementInstance.extraAttributes?.error && (
                    <p className="text-[0.8rem] text-destructive">Avaliação obrigatória</p>
                )}
            </div>
        )
    },
    propertiesComponent: PropertiesComponent
}

const OpinionScaleFieldFormElement: FormElement = {
    type: "OpinionScaleField",
    construct: (id: string) => ({
        id,
        type: "OpinionScaleField",
        extraAttributes: {
            label: "Escala de Opinião",
            helperText: "Selecione uma nota",
            required: true,
        },
    }),
    designerBtnElement: {
        icon: List, // Using List as placeholder for ordered list icon if ListOrdered not avail, user screenshot shows ::
        label: "Escala",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full pointer-events-none">
            <Label>{elementInstance.extraAttributes?.label}</Label>
            <div className="flex justify-between items-end w-full max-w-[400px]">
                <span className="text-xs text-muted-foreground mb-4">Mínimo</span>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                        <div key={val} className="h-10 w-10 flex items-center justify-center border rounded-md bg-transparent">
                            {val}
                        </div>
                    ))}
                </div>
                <span className="text-xs text-muted-foreground mb-4">Máximo</span>
            </div>
            {elementInstance.extraAttributes?.helperText && (
                <p className="text-[0.8rem] text-muted-foreground">{elementInstance.extraAttributes?.helperText}</p>
            )}
        </div>
    ),
    formComponent: ({ elementInstance }) => {
        const { label, required, helperText } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full mb-4">
                <Label className={cn(elementInstance.extraAttributes?.error && "text-destructive")}>
                    {label}
                    {required && "*"}
                </Label>
                <div className="flex flex-wrap justify-between items-end w-full max-w-[500px] gap-2">
                    <span className="text-xs text-muted-foreground mb-3 hidden sm:block">Mínimo</span>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {[1, 2, 3, 4, 5].map((val) => (
                            <div key={val} className="relative">
                                <input
                                    type="radio"
                                    name={elementInstance.id}
                                    value={val}
                                    className="peer opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                                    required={required}
                                />
                                <div className={cn(
                                    "h-10 w-10 flex items-center justify-center border rounded-md transition-all hover:bg-muted peer-checked:bg-primary peer-checked:text-primary-foreground cursor-pointer",
                                    elementInstance.extraAttributes?.error && "border-destructive"
                                )}>
                                    {val}
                                </div>
                            </div>
                        ))}
                    </div>
                    <span className="text-xs text-muted-foreground mb-3 hidden sm:block">Máximo</span>
                </div>
                {helperText && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", elementInstance.extraAttributes?.error && "text-destructive")}>{helperText}</p>
                )}
                {elementInstance.extraAttributes?.error && (
                    <p className="text-[0.8rem] text-destructive">Seleção obrigatória</p>
                )}
            </div>
        )
    },
    propertiesComponent: PropertiesComponent
}

const ToggleFieldFormElement: FormElement = {
    type: "ToggleField",
    construct: (id: string) => ({
        id,
        type: "ToggleField",
        extraAttributes: {
            label: "Alternar",
            helperText: "Selecione a opção",
            required: false,
        },
    }),
    designerBtnElement: {
        icon: ToggleLeft,
        label: "Alternar",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full pointer-events-none">
            <Label>{elementInstance.extraAttributes?.label}</Label>
            <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Não</span>
                <Switch disabled />
                <span className="text-muted-foreground">Sim</span>
            </div>
            {elementInstance.extraAttributes?.helperText && (
                <p className="text-[0.8rem] text-muted-foreground">{elementInstance.extraAttributes?.helperText}</p>
            )}
        </div>
    ),
    formComponent: ({ elementInstance }) => {
        const { label, required, helperText } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full mb-4">
                <Label className={cn(elementInstance.extraAttributes?.error && "text-destructive")}>
                    {label}
                    {required && "*"}
                </Label>
                <div className="flex items-center gap-2">
                    <span className="text-sm">Não</span>
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            name={elementInstance.id}
                            value="true"
                            className="peer opacity-0 absolute w-11 h-6 cursor-pointer z-10"
                        />
                        <div className="h-6 w-11 bg-input rounded-full relative pointer-events-none transition-colors peer-checked:bg-primary peer-checked:[&>div]:translate-x-5">
                            <div className="absolute top-1 left-1 bg-background h-4 w-4 rounded-full transition-transform shadow-sm" />
                        </div>
                    </div>
                    <span className="text-sm">Sim</span>
                </div>
                {helperText && (
                    <p className={cn("text-[0.8rem] text-muted-foreground", elementInstance.extraAttributes?.error && "text-destructive")}>{helperText}</p>
                )}
            </div>
        )
    },
    propertiesComponent: PropertiesComponent
}

import { Checkbox } from "@/components/ui/checkbox"

const VerificationFieldFormElement: FormElement = {
    type: "VerificationField",
    construct: (id: string) => ({
        id,
        type: "VerificationField",
        extraAttributes: {
            label: "Verificação",
            required: true, // Always required to act as captcha
        },
    }),
    designerBtnElement: {
        icon: ShieldCheck,
        label: "Verificação",
    },
    designerComponent: ({ elementInstance }) => (
        <div className="flex flex-col gap-2 w-full pointer-events-none">
            <Label>{elementInstance.extraAttributes?.label}</Label>
            <div className="flex items-center gap-4 p-4 border rounded-md bg-muted/5 w-fit">
                <Checkbox disabled />
                <span className="text-sm">Não sou um robô</span>
                <ShieldCheck className="h-8 w-8 text-muted-foreground opacity-50 ml-4" />
            </div>
        </div>
    ),
    formComponent: ({ elementInstance }) => {
        const { label, required } = elementInstance.extraAttributes || {}
        return (
            <div className="flex flex-col gap-2 w-full mb-4">
                <div className={cn("flex items-center gap-4 p-4 border rounded-md bg-card shadow-sm w-fit", elementInstance.extraAttributes?.error && "border-destructive")}>
                    <div className="relative flex items-center">
                        <Input
                            type="checkbox"
                            name={elementInstance.id}
                            value="verified"
                            required={required}
                            className="h-6 w-6 cursor-pointer accent-primary"
                        />
                    </div>
                    <Label className="cursor-pointer">Não sou um robô</Label>
                    <ShieldCheck className="h-8 w-8 text-muted-foreground opacity-50 ml-4" />
                </div>
                {elementInstance.extraAttributes?.error && (
                    <p className="text-[0.8rem] text-destructive">Verificação obrigatória</p>
                )}
            </div>
        )
    },
    propertiesComponent: ({ elementInstance }) => (
        <div className="p-2 text-muted-foreground text-sm">
            Este campo é obrigatório por padrão.
        </div>
    )
}

export const FormElements: FormElementsType = {
    TextField: TextFieldFormElement,
    NumberField: NumberFieldFormElement,
    TextArea: TextAreaFormElement,
    TitleField: TitleFieldFormElement,
    ParagraphField: ParagraphFieldFormElement,
    Checkbox: CheckboxFieldFormElement,
    // CheckboxGroup removed in favor of standard Checkbox
    Select: SelectFieldFormElement,
    RadioGroup: RadioGroupFieldFormElement,
    NameField: NameFieldFormElement,
    EmailField: EmailFieldFormElement,
    PhoneField: PhoneFieldFormElement,
    UrlField: UrlFieldFormElement,
    ImageField: ImageFieldFormElement,
    VideoField: VideoFieldFormElement,
    DateField: DateFieldFormElement,
    DateRangeField: DateRangeFieldFormElement,
    DateTimeField: DateTimeFieldFormElement,
    AddressField: AddressFieldFormElement,
    FileField: FileFieldFormElement,
    SignatureField: SignatureFieldFormElement,
    StarRatingField: StarRatingFieldFormElement,
    OpinionScaleField: OpinionScaleFieldFormElement,
    ToggleField: ToggleFieldFormElement,
    VerificationField: VerificationFieldFormElement,
    SeparatorField: SeparatorFieldFormElement,
    SpacerField: SpacerFieldFormElement,
}

