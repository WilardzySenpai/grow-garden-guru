import { ReactNode } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { isAdmin } from '@/lib/admin'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const session = useSession()

  if (!session) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !isAdmin(session)) {
    // Not an admin, redirect to home page
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
