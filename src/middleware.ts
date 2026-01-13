import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
    const url = request.nextUrl

    // Get hostname (e.g., 'platform.vercel.app' or 'custom.domain.com')
    let hostname = request.headers.get("host")!.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)

    // Handle Vercel preview URLs or localhost during dev properly if needed
    if (hostname.includes("localhost:3000")) {
        hostname = hostname.replace("localhost:3000", process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost")
    }

    const searchParams = request.nextUrl.searchParams.toString()
    // Get the pathname of the request (e.g. /, /about, /blog/first-post)
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`

    // Check if it's the root domain (App)
    if (hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
        return await updateSession(request)
    }

    // It's a custom domain!
    // We need to fetch the LP slug associated with this domain.
    // Note: Middleware runs on Edge, so we need compatible DB access. 
    // Supabase JS client is Edge compatible.

    // HOWEVER: We can't use 'createClient' from '@/lib/supabase/server' directly as it uses 'cookies' 
    // which might differ in edge context or we need a specific client.
    // Let's us a simple non-auth client or the default one.
    // Ideally we'd use a separate utility for edge data fetching or just fetch directly if possible.
    // For now, let's assume updateSession handles auth, but for public LPs we just need to read.

    const response = NextResponse.next()
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ) as any // Cast to avoid type issues with different CreateClient versions if any

    // Simple fetch
    // Note: This adds latency to every request on custom domains. 
    // In prod, you'd cache this (e.g. Vercel KV or Edge Config).
    const { data: lp } = await supabase
        .from("landing_pages")
        .select("slug")
        .eq("custom_domain", hostname)
        .single()

    if (lp) {
        // Rewrite to the LP page
        // We rewrite to /lp/[slug] but we might want to keep the path? 
        // Typically LPs are single page, but if you have /thank-you, etc.
        // For this MVP, we rewrite everything to the LP slug, unless we support multi-page LPs.
        // If path is just /, rewrite to /lp/[slug]

        if (path === '/') {
            return NextResponse.rewrite(new URL(`/lp/${lp.slug}`, request.url))
        }

        // If we want to support assets or specific routes, we'd handle them here.
        // For now, let's just rewrite root.
    }

    // If domain not found, 404
    if (!lp && hostname !== process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
        // return NextResponse.rewrite(new URL("/404", request.url)) // Or a custom 404
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all paths except:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
    ],
}
