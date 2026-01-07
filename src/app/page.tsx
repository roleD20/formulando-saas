import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 text-center space-y-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Formu
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
          Crie formulários e páginas de captura incríveis em minutos.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/login">Entrar</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/signup">Criar Conta</Link>
        </Button>
      </div>
    </div>
  )
}
