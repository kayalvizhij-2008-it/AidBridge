import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import type { RoleId } from './roles';

export const authConfig: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'aidbridge-production-secret-auth-key-2026-unified',
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password.');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          include: { organisation: true },
        });

        if (!user) {
          throw new Error('No user found with this email address.');
        }

        if (user.status !== 'ACTIVE') {
          throw new Error('This account has been deactivated. Contact an administrator.');
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error('Invalid email or password.');
        }

        // Write an audit log for successful login
        try {
          await prisma.auditLog.create({
            data: {
              actorId: user.id,
              actorEmail: user.email,
              actorRole: user.role,
              action: 'LOGIN',
              entity: 'USER',
              entityId: user.id,
              details: JSON.stringify({ role: user.role, orgName: user.organisation?.name }),
            },
          });
        } catch {
          // Non-blocking audit log
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as RoleId,
          orgId: user.orgId,
          orgName: user.organisation?.name ?? 'AidBridge Network',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.orgId = (user as any).orgId;
        token.orgName = (user as any).orgName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as RoleId;
        (session.user as any).orgId = token.orgId as string;
        (session.user as any).orgName = token.orgName as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
};
