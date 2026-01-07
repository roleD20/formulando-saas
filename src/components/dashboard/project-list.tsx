"use client"

import { useState } from "react"
import { LayoutGrid, List as ListIcon, MoreVertical, Edit, Eye, Calendar, ExternalLink, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { deleteProject } from "@/actions/form"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Define a type for the project structure we expect
interface Project {
    id: string
    name: string
    created_at: string
    is_published: boolean
    visits?: number // Optional if we add stats later
    submissions?: number
    leads?: { count: number }[]
}

interface ProjectListProps {
    projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

    if (projects.length === 0) return null

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Seus Projetos</h3>
                <div className="flex items-center border rounded-md p-1 bg-muted/20">
                    <Button
                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="h-8 w-8 p-0"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="h-8 w-8 p-0"
                    >
                        <ListIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {viewMode === "grid" ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {projects.map((project) => (
                        <ProjectListItem key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    )
}

function DeleteProjectButton({ id, name }: { id: string, name: string }) {
    const handleDelete = async () => {
        try {
            await deleteProject(id)
            toast.success(`Projeto "${name}" excluído`)
        } catch (error) {
            console.error(error)
            toast.error("Erro ao excluir projeto")
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Excluir projeto?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza que deseja excluir o projeto &quot;{name}&quot;? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Excluir
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

function ProjectCard({ project }: { project: Project }) {
    const leadsCount = project.leads?.[0]?.count || 0

    return (
        <Card className="hover:shadow-md transition-shadow group flex flex-col relative">
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="truncate leading-tight text-lg max-w-[calc(100%-30px)]" title={project.name}>
                        {project.name}
                    </CardTitle>
                    <div className="absolute right-2 top-2">
                        <DeleteProjectButton id={project.id} name={project.name} />
                    </div>
                </div>
                <CardDescription className="flex items-center text-xs mt-1">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDistanceToNow(new Date(project.created_at), { addSuffix: true, locale: ptBR })}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 flex-grow">
                <div className="flex gap-2 items-center justify-between">
                    <Badge variant={project.is_published ? "default" : "secondary"} className="text-[10px] px-2 py-0.5 h-auto">
                        {project.is_published ? "Publicado" : "Rascunho"}
                    </Badge>
                    <div className="text-xs text-muted-foreground font-medium">
                        {leadsCount} {leadsCount === 1 ? 'lead' : 'leads'}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                <div className="flex gap-2 w-full">
                    <Button asChild size="sm" variant="outline" className="flex-1">
                        <Link href={`/builder/${project.id}`}>
                            <Edit className="mr-2 h-3.5 w-3.5" />
                            Editar
                        </Link>
                    </Button>
                    <Button asChild size="sm" variant="secondary" className="flex-1">
                        <Link href={`/submit/${project.id}`} target="_blank">
                            <ExternalLink className="mr-2 h-3.5 w-3.5" />
                            Ver
                        </Link>
                    </Button>
                </div>
                <Button asChild size="sm" variant="default" className="w-full">
                    <Link href={`/dashboard/projects/${project.id}/leads`}>
                        <ListIcon className="mr-2 h-3.5 w-3.5" />
                        Ver Leads
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

function ProjectListItem({ project }: { project: Project }) {
    const leadsCount = project.leads?.[0]?.count || 0

    return (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/10 transition-colors">
            <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-3">
                    <span className="font-semibold truncate max-w-[200px] md:max-w-md">{project.name}</span>
                    <Badge variant={project.is_published ? "default" : "secondary"} className="text-[10px] px-2 py-0.5 h-auto">
                        {project.is_published ? "Publicado" : "Rascunho"}
                    </Badge>
                </div>
                <div className="flex items-center text-xs text-muted-foreground gap-4">
                    <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        Criado {formatDistanceToNow(new Date(project.created_at), { addSuffix: true, locale: ptBR })}
                    </span>
                    <span className="font-medium text-foreground">
                        {leadsCount} {leadsCount === 1 ? 'lead' : 'leads'}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <Button asChild size="sm" variant="outline">
                    <Link href={`/dashboard/projects/${project.id}/leads`}>
                        <ListIcon className="mr-2 h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Leads</span>
                    </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                    <Link href={`/builder/${project.id}`}>
                        <Edit className="mr-2 h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Editar</span>
                    </Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                    <Link href={`/submit/${project.id}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Visualizar</span>
                    </Link>
                </Button>
                <div className="ml-2">
                    <DeleteProjectButton id={project.id} name={project.name} />
                </div>
            </div>
        </div>
    )
}
