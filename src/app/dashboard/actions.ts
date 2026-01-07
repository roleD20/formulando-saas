"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createProject() {
    const supabase = await createClient()

    // 1. Get current user
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // 1.5. Ensure Profile exists (Critical for Foreign Key constraint)
    const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single()

    if (!profile) {
        // Profile missing? Attempt to create it manually (recovery)
        const { error: profileError } = await supabase
            .from("profiles")
            .insert({
                id: user.id,
                email: user.email!,
                full_name: user.user_metadata?.full_name || user.email?.split("@")[0],
            })

        if (profileError) {
            console.error("Error creating missing profile:", profileError)
            // We continue, hoping it might have been a race condition, or fail at workspace step with clearer error
        }
    }

    // 2. Get user's workspace (or create one if it doesn't exist)
    // For MVP, we assume 1 workspace per user for now, or just pick the first one.
    const { data: workspaces } = await supabase
        .from("workspaces")
        .select("id")
        .eq("owner_id", user.id)
        .limit(1)

    let workspaceId

    if (workspaces && workspaces.length > 0) {
        workspaceId = workspaces[0].id
    } else {
        // Create default workspace
        const { data: newWorkspace, error: workspaceError } = await supabase
            .from("workspaces")
            .insert({
                name: "My Workspace",
                slug: `workspace-${user.id.slice(0, 8)}`, // Simple unique slug
                owner_id: user.id,
            })
            .select("id")
            .single()

        if (workspaceError || !newWorkspace) {
            console.error("Error creating workspace DETAILS:", JSON.stringify(workspaceError, null, 2))
            throw new Error(`Failed to create workspace: ${workspaceError?.message || 'Unknown error'}`)
        }
        workspaceId = newWorkspace.id
    }

    // 3. Create new project
    const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
            workspace_id: workspaceId,
            name: "Untitled Form",
            slug: `form-${crypto.randomUUID().slice(0, 8)}`,
            content: [], // Empty form array
            settings: {},
            is_published: false,
        })
        .select("id")
        .single()

    if (projectError) {
        console.error("Error creating project:", projectError)
        throw new Error("Failed to create project")
    }

    revalidatePath("/dashboard")
    redirect(`/builder/${project.id}`)
}
