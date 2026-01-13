import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { LPRenderer } from "@/components/lp-builder/lp-renderer"
import { LPElement } from "@/components/lp-builder/types"
import { Metadata } from "next"

interface LPPublicPageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata(props: LPPublicPageProps): Promise<Metadata> {
    const params = await props.params
    const { slug } = params
    const supabase = await createClient()

    const { data: landingPage } = await supabase
        .from("landing_pages")
        .select("name, settings")
        .eq("slug", slug)
        .eq("is_published", true)
        .single()

    if (!landingPage) {
        return {
            title: "Landing Page não encontrada"
        }
    }

    return {
        title: landingPage.name,
        description: landingPage.settings?.description || `Landing Page: ${landingPage.name}`,
    }
}

export default async function LPPublicPage(props: LPPublicPageProps) {
    const params = await props.params
    const { slug } = params
    const supabase = await createClient()

    // Fetch published landing page
    const { data: landingPage, error } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single()

    if (error || !landingPage) {
        notFound()
    }

    const elements = (landingPage.content || []) as LPElement[]

    return (
        <div className="min-h-screen bg-white">
            <LPRenderer elements={elements} />
        </div>
    )
}
