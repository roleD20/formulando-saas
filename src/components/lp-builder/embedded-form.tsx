"use client"

import React, { useEffect, useState } from "react"
import { getFormContent } from "@/actions/form"
import { FormSubmitComponent } from "@/components/form-submit"
import { FormElementInstance } from "@/context/builder-context"
import { Loader2 } from "lucide-react"

interface EmbeddedFormProps {
    formId: string
}

export function EmbeddedForm({ formId }: EmbeddedFormProps) {
    const [formContent, setFormContent] = useState<FormElementInstance[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchForm = async () => {
            try {
                setLoading(true)
                const data = await getFormContent(formId)

                if (data && data.content && Array.isArray(data.content)) {
                    setFormContent(data.content as FormElementInstance[])
                } else {
                    setError(true)
                }
            } catch (err) {
                console.error("Error fetching form:", err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        if (formId) {
            fetchForm()
        }
    }, [formId])

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 bg-slate-50 border rounded-lg min-h-[100px]">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                <span className="ml-2 text-slate-500">Carregando formulário...</span>
            </div>
        )
    }

    if (error || !formContent) {
        return (
            <div className="flex items-center justify-center p-8 bg-slate-50 border border-dashed rounded-lg min-h-[100px]">
                <div className="text-center text-muted-foreground">
                    <p>Formulário não encontrado ou inválido</p>
                    <p className="text-xs mt-1 text-slate-400">ID: {formId}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full">
            <FormSubmitComponent
                formUrl={formId}
                content={formContent}
            />
        </div>
    )
}
