'use server'

export async function createAthlete(state: { success?: boolean, error?: string | null, data?: any | null }, values: any) {
  const response = await fetch('https://17784047891d.ngrok-free.app/v1/athlete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })

  const data = await response.json()
  
  if (!response.ok) {
    return ({
      error: data || 'Ocorreu um erro ao criar sua conta',
      data: null,
      success: false,
    })
  }
  
  return {
    error: null,
    data: data,
    success: true
  }
}