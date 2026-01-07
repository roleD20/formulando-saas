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

export type FormElementInstance = {
    id: string
    type: FormElementType
    extraAttributes?: Record<string, any>
}

type BuilderContextType = {
    elements: FormElementInstance[]
    setElements: React.Dispatch<React.SetStateAction<FormElementInstance[]>>
    addElement: (index: number, element: FormElementInstance) => void
    removeElement: (id: string) => void
    selectedElement: FormElementInstance | null
    setSelectedElement: React.Dispatch<React.SetStateAction<FormElementInstance | null>>
    updateElement: (id: string, element: FormElementInstance) => void
}

const BuilderContext = createContext<BuilderContextType | null>(null)

export function BuilderProvider({ children, defaultElements = [] }: { children: ReactNode, defaultElements?: FormElementInstance[] }) {
    const [elements, setElements] = useState<FormElementInstance[]>(defaultElements)
    const [selectedElement, setSelectedElement] = useState<FormElementInstance | null>(null)

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
