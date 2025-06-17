import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.headers.get('host') === 'research-paper-app-ashen.vercel.app') {
    return NextResponse.redirect('https://demo.exa.ai/research-paper-app', {
      status: 301,
    })
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
} 