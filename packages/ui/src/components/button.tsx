'use client'

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "motion/react"

import { cn } from "../utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[0.8px] text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-rankor/90 bg-rankor",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-black hover:bg-secondary/80 bg-white",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 text-primary-foreground border-2 border-primary-foreground",
        text:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 text-primary-foreground",
        link: "text-primary underline-offset-4 hover:underline text-rankor",
      },
      size: {
        default: "h-8 px-4 py-5 has-[>svg]:px-3",
        sm: "h-8 rounded-[0.8px] gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-[0.8px] px-8 py-8 has-[>svg]:px-4",
        icon: "size-9",
      },
      disabled: {
        true: {
          default: "bg-primary/40 text-primary-foreground/40 cursor-not-allowed",
          destructive: "bg-destructive/40 text-white/40 cursor-not-allowed",
          outline: "border bg-background/40 text-accent-foreground/40 cursor-not-allowed",
          secondary: "bg-secondary/40 text-black/40 cursor-not-allowed",
          ghost: "bg-accent/20 text-primary-foreground/40 border-2 border-primary-foreground/40 cursor-not-allowed",
          link: "text-primary/40 underline-offset-4 cursor-not-allowed",
        },
        false: {
          default: "",
          destructive: "",
          outline: "",
          secondary: "",
          ghost: "",
          link: "",
        }
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      disabled: false,
    },
  }
)

function Spinner() {
  return (
    <motion.span
      className="inline-block align-middle"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{ duration: 0.3 }}
    >
      <svg className="animate-spin size-6 text-current" viewBox="0 0 24 24">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
        <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    </motion.span>
  )
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  disabled,
  loading = false,
  children,
  icon,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    disabled?: boolean
    loading?: boolean
    icon?: React.ReactNode
  }) {
  const Comp = asChild ? Slot : "button"
  const isDisabled = disabled || loading

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, disabled: !!isDisabled, className })
      )}
      disabled={isDisabled}
      {...props}
    >
      <span className="relative flex items-center justify-center w-full">
        <motion.span
          className={cn(
            "absolute flex items-center justify-center transition-opacity duration-200",
            loading ? "opacity-100" : "opacity-0"
          )}
        >
          <Spinner />
        </motion.span>
        <motion.span
          className={cn(
            "flex items-center justify-center gap-2 transition-transform duration-200",
            loading ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
          )}
        >
          {icon} {children}
        </motion.span>
      </span>
    </Comp>
  )
}

export { Button, buttonVariants }
