"use server"

import { getAccessToken, getAuthHeaders } from '~/lib/auth'

export async function subscribeToEvent(
  prevState: { success?: boolean, error?: string | null, data?: unknown | null }, 
  formData: any
) {
  try {
    // Check if user is authenticated
    const token = await getAccessToken()
    
    if (!token) {
      return {
        success: false,
        error: 'Você precisa estar logado para se inscrever no evento'
      }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/event/${formData.eventId}/subscribe`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.message || 'Falha ao inscrever no evento'
      }
    }

    const result = await response.json()
    return {
      success: true,
      data: result,
      error: null
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: 'Erro interno do servidor',
      data: null
    }
  }
}