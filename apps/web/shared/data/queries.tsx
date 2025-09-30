import { useEffect, useState } from "react"

export const useModalities = (): [any[], boolean] => {
  const [state, setState] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    setLoading(true)

    fetch('https://rankor-api.onrender.com/v1/modalities')
      .then(async res => {
        const data = await res.json()
        setState(data || [])
      })
      .catch(() => {
        setState([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])


  return [state, loading]
}

export const useExpertises = (): [any[], boolean] => {
  const [state, setState] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    setLoading(true)

    fetch('https://rankor-api.onrender.com/v1/expertises')
      .then(async res => {
        const data = await res.json()
        setState(data || [])
      })
      .catch(() => {
        setState([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])


  return [state, loading]
}
