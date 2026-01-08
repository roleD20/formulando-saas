"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function ContentManagementSection() {
  const features = [
    {
      text: "Crie, edite e publique formulários facilmente com nosso editor intuitivo, projetado tanto para iniciantes quanto para usuários experientes.",
      color: "from-purple-700 to-purple-500",
    },
    {
      text: "Organize seus formulários com categorias, tags e campos personalizados, facilitando para os visitantes encontrarem o que estão procurando.",
      color: "from-purple-600 to-pink-500",
    },
    {
      text: "Agende publicação de formulários, gerencie rascunhos e revise alterações com um sistema robusto de controle de versão.",
      color: "from-purple-700 to-blue-500",
    },
  ]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-purple-50/30 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-8">
                Simplifique a experiência de{" "}
                <span className="bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
                  gerenciamento
                </span>
              </h2>
              <ul className="space-y-6">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex gap-4 group cursor-pointer"
                  >
                    <div className={cn(
                      "flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br flex items-center justify-center mt-0.5",
                      "shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300",
                      feature.color
                    )}>
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-lg text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                      {feature.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Placeholder for desktop mockup with enhanced styling */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl blur-2xl opacity-20" />
              
              <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-200 shadow-2xl shadow-purple-500/20 flex items-center justify-center overflow-hidden group">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-700 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-white text-4xl font-bold">F</span>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Visualização do gerenciador será adicionada aqui
                  </p>
                </div>

                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

