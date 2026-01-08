"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function FAQSection() {
  const faqs = [
    {
      question: "Preciso de conhecimento em programação para usar o Formulando?",
      answer:
        "Não, o Formulando é projetado para usuários de todos os níveis de habilidade. Nossa interface intuitiva de arrastar e soltar e templates pré-projetados permitem que você crie formulários incríveis sem escrever uma única linha de código. Se você é um desenvolvedor experiente, também pode acessar e personalizar o código para funcionalidades avançadas.",
    },
    {
      question: "Posso usar meu próprio domínio com o Formulando?",
      answer:
        "Sim! O Formulando permite que você conecte seu próprio domínio personalizado aos seus formulários. Isso ajuda a manter a consistência da marca e criar uma experiência profissional para seus visitantes.",
    },
    {
      question: "Que tipo de suporte está disponível para usuários do Formulando?",
      answer:
        "Oferecemos suporte abrangente através de nossa Central de Ajuda, documentação detalhada, e-mail de suporte e comunidade ativa. Usuários premium também têm acesso a suporte prioritário por chat.",
    },
    {
      question: "Meus dados estão seguros com o Formulando?",
      answer:
        "Absolutamente. Levamos a segurança dos dados muito a sério. Usamos criptografia SSL, seguimos as melhores práticas de segurança e estamos em conformidade com LGPD e GDPR. Seus dados e os dados dos seus formulários são protegidos com o mais alto nível de segurança.",
    },
  ]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-purple-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              Vamos responder todas as suas perguntas
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Tem perguntas sobre o Formulando? Temos respostas! Confira nossas
              perguntas frequentes para saber mais sobre nossa plataforma e como
              ela pode ajudá-lo.
            </p>
            <Button
              asChild
              className={cn(
                "bg-gradient-to-r from-purple-700 to-purple-500",
                "hover:from-purple-800 hover:to-purple-600",
                "text-white border-0 shadow-lg shadow-purple-500/25"
              )}
            >
              <Link href="#contato">Fazer uma pergunta</Link>
            </Button>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-purple-700">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}

