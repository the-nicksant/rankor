import { cva, type VariantProps } from "class-variance-authority"

const expBadgeVariants = cva(
  "rounded-full font-semibold w-fit",
  {
    variants: {
      exp: {
        pro: 'bg-gradient-to-r from-purple-800 to-purple-700 text-white uppercase border border-purple-500 text-glow',
        amateur: 'bg-gradient-to-r from-red-700 to-red-600 text-white uppercase text-glow',
        semipro: 'bg-gradient-to-r from-blue-700 to-blue-600 text-white uppercase text-glow',
        kids: 'bg-gradient-to-r from-green-700 to-green-600 text-white uppercase text-glow',
      },
      size: {
        default: "px-4 py-2",
        sm: 'px-2 py-1 text-xs'
      }
    },
  }
)

export const ExpBadges = ({ exp = "amateur", size = "default", className }: React.ComponentProps<"div"> & VariantProps<typeof expBadgeVariants>) => {

  const labels = {
    pro: "PRO",
    amateur: "AMADOR",
    semipro: "SEMIPRO",
    kids: "KIDS"
  }

  return (
    <div className={expBadgeVariants({ className, size, exp })} color="red">
      {labels[exp as keyof typeof labels]}
    </div>
  )
}