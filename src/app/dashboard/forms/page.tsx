import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { ProjectList } from "@/components/dashboard/project-list"
import { Button } from "@/components/ui/button"
import { Plus, Folder } from "lucide-react"
import { createProject } from "@/app/dashboard/actions"

export default async function FormsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>Usuário não autenticado</div>
    }

    const cookieStore = await cookies()
    const workspaceId = cookieStore.get("formu-workspace-id")?.value

    let activeWorkspaceId = workspaceId

    // Validate if user has access to this workspace or pick default
    const { data: workspaces } = await supabase
        .from("workspaces")
        .select("id, name")
        .eq("owner_id", user.id)

    // If no workspaceId in cookie, or invalid, pick the first one
    if (!activeWorkspaceId && workspaces && workspaces.length > 0) {
        activeWorkspaceId = workspaces[0].id
    }

    // Verify if workspaceId exists in user's workspaces
    if (activeWorkspaceId && workspaces) {
        const hasAccess = workspaces.some(w => w.id === activeWorkspaceId)
        if (!hasAccess && workspaces.length > 0) {
            activeWorkspaceId = workspaces[0].id
        }
    }

    let projects: any[] = []

    if (activeWorkspaceId) {
        const { data } = await supabase
            .from("projects")
            .select("*, leads(count)")
            .eq("workspace_id", activeWorkspaceId)
            .order("created_at", { ascending: false })

        if (data) projects = data
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Formulários</h2>
                <form action={createProject}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Formulário
                    </Button>
                </form>
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 md:p-16 animate-in fade-in-50 mt-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Folder className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold">Nenhum formulário ainda</h3>
                    <p className="mt-2 mb-4 text-center text-sm text-muted-foreground max-w-sm">
                        Crie seu primeiro formulário para começar a coletar leads.
                    </p>
                    <form action={createProject}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Criar Primeiro Formulário
                        </Button>
                    </form>
                </div>
            ) : (
                <ProjectList projects={projects} />
            )}
        </div>
    )
}
