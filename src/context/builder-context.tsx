"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { UniqueIdentifier } from "@dnd-kit/core"

export type FormElementType =
    | "TextField"
    | "NumberField"
    | "TextArea"
    | "Checkbox"
    | "Select"
    | "RadioGroup"
    | "NameField"
    | "EmailField"
    | "UrlField"
    | "PhoneField"
    | "DateField"
    | "DateRangeField"
    | "DateTimeField"
    | "AddressField"
    | "FileField"
    | "SignatureField"
    | "StarRatingField"
    | "OpinionScaleField"
    | "ToggleField"
    | "VerificationField"
    | "ImageField"
    | "VideoField"
    | "TitleField"
    | "ParagraphField"
    | "SeparatorField"
    | "SpacerField"
    | "RichTextField"

export type FormElementInstance = {
    id: string
    type: FormElementType
    extraAttributes?: Record<string, any>
}

export type FormSettings = {
    general: {
        name: string;
        description: string;
        successMessage: string;
        redirectUrl: string;
        afterSubmission: "message" | "redirect";
    };
    design: {
        buttonText: string;
        theme: {
            page: {
                backgroundColor: string;
                textColor: string;
            };
            inputs: {
                backgroundColor: string;
                textColor: string;
                borderColor: string;
                borderRadius: number;
            };
            buttons: {
                backgroundColor: string;
                textColor: string;
                borderRadius: number;
            };
            labels: {
                textColor: string;
            };
        };
        branding: boolean;
    };
    integrations: {
        webhooks: {
            url: string;
            enabled: boolean;
        }[];
    };
    advanced: {
        notificationEmail: string;
        notificationEnabled: boolean;
        limitResponses: boolean;
        maxResponses: number | undefined;
        passwordEnabled: boolean;
        password?: string;
        closeDate?: Date;
    };
}

export const defaultSettings: FormSettings = {
    general: {
        name: "Formulário Sem Título",
        description: "",
        successMessage: "Obrigado! Sua resposta foi enviada com sucesso.",
        redirectUrl: "",
        afterSubmission: "message",
    },
    design: {
        buttonText: "Enviar Formulário",
        theme: {
            page: {
                backgroundColor: "#ffffff",
                textColor: "#000000",
            },
            inputs: {
                backgroundColor: "#ffffff",
                textColor: "#000000",
                borderColor: "#e2e8f0",
                borderRadius: 4,
            },
            buttons: {
                backgroundColor: "#2563EB",
                textColor: "#ffffff",
                borderRadius: 4,
            },
            labels: {
                textColor: "#000000",
            },
        },
        branding: true,
    },
    integrations: {
        webhooks: [],
    },
    advanced: {
        notificationEmail: "",
        notificationEnabled: false,
        limitResponses: false,
        maxResponses: undefined,
        passwordEnabled: false,
    },
}

type BuilderContextType = {
    elements: FormElementInstance[]
    setElements: React.Dispatch<React.SetStateAction<FormElementInstance[]>>
    addElement: (index: number, element: FormElementInstance) => void
    removeElement: (id: string) => void
    selectedElement: FormElementInstance | null
    setSelectedElement: React.Dispatch<React.SetStateAction<FormElementInstance | null>>
    updateElement: (id: string, element: FormElementInstance) => void
    settings: FormSettings
    updateSettings: (newSettings: Partial<FormSettings>) => void
}

const BuilderContext = createContext<BuilderContextType | null>(null)

export function BuilderProvider({ children, defaultElements = [], defaultSettings: preloadedSettings }: { children: ReactNode, defaultElements?: FormElementInstance[], defaultSettings?: FormSettings }) {
    const [elements, setElements] = useState<FormElementInstance[]>(defaultElements)
    const [selectedElement, setSelectedElement] = useState<FormElementInstance | null>(null)

    // Deep merge preloadedSettings with defaultSettings to ensure all properties exist
    const [settings, setSettings] = useState<FormSettings>(() => {
        const safeS = (preloadedSettings || {}) as Partial<FormSettings>;
        return {
            ...defaultSettings,
            ...safeS,
            general: { ...defaultSettings.general, ...(safeS.general || {}) },
            design: {
                ...defaultSettings.design,
                ...(safeS.design || {}),
                theme: {
                    ...defaultSettings.design.theme,
                    ...(safeS.design?.theme || {}),
                    page: { ...defaultSettings.design.theme.page, ...(safeS.design?.theme?.page || {}) },
                    inputs: { ...defaultSettings.design.theme.inputs, ...(safeS.design?.theme?.inputs || {}) },
                    buttons: { ...defaultSettings.design.theme.buttons, ...(safeS.design?.theme?.buttons || {}) },
                    labels: { ...defaultSettings.design.theme.labels, ...(safeS.design?.theme?.labels || {}) },
                }
            },
            integrations: { ...defaultSettings.integrations, ...(safeS.integrations || {}) },
            advanced: { ...defaultSettings.advanced, ...(safeS.advanced || {}) },
        };
    })

    const addElement = (index: number, element: FormElementInstance) => {
        setElements((prev) => {
            const newElements = [...prev]
            newElements.splice(index, 0, element)
            return newElements
        })
    }

    const removeElement = (id: string) => {
        setElements((prev) => prev.filter((element) => element.id !== id))
    }

    const updateElement = (id: string, element: FormElementInstance) => {
        setElements((prev) => {
            const newElements = [...prev]
            const index = newElements.findIndex((el) => el.id === id)
            newElements[index] = element
            return newElements
        })

        if (selectedElement?.id === id) {
            setSelectedElement(element)
        }
    }

    const updateSettings = (newSettings: Partial<FormSettings>) => {
        setSettings((prev) => ({
            ...prev,
            ...newSettings
        }))
    }

    return (
        <BuilderContext.Provider
            value={{
                elements,
                setElements,
                addElement,
                removeElement,
                selectedElement,
                setSelectedElement,
                updateElement,
                settings,
                updateSettings
            }}
        >
            {children}
        </BuilderContext.Provider>
    )
}

export function useBuilder() {
    const context = useContext(BuilderContext)
    if (!context) {
        throw new Error("useBuilder must be used within a BuilderProvider")
    }
    return context
}
