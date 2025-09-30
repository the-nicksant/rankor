import { useEffect, useState } from 'react'

export const useStateCities = (state: string) => {
  const [cities, setCities] = useState([])

  useEffect(() => {
    if(!state) return;

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`)
      .then(async res => {
        const result = await res.json()
        const options = result.map((city: { nome: string}) => 
          ({ label: city.nome, value: city.nome })
        )

        setCities(options)
      })
  }, [state])

  return cities
}
