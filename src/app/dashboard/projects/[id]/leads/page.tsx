import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default async function ProjectLeadsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>Usuário não autenticado</div>
    }

    // Fetch project details to verify ownership and get form structure
    const { data: project } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .eq("workspace_id", (
            await supabase.from("workspaces").select("id").eq("owner_id", user.id).limit(1).single()
        ).data?.id) // Simplified check, ideally rigorous RLS handles this
        .single()

    if (!project) {
        return notFound()
    }

    // Fetch leads
    const { data: leads } = await supabase
        .from("leads")
        .select("*")
        .eq("project_id", id)
        .order("created_at", { ascending: false })

    const formElements = typeof project.content === 'string'
        ? JSON.parse(project.content)
        : project.content || []

    // Extract columns from form elements (only inputs that have data)
    const columns = formElements
        .filter((el: any) => ["TextField", "NumberField", "TextArea", "Checkbox", "Select"].includes(el.type))
        .map((el: any) => ({
            id: el.id,
            label: el.extraAttributes?.label || el.type
        }))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Leads: {project.name}</h2>
                        <p className="text-muted-foreground">
                            {leads?.length || 0} leads capturados
                        </p>
                    </div>
                </div>
                {/* Export button could go here */}
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[180px]">Data</TableHead>
                            {columns.map((col: any) => (
                                <TableHead key={col.id}>{col.label}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!leads || leads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                                    Nenhum lead encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            leads.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell className="font-medium">
                                        {format(new Date(lead.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                    </TableCell>
                                    {columns.map((col: any) => (
                                        <TableCell key={col.id}>
                                            {lead.data[col.id]?.toString() || "-"}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
