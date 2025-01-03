import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Check if user is barbershop owner for barbershop routes
    if (req.nextUrl.pathname.startsWith('/dashboard/barbershop')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('type')
        .eq('id', session.user.id)
        .single()

      if (profile?.type !== 'barbershop') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
  }

  return res
}