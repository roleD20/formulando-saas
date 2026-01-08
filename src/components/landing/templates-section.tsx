"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ArrowRight, Eye, Heart } from "lucide-react"
import Link from "next/link"

export function TemplatesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const templates = [
    {
      name: "Formulário de Contato",
      category: "Contato",
      color: "from-blue-500 to-cyan-500",
      popular: false,
    },
    {
      name: "Formulário de Inscrição",
      category: "Eventos",
      color: "from-purple-500 to-pink-500",
      popular: true,
    },
    {
      name: "Formulário de Pesquisa",
      category: "Pesquisa",
      color: "from-orange-500 to-red-500",
      popular: false,
    },
    {
      name: "Formulário de Feedback",
      category: "Feedback",
      color: "from-green-500 to-emerald-500",
      popular: false,
    },
    {
      name: "Formulário de Orçamento",
      category: "Vendas",
      color: "from-purple-600 to-purple-400",
      popular: true,
    },
    {
      name: "Formulário de Cadastro",
      category: "Cadastro",
      color: "from-indigo-500 to-blue-500",
      popular: false,
    },
  ]

  return (
    <section id="templates" className="py-20 lg:py-32 bg-gradient-to-b from-white to-purple-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              Encontre o ponto de partida perfeito com nossos{" "}
              <span className="bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
                templates
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore nossa coleção diversificada de templates profissionalmente
              projetados, criados para atender várias indústrias e propósitos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {templates.map((template, index) => (
              <Card
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "border-2 transition-all duration-300 cursor-pointer group overflow-hidden",
                  "hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2",
                  template.popular
                    ? "border-purple-300"
                    : "border-gray-100 hover:border-purple-200"
                )}
              >
                <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-purple-50 rounded-t-lg overflow-hidden">
                  {/* Gradient overlay */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-20 transition-opacity duration-300",
                    template.color,
                    hoveredIndex === index ? "opacity-40" : "opacity-20"
                  )} />
                  
                  {/* Content */}
                  <div className="relative h-full flex items-center justify-center p-4">
                    <div className="text-center">
                      <div className={cn(
                        "w-16 h-16 mx-auto mb-2 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-lg transition-transform duration-300",
                        template.color,
                        hoveredIndex === index && "scale-110"
                      )}>
                        <span className="text-white text-2xl font-bold">F</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Hover overlay with actions */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent",
                    "flex items-end justify-center gap-2 p-4",
                    "transition-opacity duration-300",
                    hoveredIndex === index ? "opacity-100" : "opacity-0"
                  )}>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-white hover:text-white hover:bg-white/20"
                    >
                      <Heart className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Popular badge */}
                  {template.popular && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-gradient-to-r from-purple-700 to-purple-500 border-0 shadow-lg">
                        Popular
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                    {template.name}
                  </h3>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              asChild
              size="lg"
              className={cn(
                "bg-gradient-to-r from-purple-700 to-purple-500",
                "hover:from-purple-800 hover:to-purple-600",
                "text-white border-0 shadow-lg shadow-purple-500/25",
                "hover:shadow-purple-500/40 hover:scale-105",
                "text-base px-8 py-6 h-auto transition-all duration-300"
              )}
            >
              <Link href="#templates">
                Ver todos os templates
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

