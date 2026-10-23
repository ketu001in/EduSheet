import { type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // 3D model assets (.gltf/.glb/.bin) added alongside the existing image
    // extensions -- same reasoning: these are public, non-sensitive static
    // files (Robotics Lab's real 3D models), and without this exclusion
    // every one of a model's several files (scene.gltf + scene.bin +
    // textures) would each trigger a Supabase auth round-trip in
    // middleware before being served, needlessly slowing down every model
    // load for an already-logged-in user.
    //
    // `workers/` excluded too -- Coding Lab's real JS/Python execution
    // runs in dedicated Web Workers loaded from /public/workers/*.js.
    // Without this exclusion, a Worker's script fetch went through
    // middleware like any other route and got redirected to /login
    // (a 303, then an HTML page) whenever there was no valid session on
    // that sub-resource request -- the browser then tried to parse that
    // HTML as JavaScript and threw "Unexpected token '<'", caught live
    // during verification. Worker scripts are public, static, and
    // contain no user data, so they belong in this same exclusion list.
    '/((?!_next/static|_next/image|favicon.ico|workers/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|gltf|glb|bin)$).*)',
  ],
}
