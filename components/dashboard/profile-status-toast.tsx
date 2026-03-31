"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProfileStatusToast({
  status,
  error,
}: {
  status?: string;
  error?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!status && !error) return;

    if (status === "updated") {
      toast.success("Profile updated successfully.");
    }

    if (error) {
      toast.error(error);
    }

    router.replace(pathname, { scroll: false });
  }, [error, pathname, router, status]);

  return null;
}
