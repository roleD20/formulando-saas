"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Settings, Plug, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarItems = [
    {
        title: "Projetos",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Leads",
        href: "/dashboard/leads",
        icon: Users,
    },
    {
        title: "Integrações",
        href: "/dashboard/integrations",
        icon: Plug,
    },
    {
        title: "Configurações",
        href: "/dashboard/settings",
        icon: Settings,
    },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    return (
        <div className={cn("pb-12 h-full bg-muted/10", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="mb-2 px-4 flex items-center gap-2 font-bold text-xl text-primary">
                        <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                            F
                        </div>
                        Formu
                    </div>
                    <div className="px-2 mb-4">
                        <div className="text-xs text-muted-foreground font-medium mb-1 px-2 uppercase">Workspace</div>
                        <div className="bg-card border rounded-md p-2 text-sm font-medium flex items-center justify-between">
                            <span>Meu Workspace</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.href}
                                variant="ghost" // Logic for active state could be added here
                                className="w-full justify-start"
                                asChild
                            >
                                <Link href={item.href}>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        <Button className="w-full justify-start" variant="secondary">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Projeto
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
