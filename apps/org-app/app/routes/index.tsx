import { redirect } from 'react-router'

export default function Home() {
  return redirect('/app/auth/login')
}
