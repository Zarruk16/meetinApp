import { Pressable, Text, type PressableProps } from "react-native";
import { cn } from "../../lib/cn";

type Props = PressableProps & {
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ label, variant = "primary", className, disabled, ...props }: Props) {
  const base = "rounded-2xl px-5 py-3.5 items-center justify-center active:opacity-80";
  const variants = {
    primary: "bg-violet-600",
    secondary: "bg-white/10 border border-white/10",
    ghost: "bg-transparent",
    danger: "bg-red-600/90",
  };
  const textVariants = {
    primary: "text-white font-semibold",
    secondary: "text-white font-medium",
    ghost: "text-violet-300 font-medium",
    danger: "text-white font-semibold",
  };

  return (
    <Pressable
      className={cn(base, variants[variant], disabled && "opacity-40", className)}
      disabled={disabled}
      {...props}
    >
      <Text className={textVariants[variant]}>{label}</Text>
    </Pressable>
  );
}
