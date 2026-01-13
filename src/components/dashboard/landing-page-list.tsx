"use client"

import { useState } from "react"
import { LayoutGrid, List as ListIcon, Edit, Eye, Calendar, ExternalLink, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { deleteLandingPage } from "@/app/dashboard/actions"
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

export interface LandingPage {
    id: string
    name: string
    slug: string
    is_published: boolean
    created_at: string
    workspace_id: string
    workspace_name?: string
}

interface LandingPageListProps {
    landingPages: LandingPage[]
    initialViewMode?: "grid" | "list"
    hideViewToggle?: boolean
    hideHeader?: boolean
}

export function LandingPageList({ landingPages, initialViewMode = "grid", hideViewToggle = false, hideHeader = false }: LandingPageListProps) {
    const [viewMode, setViewMode] = useState<"grid" | "list">(initialViewMode)

    if (landingPages.length === 0) return null

    return (
        <div className="space-y-6">
            {!hideHeader && (
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Suas Landing Pages</h3>
                    {!hideViewToggle && (
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
                    )}
                </div>
            )}

            {viewMode === "grid" ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {landingPages.map((lp) => (
                        <LPCard key={lp.id} lp={lp} />
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {landingPages.map((lp) => (
                        <LPListItem key={lp.id} lp={lp} />
                    ))}
                </div>
            )}
        </div>
    )
}

function DeleteLPButton({ id, name }: { id: string, name: string }) {
    const handleDelete = async () => {
        try {
            await deleteLandingPage(id)
            toast.success(`Landing Page "${name}" excluída`)
        } catch (error) {
            console.error(error)
            toast.error("Erro ao excluir Landing Page")
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
                    <AlertDialogTitle>Excluir Landing Page?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza que deseja excluir "{name}"? Esta ação não pode ser desfeita e a página sairá do ar.
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

function LPCard({ lp }: { lp: LandingPage }) {
    return (
        <Card className="hover:shadow-md transition-shadow group flex flex-col relative h-full">
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="truncate leading-tight text-lg max-w-[calc(100%-30px)]" title={lp.name}>
                        {lp.name}
                    </CardTitle>
                    <div className="absolute right-2 top-2">
                        <DeleteLPButton id={lp.id} name={lp.name} />
                    </div>
                </div>
                <CardDescription className="flex items-center text-xs mt-1">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDistanceToNow(new Date(lp.created_at), { addSuffix: true, locale: ptBR })}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 flex-grow">
                <div className="flex gap-2 items-center justify-between">
                    <Badge variant={lp.is_published ? "default" : "secondary"} className="text-[10px] px-2 py-0.5 h-auto">
                        {lp.is_published ? "Publicada" : "Rascunho"}
                    </Badge>
                    <div className="text-xs text-muted-foreground font-mono truncate max-w-[120px]" title={`/${lp.slug}`}>
                        /{lp.slug}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2 mt-auto">
                <Button asChild size="sm" variant="outline" className="w-full">
                    <Link href={`/lp/builder/${lp.id}`}>
                        <Edit className="mr-2 h-3.5 w-3.5" />
                        Editar
                    </Link>
                </Button>
                {lp.is_published ? (
                    <Button asChild size="sm" variant="secondary" className="w-full">
                        <Link href={`/lp/${lp.slug}`} target="_blank">
                            <ExternalLink className="mr-2 h-3.5 w-3.5" />
                            Visualizar
                        </Link>
                    </Button>
                ) : (
                    <Button size="sm" variant="ghost" className="w-full" disabled>
                        <Eye className="mr-2 h-3.5 w-3.5" />
                        Visualizar
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

function LPListItem({ lp }: { lp: LandingPage }) {
    return (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/10 transition-colors">
            <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-3">
                    <span className="font-semibold truncate max-w-[200px] md:max-w-md">{lp.name}</span>
                    <Badge variant={lp.is_published ? "default" : "secondary"} className="text-[10px] px-2 py-0.5 h-auto">
                        {lp.is_published ? "Publicada" : "Rascunho"}
                    </Badge>
                </div>
                <div className="flex items-center text-xs text-muted-foreground gap-4">
                    <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        Criado {formatDistanceToNow(new Date(lp.created_at), { addSuffix: true, locale: ptBR })}
                    </span>
                    <span className="font-mono">
                        /{lp.slug}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <Button asChild size="sm" variant="outline">
                    <Link href={`/lp/builder/${lp.id}`}>
                        <Edit className="mr-2 h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Editar</span>
                    </Link>
                </Button>

                {lp.is_published ? (
                    <Button asChild size="sm" variant="ghost">
                        <Link href={`/lp/${lp.slug}`} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">Visualizar</span>
                        </Link>
                    </Button>
                ) : (
                    <Button size="sm" variant="ghost" disabled>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Visualizar</span>
                    </Button>
                )}

                <div className="ml-2">
                    <DeleteLPButton id={lp.id} name={lp.name} />
                </div>
            </div>
        </div>
    )
}
