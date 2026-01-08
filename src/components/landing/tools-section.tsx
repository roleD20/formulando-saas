"use client"

export function ToolsSection() {
  return (
    <section id="solucoes" className="py-20 lg:py-32 bg-gradient-to-b from-white to-purple-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              Experimente a versatilidade da ferramenta de criação de formulários
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              O Formulando oferece uma suíte completa de ferramentas projetadas para
              capacitá-lo a criar, gerenciar e otimizar seus formulários com flexibilidade
              e controle incomparáveis.
            </p>
          </div>

          {/* Placeholder for desktop mockup */}
          <div className="relative mt-12">
            <div className="relative mx-auto max-w-5xl">
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-200 shadow-2xl shadow-purple-500/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-700 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">F</span>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Visualização da ferramenta será adicionada aqui
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

