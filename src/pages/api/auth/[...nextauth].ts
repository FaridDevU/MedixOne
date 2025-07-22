// Tipos explícitos para evitar errores de TypeScript estricto
interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  password: string
  role: string
  active: boolean
}

interface AuthToken {
  sub?: string
  role?: string
  [key: string]: any
}

interface AuthSession {
  user: {
    id: string
    role: string
    [key: string]: any
  }
  [key: string]: any
}

// Mock de NextAuth y dependencias para desarrollo sin errores
export const authOptions = {
  adapter: {},
  session: {
    strategy: 'jwt',
  },
  providers: [
    {
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(
        credentials: Record<'email' | 'password', string> | undefined
      ): Promise<AuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        // Mock de usuario para desarrollo
        const user: AuthUser = {
          id: 'mock-id',
          email: credentials.email,
          firstName: 'Mock',
          lastName: 'User',
          password: credentials.password,
          role: 'PATIENT',
          active: true,
        }
        const isPasswordValid = credentials.password === user.password
        if (!isPasswordValid) {
          return null
        }
        return user
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }: { token: AuthToken; user?: AuthUser }): Promise<AuthToken> {
      if (user) {
        token.role = user.role
        token.sub = user.id
      }
      return token
    },
    async session({
      session,
      token,
    }: {
      session: AuthSession
      token: AuthToken
    }): Promise<AuthSession> {
      if (token) {
        session.user.id = token.sub ?? ''
        session.user.role = token.role ?? ''
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
}

// Mock de API de autenticación para desarrollo
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Mock de NextAuth para desarrollo
  if (req.method === 'POST') {
    // Simular login
    res.status(200).json({
      user: {
        id: 'mock-user',
        email: 'admin@medixone.com',
        name: 'Admin User',
        role: 'ADMIN',
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
  } else {
    res.status(200).json({ message: 'NextAuth Mock API' })
  }
}
