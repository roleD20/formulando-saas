"use client"

export function PartnersSection() {
  const partners = [
    "Amazon",
    "LinkedIn",
    "Zoom",
    "Microsoft",
    "Eventbrite",
    "Upwork",
    "Gusto",
    "Slack",
    "Oracle",
  ]

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm text-gray-500 mb-8">
            Confiado por empresas líderes
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="text-gray-400 font-semibold text-lg lg:text-xl hover:text-purple-600 transition-colors"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

