import { getAccessToken, getAuthHeaders } from '../../../lib/auth'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  // Check if user is authenticated
  const token = await getAccessToken()
  
  if (!token) {
    redirect('/athlete/login')
  }

  // Example: Make an authenticated API request
  const headers = await getAuthHeaders()
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/user/profile`, {
      headers,
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch user profile')
    }
    
    const userProfile = await response.json()
    
    return (
      <div>
        <h1>Protected Page</h1>
        <p>Welcome, {userProfile.name}!</p>
        <form action="/athlete/logout" method="post">
          <button type="submit">Logout</button>
        </form>
      </div>
    )
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return (
      <div>
        <h1>Error</h1>
        <p>Failed to load user profile</p>
      </div>
    )
  }
}
