import { createBrowserRouter } from 'react-router-dom'
import { AdminLayout } from '@/components/AdminLayout'
import { AdminBugReports } from '@/components/AdminBugReports'
import { AdminSetup } from '@/components/AdminSetup'

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: '',
        element: <AdminBugReports />
      },
      {
        path: 'setup',
        element: <AdminSetup />
      }
    ]
  }
])
