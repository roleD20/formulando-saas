"use client";

import { useState, useTransition } from "react";
import { useBuilder, FormSettings, defaultSettings } from "@/context/builder-context";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Settings, Palette, Webhook, ShieldAlert, Zap, Calendar, Mail, FileText, Loader2 } from "lucide-react";
import { updateFormSettings } from "@/actions/form";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ColorPickerControl = ({
    label,
    value,
    onChange
}: {
    label: string;
    value: string;
    onChange: (value: string) => void
}) => (
    <div className="grid gap-2">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</Label>
        <div className="flex items-center gap-2">
            <div
                className="w-10 h-10 rounded-md border shadow-sm transition-transform hover:scale-105 cursor-pointer"
                style={{ backgroundColor: value }}
                onClick={() => {
                    // Trigger hidden input click
                    const input = document.getElementById(`cp-${label.replace(/\s/g, '')}`) as HTMLInputElement;
                    if (input) input.click();
                }}
            />
            <Input
                id={`cp-${label.replace(/\s/g, '')}`}
                type="color"
                className="sr-only" // Hide native picker but keep functionality
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <Input
                className="flex-1 font-mono text-sm h-10 uppercase"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                maxLength={7}
            />
        </div>
    </div>
);

const PremiumBadge = () => (
    <span className="ml-2 inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-2 py-0.5 text-xs font-semibold text-yellow-800 dark:border-yellow-900/30 dark:bg-yellow-900/20 dark:text-yellow-400">
        <Zap className="mr-1 h-3 w-3" />
        PREMIUM
    </span>
);

export function SettingsModal({ trigger }: { trigger?: React.ReactNode }) {
    const { settings, updateSettings } = useBuilder();

    // Deep merge helper to ensure stability against partial updates/old data
    const ensureSettings = (s: Partial<FormSettings> | undefined): FormSettings => {
        const safeS = s || {};
        return {
            ...defaultSettings,
            ...safeS,
            general: { ...defaultSettings.general, ...(safeS.general || {}) },
            design: {
                ...defaultSettings.design,
                ...(safeS.design || {}),
                theme: {
                    ...defaultSettings.design.theme,
                    ...(safeS.design?.theme || {}),
                    page: { ...defaultSettings.design.theme.page, ...(safeS.design?.theme?.page || {}) },
                    inputs: { ...defaultSettings.design.theme.inputs, ...(safeS.design?.theme?.inputs || {}) },
                    buttons: { ...defaultSettings.design.theme.buttons, ...(safeS.design?.theme?.buttons || {}) },
                    labels: { ...defaultSettings.design.theme.labels, ...(safeS.design?.theme?.labels || {}) },
                }
            },
            integrations: { ...defaultSettings.integrations, ...(safeS.integrations || {}) },
            advanced: { ...defaultSettings.advanced, ...(safeS.advanced || {}) },
        };
    };

    const [isOpen, setIsOpen] = useState(false);
    const [localSettings, setLocalSettings] = useState(ensureSettings(settings));
    const params = useParams();
    const [isPending, startTransition] = useTransition();

    const handleOpenChange = (open: boolean) => {
        if (open) {
            setLocalSettings(ensureSettings(settings)); // Reset to saved state on open, safely
        }
        setIsOpen(open);
    };

    const handleSave = () => {
        startTransition(async () => {
            try {
                // 1. Update Context (Client Optimistic)
                updateSettings(localSettings);

                // 2. Update Server
                const formId = params.id as string;
                if (formId) {
                    await updateFormSettings(formId, localSettings);
                    toast.success("Configurações salvas com sucesso!");
                    setIsOpen(false);
                } else {
                    toast.error("ID do formulário não encontrado.");
                }
            } catch (error) {
                console.error(error);
                toast.error("Erro ao salvar configurações.");
            }
        });
    };

    // Helper to safely update nested theme state
    const updateTheme = (
        section: 'page' | 'inputs' | 'buttons' | 'labels',
        property: string,
        value: string | number
    ) => {
        setLocalSettings(prev => ({
            ...prev,
            design: {
                ...prev.design,
                theme: {
                    ...prev.design.theme!,
                    [section]: {
                        ...prev.design.theme![section],
                        [property]: value
                    }
                }
            }
        }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            {trigger ? (
                <DialogTrigger asChild>{trigger}</DialogTrigger>
            ) : (
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurações
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="max-w-5xl h-[85vh] max-h-[850px] p-0 gap-0 overflow-hidden bg-background">
                <Tabs defaultValue="general" orientation="vertical" className="flex flex-col md:flex-row h-full w-full gap-0">
                    {/* Sidebar Navigation */}
                    <div className="w-full md:w-64 bg-muted/30 border-r py-6 px-4 flex flex-col gap-2 shrink-0">
                        <DialogHeader className="mb-6 px-2">
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <Settings className="w-5 h-5" /> Configurações
                            </DialogTitle>
                        </DialogHeader>

                        <TabsList className="flex flex-col h-auto bg-transparent gap-1 p-0 items-stretch">
                            <TabsTrigger
                                value="general"
                                className="justify-start gap-3 px-3 py-2.5 h-auto text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-colors w-full"
                            >
                                <Settings className="w-4 h-4" /> Geral
                            </TabsTrigger>
                            <TabsTrigger
                                value="design"
                                className="justify-start gap-3 px-3 py-2.5 h-auto text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-colors w-full"
                            >
                                <Palette className="w-4 h-4" /> Design e Cores
                            </TabsTrigger>
                            <TabsTrigger
                                value="integrations"
                                className="justify-start gap-3 px-3 py-2.5 h-auto text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-colors w-full"
                            >
                                <Zap className="w-4 h-4" /> Integrações
                            </TabsTrigger>
                            <TabsTrigger
                                value="advanced"
                                className="justify-start gap-3 px-3 py-2.5 h-auto text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-colors w-full"
                            >
                                <ShieldAlert className="w-4 h-4" /> Avançado
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                        <div className="flex-1 overflow-y-auto px-6 py-8">
                            {/* GENERAL TAB */}
                            <TabsContent value="general" className="mt-0 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                {/* ... Content ... (I will keep the inside content as is, just ensuring wrapper is correct) 
                                    Wait, the tool requires me to provide replacement content. 
                                    I definitely don't want to re-paste the whole file. 
                                    I will try to target the top part (DialogContent down to Sidebar end) and the bottom part?
                                    No, I can't do split edits easily in one go if they are large helpers.
                                    
                                    Actually, I can just replace lines 104 to 142 (Sidebar start) and correct the wrapping there.
                                */}
                                <div className="space-y-1 mb-6">
                                    <h3 className="text-lg font-semibold">Informações Gerais</h3>
                                    <p className="text-sm text-muted-foreground">Configurações básicas do seu formulário.</p>
                                </div>
                                {/* Reduced for brevity in prompt, but I need to be careful with replace_file_content. 
                                   I'll rewrite the layout structure. The TabsContent children are huge.
                                */ }
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nome do Formulário</Label>
                                        {/* ... */}
                                        <Input
                                            id="name"
                                            value={localSettings.general.name}
                                            onChange={(e) => setLocalSettings(prev => ({ ...prev, general: { ...prev.general, name: e.target.value } }))}
                                            placeholder="Ex: Formulário de Contato"
                                            className="max-w-md"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Descrição</Label>
                                        <Textarea
                                            id="description"
                                            value={localSettings.general.description}
                                            onChange={(e) => setLocalSettings(prev => ({ ...prev, general: { ...prev.general, description: e.target.value } }))}
                                            placeholder="Descreva o objetivo do formulário..."
                                            className="resize-none h-24 max-w-xl"
                                        />
                                    </div>
                                    <div className="pt-4 border-t">
                                        <Label className="text-base font-semibold mb-4 block">Ação após envio</Label>
                                        <div className="grid gap-4 max-w-xl">
                                            <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/30 cursor-pointer" onClick={() => setLocalSettings(prev => ({ ...prev, general: { ...prev.general, afterSubmission: 'message' } }))}>
                                                <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center ${localSettings.general.afterSubmission === 'message' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                                                    {localSettings.general.afterSubmission === 'message' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <span className="font-medium text-sm">Mostrar mensagem de sucesso</span>
                                                    {localSettings.general.afterSubmission === 'message' && (
                                                        <Textarea
                                                            value={localSettings.general.successMessage}
                                                            onChange={(e) => setLocalSettings(prev => ({ ...prev, general: { ...prev.general, successMessage: e.target.value } }))}
                                                            className="resize-none text-sm"
                                                            placeholder="Sua mensagem de agradecimento..."
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/30 cursor-pointer" onClick={() => setLocalSettings(prev => ({ ...prev, general: { ...prev.general, afterSubmission: 'redirect' } }))}>
                                                <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center ${localSettings.general.afterSubmission === 'redirect' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                                                    {localSettings.general.afterSubmission === 'redirect' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <span className="font-medium text-sm">Redirecionar para URL</span>
                                                    {localSettings.general.afterSubmission === 'redirect' && (
                                                        <Input
                                                            value={localSettings.general.redirectUrl}
                                                            onChange={(e) => setLocalSettings(prev => ({ ...prev, general: { ...prev.general, redirectUrl: e.target.value } }))}
                                                            placeholder="https://seu-site.com/obrigado"
                                                            className="text-sm"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            {/* ... Rest of tabs content (design, integration, advanced) ... 
                                I cannot output "..." effectively. I should just start from line 104 and go down to 207 (end of General Tab) 
                                and close the tags properly, then I can assume the rest follows.
                                
                                Wait, I can't leave the file half-broken.
                                I'll just replace the START and END of the layout, but the middle is hard.
                                
                                Strategy: 
                                1. Replace the top part (DialogContent, Sidebar, Start of Content Wrapper)
                                2. Replace the bottom part (End of Content Wrapper, DialogFooter)
                                
                                The issue is that I need to wrap EVERYTHING in <Tabs>.
                                
                                PREVIOUS CODE:
                                <DialogContent>
                                   <div ... sidebar > ... <Tabs> ... </Tabs> </div>
                                   <div ... content > ... </div>
                                </DialogContent>
                                
                                NEW CODE:
                                <DialogContent>
                                   <Tabs>
                                      <div ... sidebar > ... <TabsList> ... </TabsList> </div>
                                      <div ... content > ... <TabsContent> ... </TabsContent> </div>
                                   </Tabs>
                                </DialogContent>
                                
                                This is a structural change that affects the whole file indentation potentially, but I can keep indentation dirty.
                                I must remove the <Tabs> from inside the sidebar and put it outside.
                            */}


                            {/* DESIGN TAB */}
                            <TabsContent value="design" className="mt-0 h-full animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex flex-col lg:flex-row gap-8 h-full">
                                    {/* Controls */}
                                    <div className="flex-1 space-y-6 pb-20">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-semibold">Personalização Visual</h3>
                                            <p className="text-sm text-muted-foreground">Defina a identidade visual do seu formulário.</p>
                                        </div>

                                        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="page">

                                            {/* Page Group */}
                                            <AccordionItem value="page" className="border rounded-lg px-4 bg-card">
                                                <AccordionTrigger className="hover:no-underline py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-md bg-primary/10 text-primary"><Palette className="w-4 h-4" /></div>
                                                        <span className="font-semibold">Página e Fundo</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-2 pb-6 space-y-6">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <ColorPickerControl
                                                            label="Cor de Fundo"
                                                            value={localSettings.design.theme?.page.backgroundColor || '#ffffff'}
                                                            onChange={(v) => updateTheme('page', 'backgroundColor', v)}
                                                        />
                                                        <ColorPickerControl
                                                            label="Cor do Texto"
                                                            value={localSettings.design.theme?.page.textColor || '#000000'}
                                                            onChange={(v) => updateTheme('page', 'textColor', v)}
                                                        />
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>

                                            {/* Inputs Group */}
                                            <AccordionItem value="inputs" className="border rounded-lg px-4 bg-card">
                                                <AccordionTrigger className="hover:no-underline py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-md bg-primary/10 text-primary"><FileText className="w-4 h-4" /></div>
                                                        <span className="font-semibold">Campos e Inputs</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-2 pb-6 space-y-6">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <ColorPickerControl
                                                            label="Fundo do Campo"
                                                            value={localSettings.design.theme?.inputs.backgroundColor || '#ffffff'}
                                                            onChange={(v) => updateTheme('inputs', 'backgroundColor', v)}
                                                        />
                                                        <ColorPickerControl
                                                            label="Cor da Borda"
                                                            value={localSettings.design.theme?.inputs.borderColor || '#e2e8f0'}
                                                            onChange={(v) => updateTheme('inputs', 'borderColor', v)}
                                                        />
                                                        {/* Added Input Text Color as requested */}
                                                        <ColorPickerControl
                                                            label="Cor do Texto"
                                                            value={localSettings.design.theme?.inputs.textColor || '#000000'}
                                                            onChange={(v) => updateTheme('inputs', 'textColor', v)}
                                                        />
                                                        <ColorPickerControl
                                                            label="Cor da Label"
                                                            value={localSettings.design.theme?.labels.textColor || '#000000'}
                                                            onChange={(v) => updateTheme('labels', 'textColor', v)}
                                                        />
                                                    </div>

                                                    <div className="space-y-3 pt-2">
                                                        <div className="flex justify-between">
                                                            <Label className="uppercase text-xs font-medium text-muted-foreground">Arredondamento</Label>
                                                            <span className="text-xs text-muted-foreground">{localSettings.design.theme?.inputs.borderRadius}px</span>
                                                        </div>
                                                        <Slider
                                                            value={[localSettings.design.theme?.inputs.borderRadius || 4]}
                                                            max={20}
                                                            step={1}
                                                            onValueChange={(vals) => updateTheme('inputs', 'borderRadius', vals[0])}
                                                        />
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>

                                            {/* Buttons Group */}
                                            <AccordionItem value="buttons" className="border rounded-lg px-4 bg-card">
                                                <AccordionTrigger className="hover:no-underline py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-md bg-primary/10 text-primary"><div className="w-4 h-2 rounded-sm bg-current" /></div>
                                                        <span className="font-semibold">Botões</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-2 pb-6 space-y-6">
                                                    <div className="space-y-2">
                                                        <Label className="uppercase text-xs font-medium text-muted-foreground">Texto do Botão</Label>
                                                        <Input
                                                            value={localSettings.design.buttonText}
                                                            onChange={(e) => setLocalSettings(prev => ({ ...prev, design: { ...prev.design, buttonText: e.target.value } }))}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <ColorPickerControl
                                                            label="Cor de Fundo"
                                                            value={localSettings.design.theme?.buttons.backgroundColor || '#2563EB'}
                                                            onChange={(v) => updateTheme('buttons', 'backgroundColor', v)}
                                                        />
                                                        <ColorPickerControl
                                                            label="Cor do Texto"
                                                            value={localSettings.design.theme?.buttons.textColor || '#ffffff'}
                                                            onChange={(v) => updateTheme('buttons', 'textColor', v)}
                                                        />
                                                    </div>
                                                    <div className="space-y-3 pt-2">
                                                        <div className="flex justify-between">
                                                            <Label className="uppercase text-xs font-medium text-muted-foreground">Arredondamento</Label>
                                                            <span className="text-xs text-muted-foreground">{localSettings.design.theme?.buttons.borderRadius}px</span>
                                                        </div>
                                                        <Slider
                                                            value={[localSettings.design.theme?.buttons.borderRadius || 4]}
                                                            max={30}
                                                            step={1}
                                                            onValueChange={(vals) => updateTheme('buttons', 'borderRadius', vals[0])}
                                                        />
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>

                                    {/* Preview - Right Side (Sticky) */}
                                    <div className="hidden lg:block w-[380px] shrink-0">
                                        <div className="sticky top-0 bg-muted/20 border rounded-xl overflow-hidden shadow-sm">
                                            <div className="bg-muted/50 p-3 border-b flex items-center justify-between">
                                                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Preview ao Vivo</span>
                                                <div className="flex gap-1.5">
                                                    <div className="w-2 h-2 rounded-full bg-red-400/50" />
                                                    <div className="w-2 h-2 rounded-full bg-yellow-400/50" />
                                                    <div className="w-2 h-2 rounded-full bg-green-400/50" />
                                                </div>
                                            </div>
                                            <div
                                                className="p-8 min-h-[400px] flex flex-col gap-5 transition-colors duration-300"
                                                style={{
                                                    backgroundColor: localSettings.design.theme?.page.backgroundColor || '#ffffff',
                                                    color: localSettings.design.theme?.page.textColor || '#000000',
                                                }}
                                            >
                                                {/* Header Mock */}
                                                <div className="mb-2">
                                                    <h4 className="text-xl font-bold" style={{ color: localSettings.design.theme?.page.textColor }}>Fale Conosco</h4>
                                                    <p className="text-sm opacity-80" style={{ color: localSettings.design.theme?.page.textColor }}>Preencha seus dados abaixo.</p>
                                                </div>

                                                {/* Mock Field 1 */}
                                                <div className="space-y-1.5">
                                                    <label className="text-sm font-medium" style={{ color: localSettings.design.theme?.labels.textColor }}>Nome Completo</label>
                                                    <div
                                                        className="h-10 w-full rounded-md border px-3 py-2 text-sm flex items-center shadow-sm"
                                                        style={{
                                                            backgroundColor: localSettings.design.theme?.inputs.backgroundColor,
                                                            borderColor: localSettings.design.theme?.inputs.borderColor,
                                                            color: localSettings.design.theme?.inputs.textColor,
                                                            borderRadius: `${localSettings.design.theme?.inputs.borderRadius}px`,
                                                        }}
                                                    >
                                                        Alessandro
                                                    </div>
                                                </div>

                                                {/* Mock Field 2 */}
                                                <div className="space-y-1.5">
                                                    <label className="text-sm font-medium" style={{ color: localSettings.design.theme?.labels.textColor }}>Email</label>
                                                    <div
                                                        className="h-10 w-full rounded-md border px-3 py-2 text-sm flex items-center shadow-sm"
                                                        style={{
                                                            backgroundColor: localSettings.design.theme?.inputs.backgroundColor,
                                                            borderColor: localSettings.design.theme?.inputs.borderColor,
                                                            color: localSettings.design.theme?.inputs.textColor,
                                                            borderRadius: `${localSettings.design.theme?.inputs.borderRadius}px`,
                                                        }}
                                                    >
                                                        alessandro@example.com
                                                    </div>
                                                </div>

                                                {/* Mock Button */}
                                                <button
                                                    className="h-10 px-6 py-2 mt-4 w-full font-medium transition-opacity hover:opacity-90 shadow-sm"
                                                    style={{
                                                        backgroundColor: localSettings.design.theme?.buttons.backgroundColor,
                                                        color: localSettings.design.theme?.buttons.textColor,
                                                        borderRadius: `${localSettings.design.theme?.buttons.borderRadius}px`,
                                                    }}
                                                >
                                                    {localSettings.design.buttonText || 'Enviar Mensagem'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* INTEGRATIONS TAB */}
                            <TabsContent value="integrations" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-1 mb-6">
                                    <h3 className="text-lg font-semibold">Integrações</h3>
                                    <p className="text-sm text-muted-foreground">Conecte seu formulário a outras ferramentas.</p>
                                </div>

                                <div className="border rounded-xl p-6 bg-card hover:border-primary/50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-lg bg-[#FF4F00]/10 text-[#FF4F00]">
                                                <Zap className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold flex items-center">Zapier <PremiumBadge /></h3>
                                                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                                                    Automatize fluxos de trabalho conectando com mais de 5.000 apps.
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="border-primary/20 hover:bg-primary/5 hover:text-primary">Conectar</Button>
                                    </div>
                                </div>

                                <div className="border rounded-xl p-6 bg-muted/20 border-dashed">
                                    <div className="flex flex-col items-center justify-center text-center py-8">
                                        <div className="p-4 rounded-full bg-muted mb-4 opacity-50">
                                            <Webhook className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="font-semibold mb-2">Mais integrações em breve</h3>
                                        <p className="text-sm text-muted-foreground max-w-xs">
                                            Estamos trabalhando para adicionar Google Sheets, Slack, e Notion.
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* ADVANCED TAB */}
                            <TabsContent value="advanced" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-1 mb-6">
                                    <h3 className="text-lg font-semibold">Configurações Avançadas</h3>
                                    <p className="text-sm text-muted-foreground">Controle de acesso e branding.</p>
                                </div>

                                <div className="border rounded-xl p-5 bg-card flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 rounded-lg bg-muted text-muted-foreground">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium flex items-center">Branding do Formu <PremiumBadge /></h4>
                                            <p className="text-xs text-muted-foreground">Exibir "Criado com Formu" no rodapé</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={localSettings.design.branding !== false}
                                        onCheckedChange={(c) => setLocalSettings(prev => ({ ...prev, design: { ...prev.design, branding: c } }))}
                                        disabled // Premium feature locked
                                    />
                                </div>

                                <div className="border rounded-xl p-5 bg-card space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Notificações por Email</h4>
                                                <p className="text-xs text-muted-foreground">Receba dados de cada envio no seu email</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={localSettings.advanced.notificationEnabled}
                                            onCheckedChange={(c) => setLocalSettings(prev => ({ ...prev, advanced: { ...prev.advanced, notificationEnabled: c } }))}
                                        />
                                    </div>
                                    {localSettings.advanced.notificationEnabled && (
                                        <div className="pl-14 animate-in slide-in-from-top-2">
                                            <Input
                                                value={localSettings.advanced.notificationEmail}
                                                onChange={(e) => setLocalSettings(prev => ({ ...prev, advanced: { ...prev.advanced, notificationEmail: e.target.value } }))}
                                                placeholder="email@empresa.com"
                                                className="max-w-md"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="border rounded-xl p-5 bg-card space-y-3">
                                        <Label className="flex items-center gap-2">
                                            <ShieldAlert className="w-4 h-4 text-muted-foreground" />
                                            Limite de Respostas
                                        </Label>
                                        <Input
                                            type="number"
                                            placeholder="Ilimitado"
                                            value={localSettings.advanced.maxResponses || ''}
                                            onChange={(e) => setLocalSettings(prev => ({ ...prev, advanced: { ...prev.advanced, maxResponses: e.target.value ? parseInt(e.target.value) : undefined } }))}
                                        />
                                    </div>

                                    <div className="border rounded-xl p-5 bg-card space-y-3">
                                        <Label className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            Data de Encerramento
                                        </Label>
                                        <Input type="date" />
                                    </div>
                                </div>
                            </TabsContent>
                        </div>

                        <DialogFooter className="flex justify-end gap-3 p-4 border-t bg-background">
                            <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancelar</Button>
                            <Button onClick={handleSave} disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar Alterações
                            </Button>
                        </DialogFooter>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
