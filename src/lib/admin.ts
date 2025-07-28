import { supabase } from './supabaseClient'

export async function setUserAsAdmin(userId: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.rpc('set_admin_role', {
      uid: userId,
      is_admin: true
    })
    
    if (error) throw error
    
    // Force token refresh to get new claims
    const { data: { session }, error: refreshError } = await supabase.auth.refreshSession()
    if (refreshError) throw refreshError
    
    return { error: null }
  } catch (error) {
    console.error('Error setting user as admin:', error)
    return { error: error as Error }
  }
}

export function isAdmin(session: any): boolean {
  return session?.user?.app_metadata?.role === 'admin'
}

// Helper to get JWT token with admin claims
export async function getAdminAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession()
  return {
    Authorization: `Bearer ${session?.access_token}`,
  }
}
