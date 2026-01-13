import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LPBuilderClient } from "./client"
import { Project } from "@/types"

interface LPBuilderPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function LPBuilderPage(props: LPBuilderPageProps) {
    const params = await props.params;
    const { id } = params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Verify ownership via workspace
    const { data: project } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("id", id)
        .single()

    if (!project) {
        return <div>Projeto não encontrado.</div>
    }

    // Check if user owns the workspace of the project
    const { data: workspace } = await supabase
        .from("workspaces")
        .select("id")
        .eq("id", project.workspace_id)
        .eq("owner_id", user.id)
        .single()

    if (!workspace) {
        return <div>Acesso negado.</div>
    }

    return (
        <div className="h-screen flex flex-col">
            <header className="h-14 border-b flex items-center px-4 justify-between bg-white z-10 relative">
                <div className="font-semibold text-sm">
                    {project.name} <span className="text-xs text-muted-foreground font-normal ml-2">LP Builder</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="text-sm px-3 py-1.5 rounded hover:bg-muted">Preview</button>
                    <button className="text-sm px-3 py-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90">Salvar</button>
                </div>
            </header>

            <LPBuilderClient project={project as Project} />
        </div>
    )
}
