
import { FormElements } from "@/components/builder/form-elements"
import { FormElementInstance } from "@/context/builder-context"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { FormSubmitComponent } from "@/components/form-submit"

export default async function SubmitPage({
    params,
}: {
    params: Promise<{ formUrl: string }>
}) {
    const resolvedParams = await params
    const { formUrl } = resolvedParams
    const supabase = await createClient()

    // Verify if it's a valid UUID (since we are using ID for now)
    // or just try to fetch.

    const { data: project } = await supabase
        .from("projects")
        .select("content, name")
        .eq("id", formUrl)
        .single()

    if (!project) {
        return notFound()
    }

    const formContent = project.content as FormElementInstance[]

    if (!formContent) {
        return <div>Formulário vazio</div>
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-accent/20">
            <div className="max-w-[800px] w-full bg-background rounded-lg shadow-lg p-8 border">
                <h1 className="text-2xl font-bold mb-8 text-center">{project.name}</h1>
                <FormSubmitComponent formUrl={formUrl} content={formContent} />
            </div>
        </div>
    )
}
