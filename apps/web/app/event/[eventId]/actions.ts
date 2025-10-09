"use server"

type SubscribeToEventParams = {
  modality: string
  expertiseId: string
  athleteId: string
  eventId: string
  weightClass: string
}

export async function subscribeToEvent(prevState: any, formData: SubscribeToEventParams) {
  try {
  
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${formData.eventId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      return {
        success: false,
        error: 'Falha ao inscrever no evento'
      }
    }

    const result = await response.json()
    return {
      success: true,
      data: result
    }
  } catch (error) {
    return {
      success: false,
      error: 'Erro interno do servidor'
    }
  }
}