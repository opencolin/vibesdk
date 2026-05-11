import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--build-chat-colors-bg-1)",
          "--normal-text": "var(--build-chat-colors-text-primary)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--build-chat-colors-bg-1)",
          "--success-text": "var(--build-chat-colors-text-primary)",
          "--success-border": "var(--accent)",
          "--error-bg": "var(--build-chat-colors-bg-1)",
          "--error-text": "var(--build-chat-colors-text-primary)",
          "--error-border": "var(--destructive)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
