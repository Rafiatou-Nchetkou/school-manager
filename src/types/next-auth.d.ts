import 'next-auth';
import 'next-auth/jwt';
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    role: 'director' | 'teacher';
    teacherId: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: 'director' | 'teacher';
      teacherId: string | null;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'director' | 'teacher';
    teacherId?: string | null;
  }
}
