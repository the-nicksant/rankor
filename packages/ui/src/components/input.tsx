import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

export const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-rankor/20 selection:text-primary-foreground dark:bg-input/10 border-input flex w-full min-w-0 rounded-[1px] border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: ""
      },
      size: {
        default: 'file:text-sm file:h-7 md:text-sm px-6 py-5 h-8',
        sm: 'file:text-sm file:h-5 text-xs px-6 py-4 h-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
})

type InputProps = 
  Omit<React.ComponentProps<"input">, 'size'> &
  VariantProps<typeof inputVariants> & 
  {
    prefix?: React.ReactNode,
    formatter?: (val: string) => string, 
    icon?: React.ReactNode // Added icon prop
  }

function Input({ 
  className, 
  type, 
  size,
  formatter = (val: string) => val,
  prefix,
  icon, // Destructure icon prop
  ...props 
}: InputProps ) {
  return (
    <div className="relative flex items-center w-full"> {/* Wrapper to position icon */}
      {icon && <span className="absolute left-3 text-sm">{icon}</span>} {/* Render icon if provided */}
      <input
        type={type}
        data-slot="input"
        className={inputVariants({ size, className}) + (icon ? ' pl-10' : '')}
        {...props}
        onChange={e => {
          e.target.value = formatter 
            ? formatter(e.target.value) 
            : e.target.value
          
          props.onChange?.(e)
        }}
      />
    </div>
  )
}

function TextArea({ 
  className,
  size,
  ...props 
}: Omit<React.ComponentProps<"textarea">, 'size'> &
VariantProps<typeof inputVariants>) {
  return (
    <textarea
      data-slot="input"
      className={inputVariants({ size, className})}
      {...props}
    />
  )
}

export { TextArea, Input }



