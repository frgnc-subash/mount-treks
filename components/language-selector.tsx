"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Globe2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { resolveLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type LanguageSelectorProps = {
  triggerClassName?: string;
  contentClassName?: string;
  align?: "start" | "center" | "end";
  size?: "sm" | "default";
};

const languageOptions = [
  { value: "en", label: "English", code: "EN" },
  { value: "es", label: "Español", code: "ES" },
  { value: "zh", label: "中文", code: "ZH" },
] as const;

export default function LanguageSelector({
  triggerClassName,
  contentClassName,
  align = "center",
  size = "sm",
}: LanguageSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("lang"));
  const activeOption = languageOptions.find((option) => option.value === locale) ?? languageOptions[0];

  const setLanguage = (nextLocale: "en" | "es" | "zh") => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextLocale === "en") {
      params.delete("lang");
    } else {
      params.set("lang", nextLocale);
    }
    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  return (
    <Select value={locale} onValueChange={setLanguage}>
      <SelectTrigger
        size={size}
        className={cn(
          "group w-fit max-w-full min-w-[82px] rounded-full border-white/20 bg-white/5 px-2.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-primary/50 hover:bg-white/10 sm:min-w-[90px] sm:px-3",
          triggerClassName,
        )}
        aria-label="Select language"
      >
        <span className="flex items-center gap-1.5 sm:gap-2">
          <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/20 bg-white/10 transition-colors group-hover:border-primary/50 group-hover:bg-primary/15 sm:h-5 sm:w-5">
            <Globe2 className="h-2.5 w-2.5 text-white/90 sm:h-3 sm:w-3" />
          </span>
          <span className="text-[11px] font-black tracking-wide text-white uppercase sm:text-xs">
            {activeOption.code}
          </span>
        </span>
      </SelectTrigger>
      <SelectContent
        position="popper"
        side="bottom"
        sideOffset={8}
        collisionPadding={8}
        align={align}
        className={cn(
          "z-[2600] w-[min(220px,calc(100vw-1rem))] overflow-hidden rounded-2xl border-white/10 bg-[#0a0a0c] p-1 shadow-[0_18px_36px_rgba(0,0,0,0.55)]",
          contentClassName,
        )}
      >
        {languageOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="rounded-lg py-2 pl-2.5 pr-8 text-zinc-100 focus:bg-white/[0.12] focus:text-white [&_[data-slot=select-item-indicator]]:right-2 [&_[data-slot=select-item-indicator]_svg]:size-2.5 sm:[&_[data-slot=select-item-indicator]_svg]:size-3"
          >
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex w-6 items-center justify-center rounded-md border border-white/20 bg-white/[0.06] px-1 py-0.5 text-[9px] font-black tracking-wider text-zinc-300 sm:w-7 sm:px-1.5 sm:py-1 sm:text-[10px]">
                {option.code}
              </span>
              <span className="text-[13px] font-medium sm:text-sm">{option.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
