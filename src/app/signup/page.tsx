"use client"

import Link from "next/link"
import { signup } from "@/app/auth/actions"
import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SubmitButton } from "@/components/auth/submit-button"

export default function SignupPage() {
    const [state, formAction] = useActionState(signup, null)

    if (state?.success) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <div className="flex justify-center mb-4">
                            <CheckCircle2 className="h-12 w-12 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight text-center">
                            Confirme seu email
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enviamos um link de confirmação para o seu email. Por favor, verifique sua caixa de entrada (e spam) para ativar sua conta.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex flex-col space-y-2 text-center pt-4">
                        <Button asChild className="w-full">
                            <Link href="/login">Voltar para Login</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">
                        Crie sua conta
                    </CardTitle>
                    <CardDescription className="text-center">
                        Comece a criar formulários incríveis hoje
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {state?.error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Erro</AlertTitle>
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Nome Completo</Label>
                            <Input id="fullName" name="fullName" placeholder="Ex: Maria Silva" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                            <Input id="confirmPassword" name="confirmPassword" type="password" required />
                        </div>
                        <SubmitButton className="w-full" loadingText="Criando conta...">
                            Criar Conta
                        </SubmitButton>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 text-center">
                    <div className="text-sm text-muted-foreground">
                        Já tem uma conta?{" "}
                        <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                            Entrar
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
