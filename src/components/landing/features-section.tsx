"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Layout, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function FeaturesSection() {
  const features = [
    {
      icon: Code,
      title: "Sem necessidade de código ou experiência em design",
      description:
        "A interface intuitiva de arrastar e soltar do Formulando e os templates pré-projetados facilitam para qualquer pessoa criar um formulário profissional sem escrever uma única linha de código.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Layout,
      title: "Ferramentas de construção fáceis de usar",
      description:
        "Nossa suíte completa de ferramentas permite personalizar todos os aspectos do seu formulário, desde layout e design até conteúdo e funcionalidade, com facilidade.",
      gradient: "from-purple-600 to-blue-500",
    },
    {
      icon: TrendingUp,
      title: "Cresça seu negócio online",
      description:
        "Construa uma presença online forte que atraia mais clientes, aumente as conversões e ajude seu negócio a prosperar no cenário digital.",
      gradient: "from-purple-700 to-purple-500",
    },
  ]

  return (
    <section id="recursos" className="py-20 lg:py-32 bg-gradient-to-b from-white to-purple-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
            Transforme sua presença online com{" "}
            <span className="bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
              criatividade sem esforço
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Nossa plataforma garante que sua jornada de formulários esteja repleta
            de vantagens incomparáveis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className={cn(
                  "border-2 border-gray-100 hover:border-purple-200",
                  "transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10",
                  "hover:-translate-y-2 group cursor-pointer",
                  "relative overflow-hidden"
                )}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardHeader className="relative">
                  <div className={cn(
                    "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4",
                    "shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300",
                    feature.gradient
                  )}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2 group-hover:text-purple-700 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>

                {/* Bottom accent */}
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r",
                  feature.gradient,
                  "transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                )} />
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

