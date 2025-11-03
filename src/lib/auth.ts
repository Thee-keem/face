import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getServerBoltAuth, BoltUser } from '@/lib/boltAuth'

interface UserWithRole {
  id: string;
  email: string;
  name?: string;
  role: string;
}

interface SessionUser extends UserWithRole {
  id: string;
  role: string;
}

interface CustomSession {
  user: SessionUser;
  expires: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }
          
          // Authenticate user with ServerBoltAuth
          const serverBoltAuth = await getServerBoltAuth()
          if (!serverBoltAuth) return null
          
          const user = await serverBoltAuth.authenticateUser(credentials.email, credentials.password)
          
          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role
            }
          }
          
          return null
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = (user as UserWithRole).id
        token.role = (user as UserWithRole).role
      }
      return token
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        (session.user as SessionUser).id = token.id as string
        (session.user as SessionUser).role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user, account, profile }) {
      // Set user context for RLS after successful sign in
      if (user && typeof window === 'undefined') {
        const { BoltAuth } = await import('@/lib/boltAuth')
        const typedUser = user as { id: string; role: string };
        await BoltAuth.setUserContext(typedUser.id, typedUser.role)
      }
    }
  },
  logger: {
    error(code, metadata) {
      console.error(code, metadata)
    },
    warn(code) {
      console.warn(code)
    },
    debug(code, metadata) {
      console.debug(code, metadata)
    }
  }
}

export default authOptions