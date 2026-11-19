"use client"

import { Icon } from "@/components/ui/icon"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <Icon name="check_circle" className="text-[18px]" filled />,
        info: <Icon name="info" className="text-[18px]" filled />,
        warning: <Icon name="warning" className="text-[18px]" filled />,
        error: <Icon name="error" className="text-[18px]" filled />,
        loading: <Icon name="progress_activity" className="text-[18px] animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
