// Server Component
import { createClient } from "@/lib/supabase/server"
import { BuilderClient } from "@/components/builder/builder-client"
import { notFound, redirect } from "next/navigation"

export default async function BuilderPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const resolvedParams = await params
    const { id } = resolvedParams

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const { data: project } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single()

    if (!project) {
        notFound()
    }

    // Check ownership is generally handled by RLS, but if RLS allows reading all and we want to restrict editing...
    // Assuming RLS on projects table restricts SELECT to owner for now.

    return <BuilderClient project={project} />
}
