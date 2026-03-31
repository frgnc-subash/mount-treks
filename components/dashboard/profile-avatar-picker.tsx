"use client";

import { useMemo, useState } from "react";

const avatarOptions = [
  { label: "Logo", value: "/logo.webp" },
  { label: "Mountain 1", value: "/gallery/image9.jpeg" },
  { label: "Mountain 2", value: "/gallery/image8.jpeg" },
  { label: "Mountain 3", value: "/gallery/image7.jpeg" },
  { label: "Mountain 4", value: "/gallery/image6.jpeg" },
  { label: "Everest", value: "/ebc/5.jpg" },
  { label: "Annapurna", value: "/abc/8.jpg" },
  { label: "Mustang", value: "/upper-mustang/lomanthang.jpg" },
] as const;

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

export default function ProfileAvatarPicker({
  fullName,
  defaultAvatarUrl,
}: {
  fullName: string;
  defaultAvatarUrl: string | null;
}) {
  const startsWithPreset = avatarOptions.some((option) => option.value === defaultAvatarUrl);
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatarUrl ?? "");
  const [customAvatarUrl, setCustomAvatarUrl] = useState(
    defaultAvatarUrl && !startsWithPreset ? defaultAvatarUrl : ""
  );

  const effectiveAvatarUrl = useMemo(() => {
    if (selectedAvatar === "__custom__") {
      return customAvatarUrl.trim();
    }

    return selectedAvatar;
  }, [customAvatarUrl, selectedAvatar]);

  const initials = getInitials(fullName);

  return (
    <div className="space-y-4">
      <input
        type="hidden"
        name="avatarUrl"
        value={effectiveAvatarUrl}
        readOnly
      />

      <div className="flex items-center gap-4 rounded-2xl border border-border bg-background/40 p-4">
        {effectiveAvatarUrl ? (
          <img
            src={effectiveAvatarUrl}
            alt={fullName}
            className="h-20 w-20 rounded-full object-cover ring-1 ring-border"
          />
        ) : (
          <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-2xl font-bold text-primary">
            {initials}
          </span>
        )}

        <div>
          <p className="text-sm font-semibold text-white">Profile Preview</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a preset image, use a custom image URL, or keep the initials avatar.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setSelectedAvatar("")}
          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
            selectedAvatar === ""
              ? "border-primary/40 bg-primary/10"
              : "border-border bg-background/40 hover:bg-accent"
          }`}
        >
          <div>
            <p className="text-sm font-medium text-white">Use initials only</p>
            <p className="text-xs text-muted-foreground">No profile image</p>
          </div>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
            {initials}
          </span>
        </button>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {avatarOptions.map((option) => {
            const active = selectedAvatar === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedAvatar(option.value)}
                className={`overflow-hidden rounded-2xl border text-left transition ${
                  active
                    ? "border-primary/40 bg-primary/10 shadow-[0_0_0_1px_rgba(8,78,168,0.35)]"
                    : "border-border bg-background/40 hover:bg-accent"
                }`}
              >
                <img
                  src={option.value}
                  alt={option.label}
                  className="h-28 w-full object-cover"
                />
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-white">{option.label}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-border bg-background/40 p-4">
          <button
            type="button"
            onClick={() => setSelectedAvatar("__custom__")}
            className={`mb-3 inline-flex rounded-lg border px-3 py-2 text-sm font-medium transition ${
              selectedAvatar === "__custom__"
                ? "border-primary/40 bg-primary/10 text-white"
                : "border-border bg-background/70 text-muted-foreground hover:text-white"
            }`}
          >
            Use custom image URL
          </button>

          <input
            value={customAvatarUrl}
            onChange={(event) => {
              setSelectedAvatar("__custom__");
              setCustomAvatarUrl(event.target.value);
            }}
            placeholder="https://example.com/avatar.jpg"
            className="h-11 w-full rounded-xl border border-input bg-background/70 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary/35"
          />
        </div>
      </div>
    </div>
  );
}
