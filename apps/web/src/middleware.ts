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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|gltf|glb|bin)$).*)',
  ],
}
