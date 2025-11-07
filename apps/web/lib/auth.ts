import { cookies } from 'next/headers'

/**
 * Get the access token from cookies
 * @returns The access token if it exists, null otherwise
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')
    return token?.value || null
  } catch (error) {
    console.error('Error getting access token:', error)
    return null
  }
}

/**
 * Remove the access token from cookies (logout)
 */
export async function removeAccessToken(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('access_token')
  } catch (error) {
    console.error('Error removing access token:', error)
  }
}

/**
 * Check if user is authenticated by verifying token exists
 * @returns true if token exists, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken()
  return token !== null
}

/**
 * Get headers with authorization for API requests
 * @returns Headers object with Authorization header if token exists
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken()
  
  if (!token) {
    return {}
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}
