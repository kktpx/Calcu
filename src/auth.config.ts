import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') || 
                            nextUrl.pathname.startsWith('/meals') ||
                            nextUrl.pathname.startsWith('/weight');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        if (nextUrl.pathname === '/login' || nextUrl.pathname === '/register') {
           return Response.redirect(new URL('/dashboard', nextUrl));
        }
      }
      return true;
    },
  },
  providers: [], // Providers are added in auth.ts to avoid edge runtime issues with bcrypt
} satisfies NextAuthConfig;
