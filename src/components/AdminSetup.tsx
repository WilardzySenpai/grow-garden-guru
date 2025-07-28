import { useState } from 'react'
import { setUserAsAdmin } from '@/lib/admin'

export function AdminSetup() {
  const [userId, setUserId] = useState('')
  const [message, setMessage] = useState('')

  const handleSetAdmin = async () => {
    if (!userId) {
      setMessage('Please enter a user ID')
      return
    }

    const { error } = await setUserAsAdmin(userId)
    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Successfully set user as admin!')
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Set Admin User</h2>
      <div className="space-y-4">
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
          className="border p-2 rounded"
        />
        <button
          onClick={handleSetAdmin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Set as Admin
        </button>
        {message && (
          <p className={message.includes('Error') ? 'text-red-500' : 'text-green-500'}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
