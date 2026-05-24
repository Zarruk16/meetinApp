import { TextInput, type TextInputProps } from "react-native";
import { cn } from "../../lib/cn";

export function Input({ className, ...props }: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor="#71717a"
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-base text-white",
        className
      )}
      {...props}
    />
  );
}
