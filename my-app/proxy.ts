import { NextResponse, NextRequest } from 'next/server'
import getOrCreateDB from './models/server/dbSetup'
import getOrCreateStorage from './models/server/storage.collection'


// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    await Promise.all([
        getOrCreateDB(),
        getOrCreateStorage()
    ])
    return NextResponse.next()

}

export const config = {
    // match all request paths expect for the one that starts with - api -_next/static -next/image -favicon.com

    matcher: [
        '/api/:path*',
        '/_next/static/:path*',
        '/_next/image/:path*',
        '/favicon.ico',
    ],
} 