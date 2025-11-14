import React from 'react'
import { Instagram } from 'lucide-react'

const instagramLink = process.env.NEXT_PUBLIC_INSTAGRAM_URL || ''

export const Footer = () => {
  return (
    <div className='bottom-0 w-full flex items-center justify-center'>
      <footer className='w-full py-12 px-8 max-w-7xl flex items-center justify-center gap-12 flex-col lg:flex-row lg:justify-between'>
        <span className='text-sm text-muted-foreground'>
          © 2025 Rankor. Todos os direitos reservados.
        </span>

        <div className='flex items-center gap-4 text-white'>
          <a href={instagramLink} target='_blank' rel='noreferrer'>
            <Instagram />
          </a>
        </div>
      </footer>
    </div>
  )
}
