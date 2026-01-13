"use server"

import { createClient } from "@/lib/supabase/server"
import { LPElement } from "@/components/lp-builder/types"
import { revalidatePath } from "next/cache"

export async function saveLandingPage(id: string, content: LPElement[], name?: string, slug?: string) {
    try {
        const supabase = await createClient()

        // Verify authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return {
                success: false,
                error: "Não autenticado"
            }
        }

        // Verify ownership
        const { data: landingPage, error: lpError } = await supabase
            .from("landing_pages")
            .select("workspace_id")
            .eq("id", id)
            .single()

        if (lpError || !landingPage) {
            return {
                success: false,
                error: "Landing Page não encontrada"
            }
        }

        // Check workspace ownership
        const { data: workspace, error: workspaceError } = await supabase
            .from("workspaces")
            .select("id")
            .eq("id", landingPage.workspace_id)
            .eq("owner_id", user.id)
            .single()

        if (workspaceError || !workspace) {
            return {
                success: false,
                error: "Acesso negado"
            }
        }

        // Save the content
        const { error: updateError } = await supabase
            .from("landing_pages")
            .update({
                content: content,
                ...(name && { name }), // Only update name if provided
                ...(slug && { slug }), // Only update slug if provided
                updated_at: new Date().toISOString()
            })
            .eq("id", id)

        if (updateError) {
            console.error("Error saving landing page:", updateError)
            return {
                success: false,
                error: "Erro ao salvar"
            }
        }

        // Revalidate the page cache
        revalidatePath(`/lp/builder/${id}`)

        return {
            success: true,
            savedAt: new Date().toISOString()
        }
    } catch (error) {
        console.error("Unexpected error saving landing page:", error)
        return {
            success: false,
            error: "Erro inesperado ao salvar"
        }
    }
}

export async function togglePublish(id: string, isPublished: boolean) {
    try {
        const supabase = await createClient()

        // Verify authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return {
                success: false,
                error: "Não autenticado"
            }
        }

        // Verify ownership
        const { data: landingPage, error: lpError } = await supabase
            .from("landing_pages")
            .select("workspace_id, slug")
            .eq("id", id)
            .single()

        if (lpError || !landingPage) {
            return {
                success: false,
                error: "Landing Page não encontrada"
            }
        }

        // Check workspace ownership
        const { data: workspace, error: workspaceError } = await supabase
            .from("workspaces")
            .select("id")
            .eq("id", landingPage.workspace_id)
            .eq("owner_id", user.id)
            .single()

        if (workspaceError || !workspace) {
            return {
                success: false,
                error: "Acesso negado"
            }
        }

        // Toggle publish status
        const { error: updateError } = await supabase
            .from("landing_pages")
            .update({
                is_published: isPublished,
                updated_at: new Date().toISOString()
            })
            .eq("id", id)

        if (updateError) {
            console.error("Error toggling publish status:", updateError)
            return {
                success: false,
                error: "Erro ao atualizar status"
            }
        }

        // Revalidate the public page
        revalidatePath(`/lp/${landingPage.slug}`)
        revalidatePath(`/lp/builder/${id}`)

        return {
            success: true,
            isPublished,
            slug: landingPage.slug
        }
    } catch (error) {
        console.error("Unexpected error toggling publish:", error)
        return {
            success: false,
            error: "Erro inesperado"
        }
    }
}
