"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createWorkspace } from "@/app/dashboard/actions"
import { useWorkspace } from "@/context/workspace-context"
import { toast } from "sonner"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "O nome da marca deve ter pelo menos 2 caracteres.",
    }),
    slug: z.string().min(3, {
        message: "O identificador deve ter pelo menos 3 caracteres.",
    }).regex(/^[a-z0-9-]+$/, {
        message: "O identificador deve conter apenas letras minúsculas, números e hífens.",
    }),
})

interface CreateBrandDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateBrandDialog({ open, onOpenChange }: CreateBrandDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { refreshWorkspaces, switchWorkspace } = useWorkspace()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true)
            const result = await createWorkspace(values)

            if (result.error) {
                toast.error(result.error)
                return
            }

            toast.success("Marca criada com sucesso!")
            await refreshWorkspaces()
            if (result.id) {
                switchWorkspace(result.id)
            }
            onOpenChange(false)
            form.reset()
        } catch (error) {
            console.error(error)
            toast.error("Ocorreu um erro ao criar a marca.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Criar Nova Marca</DialogTitle>
                    <DialogDescription>
                        Crie uma nova marca para gerenciar seus formulários e leads separadamente.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome da Marca</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Minha Empresa" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Identificador (Slug)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="minha-empresa" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Criar Marca
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
