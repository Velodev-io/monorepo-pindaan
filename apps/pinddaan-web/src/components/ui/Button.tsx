import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "gold"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-orange-600 text-white hover:bg-orange-700": variant === "default",
            "bg-amber-500 text-amber-950 hover:bg-amber-600": variant === "gold",
            "border border-input bg-transparent hover:bg-orange-50 hover:text-orange-900": variant === "outline",
            "hover:bg-orange-50 hover:text-orange-900": variant === "ghost",
            "text-orange-600 underline-offset-4 hover:underline": variant === "link",
            "h-12 px-6 py-3 text-base": size === "default",
            "h-11 rounded-md px-4": size === "sm",
            "h-14 rounded-md px-10 text-lg": size === "lg",
            "h-12 w-12": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
