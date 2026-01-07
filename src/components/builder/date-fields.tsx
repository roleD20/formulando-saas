// Temporary file with Date field definitions
// These need to be added to form-elements.tsx

import { Calendar, CalendarClock, CalendarDays } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { FormElement } from "./form-elements"

// PropertiesComponent should be imported from form-elements.tsx

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
    propertiesComponent: PropertiesComponent // This needs to reference the one from form-elements.tsx
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

export { DateFieldFormElement, DateRangeFieldFormElement, DateTimeFieldFormElement }
