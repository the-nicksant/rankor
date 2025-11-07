'use server'

import { removeAccessToken } from '../../../lib/auth'
import { redirect } from 'next/navigation'

export async function logout() {
  await removeAccessToken()
  redirect('/athlete/login')
}
