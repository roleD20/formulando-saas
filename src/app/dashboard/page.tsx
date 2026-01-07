import Link from "next/link"
import { Plus, Folder, Users } from "lucide-react"
import { createProject } from "./actions"
import { createClient } from "@/lib/supabase/server"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ProjectList } from "@/components/dashboard/project-list"

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>Usuário não autenticado</div>
    }

    // Fetch projects
    // We need to join with workspaces to filter by owner?
    // Or just fetching projects where workspace->owner_id is user
    // Simpler: fetch workspaces first then projects? Or relying on RLS?
    // Let's assume RLS allows selecting projects user has access to.
    // Ideally we filter by workspace_id if we have multiple workspaces context.
    // For now, let's fetch all projects for the user's workspaces.

    // Get user's workspace first (single workspace MVP)
    const { data: workspaces } = await supabase
        .from("workspaces")
        .select("id")
        .eq("owner_id", user.id)
        .limit(1)

    let projects: any[] = []

    if (workspaces && workspaces.length > 0) {
        const { data } = await supabase
            .from("projects")
            .select("*, leads(count)")
            .eq("workspace_id", workspaces[0].id)
            .order("created_at", { ascending: false })

        if (data) projects = data
    }

    const projectsCount = projects.length
    // type check for leads count
    const leadsCount = projects.reduce((acc, project) => {
        // @ts-ignore
        return acc + (project.leads?.[0]?.count || 0)
    }, 0)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center gap-2">
                    <form action={createProject}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Projeto
                        </Button>
                    </form>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total de Projetos
                        </CardTitle>
                        <Folder className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{projectsCount}</div>
                        <p className="text-xs text-muted-foreground">
                            +0% em relação ao mês passado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Leads Capturados
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leadsCount}</div>
                        <p className="text-xs text-muted-foreground">
                            +0% em relação ao mês passado
                        </p>
                    </CardContent>
                </Card>
            </div>

            {projectsCount === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 md:p-16 animate-in fade-in-50 mt-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Folder className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold">Nenhum projeto ainda</h3>
                    <p className="mt-2 mb-4 text-center text-sm text-muted-foreground max-w-sm">
                        Crie seu primeiro formulário ou página de captura para começar a receber leads.
                    </p>
                    <form action={createProject}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Criar Primeiro Projeto
                        </Button>
                    </form>
                </div>
            ) : (
                <div className="mt-8">
                    <ProjectList projects={projects} />
                </div>
            )}
        </div>
    )
}
