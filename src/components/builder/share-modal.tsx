"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, Globe, Code, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export function ShareModal({ trigger }: { trigger?: React.ReactNode }) {
    const params = useParams();
    const formId = params.id as string;
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedEmbed, setCopiedEmbed] = useState(false);

    // Ensure we have a window object for the origin (client-side only)
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${origin}/submit/${formId}`;
    const embedCode = `<iframe src="${shareUrl}" width="100%" height="600px" frameborder="0" style="border: none; border-radius: 8px; overflow: hidden;"></iframe>`;

    const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copiado para a área de transferência!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="gap-2">
                        <Share2 className="w-4 h-4" />
                        Compartilhar
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-primary" />
                        Compartilhar Formulário
                    </DialogTitle>
                    <DialogDescription>
                        Envie o link para seus usuários ou incorpore em seu site.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="link" className="w-full mt-2">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="link" className="gap-2">
                            <Globe className="w-4 h-4" /> Link Público
                        </TabsTrigger>
                        <TabsTrigger value="embed" className="gap-2">
                            <Code className="w-4 h-4" /> Incorporar (Iframe)
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="link" className="space-y-4 py-4">
                        <div className="flex items-center justify-center p-6 bg-muted/20 rounded-xl border border-dashed mb-4">
                            <div className="text-center space-y-2">
                                <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <h4 className="font-medium">Seu formulário está pronto!</h4>
                                <p className="text-xs text-muted-foreground max-w-[250px] mx-auto">
                                    Qualquer pessoa com este link pode acessar e responder ao formulário.
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="link" className="sr-only">Link</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="link"
                                    readOnly
                                    value={shareUrl}
                                    className="bg-muted text-muted-foreground font-mono text-sm"
                                />
                                <Button
                                    size="icon"
                                    onClick={() => copyToClipboard(shareUrl, setCopiedLink)}
                                    className={copiedLink ? "bg-green-600 hover:bg-green-700" : ""}
                                >
                                    {copiedLink ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <Button variant="link" className="text-xs text-muted-foreground h-auto p-0" onClick={() => window.open(shareUrl, '_blank')}>
                                Abrir link em nova aba <Globe className="w-3 h-3 ml-1" />
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="embed" className="space-y-4 py-4">
                        <div className="flex items-center justify-center p-6 bg-muted/20 rounded-xl border border-dashed mb-4">
                            <div className="text-center space-y-2">
                                <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-2">
                                    <Code className="w-6 h-6" />
                                </div>
                                <h4 className="font-medium">Incorpore no seu site</h4>
                                <p className="text-xs text-muted-foreground max-w-[250px] mx-auto">
                                    Copie o código abaixo e cole no HTML do seu site ou construtor de páginas.
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="embed" className="sr-only">Código Embed</Label>
                            <div className="relative">
                                <Textarea
                                    id="embed"
                                    readOnly
                                    value={embedCode}
                                    className="bg-muted text-muted-foreground font-mono text-xs h-[100px] resize-none pr-10"
                                />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(embedCode, setCopiedEmbed)}
                                    className={`absolute top-2 right-2 h-8 w-8 ${copiedEmbed ? "text-green-600" : "text-muted-foreground"}`}
                                >
                                    {copiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
