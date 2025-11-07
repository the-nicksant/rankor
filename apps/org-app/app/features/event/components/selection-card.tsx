import React from 'react'
import { cn } from '~/lib/cn'

type Props = {
  checked: boolean
  onClick: (value: string) => void
  title: string
  value: string
  description: string
  image?: string
  size?: 'default' | 'small'
}

export const SelectionCard = React.memo(({ 
  value, 
  title, 
  description, 
  image, 
  checked, 
  onClick,
  size = 'default' 
}: Props) => {
  return (
    <button
      type='button'
      onClick={() => onClick(value)}
      className={cn(
        'rounded-lg border-2 border-border flex flex-col items-center justify-end gap-2 relative h-[200px] w-[200px] bg-card transition-all overflow-hidden group',
        size === 'small' && 'h-[170px] w-[170px]',
        checked && 'border-rankor',
        checked && 'border-rankor'
      )}
    >
      {image && (
        <img 
          src={image} 
          alt={title} 
          className="absolute inset-0 w-full transition-all h-full object-cover z-0 group-hover:scale-110 border-2 border-border" 
          draggable={false}
        />
      )}
      <div 
        className={cn(
          'absolute left-0 bottom-0 h-full w-full flex flex-col items-center justify-end px-6 py-6 cursor-pointer rounded-lg bg-linear-to-t from-card from-25% to-transparent z-10 border-border',
          checked && "from-[#570909] to-rankor/0 border-rankor"
        )}
        style={{position: 'relative', overflow: 'hidden'}}
      >
       
        <span className='font-medium relative'>{title}</span>
        <p className='text-sm text-muted-foreground  relative'>{description}</p>
      </div>
    </button>
  )
})
