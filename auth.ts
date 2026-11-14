import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { authenticateSchoolUser } from '@/lib/authUsers';

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(256),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: { signIn: '/login' },
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Adresse courriel', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        return authenticateSchoolUser(parsed.data.email, parsed.data.password);
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.teacherId = user.teacherId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && (token.role === 'director' || token.role === 'teacher')) {
        session.user.id = token.sub ?? '';
        session.user.role = token.role;
        session.user.teacherId = token.teacherId ?? null;
      }
      return session;
    },
    authorized({ auth: session, request }) {
      const path = request.nextUrl.pathname;
      if (path === '/login') return true;
      if (!session?.user) return false;
      if (session.user.role === 'director') return true;
      return session.user.role === 'teacher' && (path === '/classes' || path === '/classrooms');
    },
  },
});
