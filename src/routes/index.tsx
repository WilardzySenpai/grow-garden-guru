import { createBrowserRouter } from 'react-router-dom'
import { AdminLayout } from '@/components/AdminLayout'
import { AdminBugReports } from '@/components/AdminBugReports'
import { AdminSetup } from '@/components/AdminSetup'

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminBugReports />
          },
          {
            path: 'setup',
            element: <AdminSetup />
          }
        ]
      }
    ]
  }
])
