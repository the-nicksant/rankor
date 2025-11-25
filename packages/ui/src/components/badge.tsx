import React, { type ReactNode } from 'react'
import { cn } from '../utils/cn'
import { cva, type VariantProps } from "class-variance-authority"

const badgeVariants = cva(
  "w-fit rounded-full border border-border text-white font-medium flex items-center gap-1", {
    variants: {
      variant: {
        default: "",
        secondary: ""
      },
      size: {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },
      fill: {
        true: "bg-rankor border-0",
        false: "bg-transparent",
      },
    },
    defaultVariants: {
      size: "md",
      fill: true,
    },
  }
)

type Props = {
  icon?: ReactNode
} & React.ComponentProps<"div"> & VariantProps<typeof badgeVariants>

export const Badge = ({ 
  fill = true, 
  size = "md",
  variant = "secondary",
  icon,
  children, 
  className,
  ...props
}: Props) => {
  return (
    <div 
      className={cn(
        badgeVariants({ size, fill, className, variant })
      )}
      {...props}
    >
      {icon && <span className="flex items-center mr-1">{icon}</span>}
      {children}
    </div>
  )
}
