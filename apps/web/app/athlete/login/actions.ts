
'use server'

import { cookies } from 'next/headers'

export async function login(
  state: { success?: boolean, error?: string | null, data?: unknown | null }, 
  values: { email: string, password: string }
) {

  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/v1/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'password': values.password,
      'email': values.email,
    }),
  })

  const data = await response.json()
  
  if (!response.ok) {
    return ({
      error: data || 'Ocorreu um erro ao fazer login',
      data: null,
      success: false,
    })
  }
  
  // Save access token in cookies
  if (data) {
    const cookieStore = await cookies()
    cookieStore.set('access_token', data, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
  }
  
  return {
    error: null,
    data: data,
    success: true
  }
}