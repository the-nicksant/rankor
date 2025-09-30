'use server'

export async function createAthlete(state: { error?: string | null, data?: any | null }, values: any) {
  console.log('HITTING ACTION')
  const response = await fetch('https://rankor-api.onrender.com/v1/athlete', {
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
      data: null
    })
  }
  
  return {
    error: null,
    data: data
  }
}