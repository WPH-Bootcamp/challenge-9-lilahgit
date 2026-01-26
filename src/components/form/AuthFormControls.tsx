import { forwardRef } from "react"
import type { ComponentProps } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type AuthInputProps = ComponentProps<typeof Input>

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      className={cn(
        "h-[56px] w-full max-w-[374px] rounded-[12px] border border-neutral-300 px-4 text-[16px] leading-[30px] text-neutral-950 placeholder:text-neutral-500",
        className
      )}
      {...props}
    />
  )
)

AuthInput.displayName = "AuthInput"

type AuthPrimaryButtonProps = ComponentProps<typeof Button>

export const AuthPrimaryButton = ({
  className,
  ...props
}: AuthPrimaryButtonProps) => (
  <Button
    className={cn(
      "h-[48px] w-full max-w-[374px] rounded-[100px] bg-primary px-[8px] text-[16px] font-bold leading-[30px] text-white hover:bg-primary/90",
      className
    )}
    {...props}
  />
)
