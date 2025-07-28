import { useEffect, useState } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { isAdmin } from '@/lib/admin'
import { supabase } from '@/lib/supabaseClient'

interface BugReport {
  id: string
  message: string
  status: 'pending' | 'in_progress' | 'done'
  created_at: string
  user_id: string
  is_guest: boolean
}

export function AdminBugReports() {
  const session = useSession()
  const [bugReports, setBugReports] = useState<BugReport[]>([])
  const [loading, setLoading] = useState(true)

  // Check if user is admin
  if (!isAdmin(session)) {
    return (
      <div className="p-4 text-red-500">
        Access denied. You must be an admin to view this page.
      </div>
    )
  }

  useEffect(() => {
    async function fetchBugReports() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('bug_reports')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setBugReports(data || [])
      } catch (error) {
        console.error('Error fetching bug reports:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBugReports()
  }, [])

  const updateBugStatus = async (id: string, status: BugReport['status']) => {
    try {
      const { error } = await supabase
        .from('bug_reports')
        .update({ status })
        .eq('id', id)

      if (error) throw error

      // Update local state
      setBugReports(reports =>
        reports.map(report =>
          report.id === id ? { ...report, status } : report
        )
      )
    } catch (error) {
      console.error('Error updating bug status:', error)
    }
  }

  if (loading) {
    return <div className="p-4">Loading bug reports...</div>
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Bug Reports</h2>
      <div className="space-y-4">
        {bugReports.map(report => (
          <div key={report.id} className="border p-4 rounded">
            <p className="font-medium">{report.message}</p>
            <div className="mt-2 text-sm text-gray-600">
              <p>Status: {report.status}</p>
              <p>User: {report.is_guest ? 'Guest' : report.user_id}</p>
              <p>Created: {new Date(report.created_at).toLocaleString()}</p>
            </div>
            <div className="mt-2 space-x-2">
              <select
                value={report.status}
                onChange={(e) => updateBugStatus(report.id, e.target.value as BugReport['status'])}
                className="border p-1 rounded"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
