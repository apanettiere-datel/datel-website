import { NextRequest, NextResponse } from 'next/server'

export function GET(request: NextRequest) {
  const iconUrl = new URL('/img/logos/10-color-black-height-32.svg', request.url)
  return NextResponse.redirect(iconUrl, 308)
}
