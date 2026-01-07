"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProjectContent(id: string, jsonContent: string, name?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("User not found")

    const updateData: any = {
        content: JSON.parse(jsonContent),
    }

    if (name) {
        updateData.name = name
    }

    const { error } = await supabase
        .from("projects")
        .update(updateData)
        .eq("id", id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath(`/builder/${id}`)
    revalidatePath("/dashboard")
}

export async function deleteProject(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("User not found")

    const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath("/dashboard")
}

export async function submitForm(formUrl: string, content: string) {
    const supabase = await createClient()

    // We don't check for user here, as this is a public action

    // Validate that the project exists
    const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("id")
        .eq("id", formUrl)
        .single()

    if (projectError || !project) {
        throw new Error("Formulário não encontrado")
    }

    const { error } = await supabase
        .from("leads")
        .insert({
            project_id: formUrl,
            data: JSON.parse(content),
        })

    if (error) {
        console.error("Error submitting form:", error)
        throw new Error("Erro ao enviar formulário")
    }
}
