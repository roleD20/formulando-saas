"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Calendar, Users, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export function TeamworkSection() {
  const features = [
    {
      icon: MessageSquare,
      title: "Colaboração em tempo real",
      description:
        "Trabalhe junto com os membros da sua equipe em tempo real, compartilhe feedback e faça edições simultaneamente para garantir que todos estejam na mesma página.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Calendar,
      title: "Gerenciamento de tarefas fácil",
      description:
        "Atribua tarefas, defina prazos e acompanhe o progresso para manter seus projetos organizados e no prazo, garantindo conclusão oportuna.",
      gradient: "from-purple-600 to-pink-500",
    },
  ]

  const stats = [
    {
      icon: Users,
      value: "Ilimitado",
      label: "Colaboradores",
    },
    {
      icon: Zap,
      value: "Em tempo real",
      label: "Sincronização",
    },
  ]

  return (
    <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              Trabalho em equipe{" "}
              <span className="bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
                eficiente
              </span>{" "}
              para resultados mais rápidos
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              O Formulando simplifica seu fluxo de trabalho, permitindo colaboração
              perfeita entre membros da equipe e acelerando a entrega de projetos.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-lg"
                >
                  <Icon className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className={cn(
                    "border-2 border-gray-100 hover:border-purple-200",
                    "transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10",
                    "hover:-translate-y-2 group cursor-pointer",
                    "relative overflow-hidden"
                  )}
                >
                  {/* Gradient background on hover */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300",
                    feature.gradient
                  )} />

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

                  {/* Animated border */}
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
      </div>
    </section>
  )
}

