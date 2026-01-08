"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const testimonials = [
    {
      name: "Maria Silva",
      role: "CEO, TechStart",
      content:
        "O Formulando transformou completamente como coletamos feedback dos clientes. A facilidade de uso é incomparável e a integração com nossas ferramentas foi perfeita.",
      rating: 5,
      avatar: "MS",
    },
    {
      name: "João Santos",
      role: "Marketing Manager, GrowthCo",
      content:
        "Desde que começamos a usar o Formulando, nossas taxas de conversão aumentaram 40%. Os templates são lindos e a personalização é infinita.",
      rating: 5,
      avatar: "JS",
    },
    {
      name: "Ana Costa",
      role: "Product Designer, DesignHub",
      content:
        "Como designer, sou muito exigente com ferramentas. O Formulando superou minhas expectativas em termos de design e funcionalidade.",
      rating: 5,
      avatar: "AC",
    },
    {
      name: "Pedro Oliveira",
      role: "Founder, StartupX",
      content:
        "A melhor plataforma de formulários que já usei. O suporte é excepcional e as funcionalidades de IA economizam muito tempo.",
      rating: 5,
      avatar: "PO",
    },
  ]

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  return (
    <section id="depoimentos" className="py-20 lg:py-32 bg-gradient-to-b from-purple-50/30 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -translate-y-1/2" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
            Amado por milhares de{" "}
            <span className="bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
              usuários
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Veja o que nossos clientes têm a dizer sobre o Formulando
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Carousel */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <Card className="border-2 border-purple-100 shadow-xl shadow-purple-500/10 bg-white/80 backdrop-blur-sm">
                    <CardContent className="pt-8 pb-8 px-8 lg:px-12">
                      {/* Quote icon */}
                      <Quote className="w-12 h-12 text-purple-200 mb-6" />

                      {/* Stars */}
                      <div className="flex gap-1 mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-purple-500 text-purple-500"
                          />
                        ))}
                      </div>

                      {/* Content */}
                      <p className="text-lg lg:text-xl text-gray-700 mb-8 leading-relaxed italic">
                        "{testimonial.content}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-4">
                        <Avatar className="w-14 h-14 border-2 border-purple-200">
                          <AvatarFallback className="bg-gradient-to-br from-purple-700 to-purple-500 text-white font-semibold text-lg">
                            {testimonial.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {testimonial.name}
                          </p>
                          <p className="text-sm text-gray-600">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full border-2 hover:border-purple-500 hover:bg-purple-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    setIsAutoPlaying(false)
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "bg-purple-600 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  )}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full border-2 hover:border-purple-500 hover:bg-purple-50"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

