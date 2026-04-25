
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|slack|graphql|graphiql|_profiler|logout).*)',
  ],
}
// Paths that can be accessed without authentication
const PUBLIC_PATHS = [
  '/slack/login',
  '/slack/callback',
  '/slack/redirect',
  '/logout',
  '/graphql',
  '/graphiql',
  '/_profiler',
]

export function middleware(req: NextRequest) {
  const token = req.cookies.get('slack_jwt')?.value
  const path = req.nextUrl.pathname

  const isPublic = PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath))

  if (token == null && !isPublic) {
    const redirectTo = encodeURIComponent(path + req.nextUrl.search)
    return NextResponse.redirect(new URL(`/slack/redirect?redirect=${redirectTo}`, req.url))
  }

  return NextResponse.next()
}
