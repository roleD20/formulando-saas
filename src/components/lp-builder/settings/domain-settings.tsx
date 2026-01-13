"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { updateProjectDomain } from "@/app/lp/builder/[id]/actions"
import { useLPBuilder } from "../context/lp-builder-context"
import { Loader2, Check, AlertTriangle, Globe } from "lucide-react"

export function DomainSettings({ initialDomain, projectId }: { initialDomain: string | null, projectId: string }) {
    const [domain, setDomain] = useState(initialDomain || "")
    const [loading, setLoading] = useState(false)
    const [savedDomain, setSavedDomain] = useState(initialDomain)

    const handleSaveDomain = async () => {
        if (!domain && !savedDomain) return; // Nothing to do

        setLoading(true)
        try {
            const result = await updateProjectDomain(projectId, domain)

            if (result.error) {
                toast.error(result.error)
                return
            }

            setSavedDomain(domain)
            toast.success("Configurações de domínio atualizadas!")
        } catch (error) {
            toast.error("Erro ao atualizar domínio")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 py-4">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Domínio Personalizado</h3>
                <p className="text-sm text-muted-foreground">
                    Conecte seu próprio domínio (ex: promoção.suaempresa.com.br) a esta Landing Page.
                </p>
            </div>

            <div className="flex gap-2 items-end">
                <div className="grid gap-1.5 flex-1">
                    <Label htmlFor="domain">Domínio</Label>
                    <Input
                        id="domain"
                        placeholder="ex: lp.meusite.com"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="font-mono"
                    />
                </div>
                <Button
                    onClick={handleSaveDomain}
                    disabled={loading || domain === savedDomain}
                >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {savedDomain ? "Atualizar" : "Conectar"}
                </Button>
            </div>

            {savedDomain && (
                <div className="rounded-md border bg-muted/50 p-4 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Globe className="h-4 w-4 text-blue-500" />
                        Status da Configuração
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                            <div className="min-w-[4px] min-h-[4px] mt-2 rounded-full bg-slate-400" />
                            <p>
                                1. Acesse o painel de DNS do seu domínio (Godaddy, Registro.br, Cloudflare, etc).
                            </p>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                            <div className="min-w-[4px] min-h-[4px] mt-2 rounded-full bg-slate-400" />
                            <div>
                                <p>2. Crie um registro do tipo <strong>CNAME</strong> com os dados:</p>
                                <div className="mt-2 grid grid-cols-[100px_1fr] gap-2 p-2 bg-background border rounded text-xs font-mono">
                                    <span className="text-muted-foreground">Nome (Host):</span>
                                    <span>{savedDomain.split('.')[0]} (ou o subdomínio que escolheu)</span>
                                    <span className="text-muted-foreground">Valor (Aponta para):</span>
                                    <span className="select-all">cname.vercel-dns.com</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                            <div className="min-w-[4px] min-h-[4px] mt-2 rounded-full bg-slate-400" />
                            <p>3. Aguarde a propagação (pode levar até 48h, mas geralmente é rápido).</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-200">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Se estiver usando Cloudflare, desative o proxy (nuvem laranja) para este registro.</span>
                    </div>
                </div>
            )}
        </div>
    )
}
