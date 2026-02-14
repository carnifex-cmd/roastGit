import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only process /roast/[username] routes
    const match = pathname.match(/^\/roast\/([^/]+)$/);
    if (!match) return NextResponse.next();

    const username = match[1];
    const lowercase = username.toLowerCase();

    // Redirect to lowercase if different (301 permanent for SEO)
    if (username !== lowercase) {
        const url = request.nextUrl.clone();
        url.pathname = `/roast/${lowercase}`;
        return NextResponse.redirect(url, 301);
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/roast/:username",
};
