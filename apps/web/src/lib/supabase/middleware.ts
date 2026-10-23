import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const AUTH_TIMEOUT_MS = 8000

// Shown instead of a raw Vercel 504 when Supabase doesn't answer in time.
// API callers get JSON; browsers get a page that retries on its own.
function unavailableResponse(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable. Please try again shortly.' },
      { status: 503, headers: { 'Retry-After': '15' } }
    )
  }
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="15"><title>Back in a moment</title><style>body{font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#f8fafc;color:#0f172a}main{max-width:420px;padding:24px;text-align:center}p{color:#475569}</style></head><body><main><h1>Back in a moment</h1><p>We're having trouble reaching our servers. This page will retry automatically in 15 seconds.</p></main></body></html>`
  return new NextResponse(html, {
    status: 503,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Retry-After': '15', 'Cache-Control': 'no-store' },
  })
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const publicPaths = ['/login', '/auth', '/register', '/forgot-password', '/privacy', '/contact', '/api/auth', '/api/keep-alive'];
  const isPublicPath = publicPaths.some((p) => request.nextUrl.pathname.startsWith(p)) || request.nextUrl.pathname === '/';

  // getUser() is a network call to Supabase. If Supabase is paused or
  // unreachable it never answers and Vercel kills the middleware with a
  // 504 MIDDLEWARE_INVOCATION_TIMEOUT. Cap it so the site fails fast.
  const result = await Promise.race([
    supabase.auth.getUser().then((r) => ({ timedOut: false as const, user: r.data.user })),
    new Promise<{ timedOut: true }>((resolve) => setTimeout(() => resolve({ timedOut: true }), AUTH_TIMEOUT_MS)),
  ])

  if (result.timedOut) {
    if (isPublicPath) return supabaseResponse
    return unavailableResponse(request)
  }
  const { user } = result

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    // 303 forces the browser to follow with GET, so a POST/fetch to a
    // protected route never gets redirected into an HTML page response.
    return NextResponse.redirect(url, 303)
  }

  return supabaseResponse
}
