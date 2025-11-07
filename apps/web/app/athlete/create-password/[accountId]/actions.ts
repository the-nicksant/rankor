
'use server'

export async function confirmAthleteAccount(state: { success?: boolean, error?: string | null, data?: any | null }, values: { password: string, athleteId: string }) {

  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/v1/athlete/${values.athleteId}/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'password': values.password,
    }),
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