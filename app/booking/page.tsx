"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Backpack,
  CalendarDays,
  Globe2,
  Mail,
  MapPin,
  MapPinned,
  Phone,
  SlidersHorizontal,
  UserCircle2,
  Users,
} from "lucide-react";
import { localizeDestinations, localizePackages, resolveLocale } from "@/lib/i18n";
import { destinations, type Destination } from "@/lib/destinations-data";
import { trekPackages, type TrekPackage } from "@/lib/packages-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type BookingForm = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  pickupLocation: string;
  destination: string;
  packageId: string;
  startDate: string;
  people: number;
  tripStyle: string;
  accommodation: string;
  addOns: string[];
  customNotes: string;
};

const initialForm: BookingForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  pickupLocation: "",
  destination: "",
  packageId: "",
  startDate: "",
  people: 1,
  tripStyle: "balanced",
  accommodation: "standard",
  addOns: [],
  customNotes: "",
};

type AuthUser = {
  fullName: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
};

const tripStyles = [
  { value: "balanced", label: "Balanced" },
  { value: "comfort", label: "Comfort-focused" },
  { value: "adventure", label: "Adventure-focused" },
  { value: "photography", label: "Photography-focused" },
] as const;

const accommodationOptions = [
  { value: "standard", label: "Standard Tea House" },
  { value: "premium", label: "Premium Lodge" },
  { value: "mixed", label: "Mixed" },
] as const;

const addOnOptions = [
  "Private Transport",
  "Single Room Upgrade",
  "Extra Porter",
  "Airport Drop",
] as const;

function BookingCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: typeof UserCircle2;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-white/8 bg-white/[0.03] shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
      <CardHeader className="border-b border-white/8">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-white">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">{children}</CardContent>
    </Card>
  );
}

function RequiredMark() {
  return <span className="text-secondary">*</span>;
}

export default function BookingPage({ embeddedInDashboard = false }: { embeddedInDashboard?: boolean }) {
  const [form, setForm] = useState<BookingForm>(initialForm);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const locale = resolveLocale(searchParams.get("lang"));
  const [packagesData, setPackagesData] = useState<TrekPackage[]>(() =>
    localizePackages(trekPackages, locale),
  );
  const [destinationsData, setDestinationsData] = useState<Destination[]>(() =>
    localizeDestinations(destinations, locale),
  );
  const router = useRouter();

  const setField = <K extends keyof BookingForm>(key: K, value: BookingForm[K]) => {
    setSuccess("");
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAddOn = (value: string) => {
    setSuccess("");
    setForm((prev) => ({
      ...prev,
      addOns: prev.addOns.includes(value)
        ? prev.addOns.filter((item) => item !== value)
        : [...prev.addOns, value],
    }));
  };

  useEffect(() => {
    setPackagesData(localizePackages(trekPackages, locale));
    setDestinationsData(localizeDestinations(destinations, locale));
  }, [locale]);

  useEffect(() => {
    let canceled = false;

    const loadContent = async () => {
      try {
        const langQuery = `?lang=${locale}`;
        const [packagesResponse, destinationsResponse] = await Promise.all([
          fetch(`/api/public/packages${langQuery}`, { cache: "no-store" }),
          fetch(`/api/public/destinations${langQuery}`, { cache: "no-store" }),
        ]);

        if (packagesResponse.ok) {
          const packagesPayload = (await packagesResponse.json()) as { packages: TrekPackage[] };
          if (!canceled && Array.isArray(packagesPayload.packages)) {
            setPackagesData(packagesPayload.packages);
          }
        }

        if (destinationsResponse.ok) {
          const destinationsPayload = (await destinationsResponse.json()) as {
            destinations: Destination[];
          };
          if (!canceled && Array.isArray(destinationsPayload.destinations)) {
            setDestinationsData(destinationsPayload.destinations);
          }
        }
      } catch {
        // Keep static fallback values on request failures.
      }
    };

    loadContent();

    return () => {
      canceled = true;
    };
  }, [locale]);

  useEffect(() => {
    const packageFromQuery = searchParams.get("package");
    if (!packageFromQuery) return;

    const selectedPackage = packagesData.find((pkg) => pkg.id === packageFromQuery);
    if (!selectedPackage) return;

    const linkedDestination = destinationsData.find((d) => d.id === packageFromQuery);

    setForm((prev) => ({
      ...prev,
      packageId: prev.packageId || selectedPackage.id,
      destination: prev.destination || linkedDestination?.name || prev.destination,
    }));
  }, [searchParams, packagesData, destinationsData]);

  useEffect(() => {
    let canceled = false;

    const hydrateProfile = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (!response.ok) {
          setAuthReady(true);
          return;
        }
        const payload = (await response.json()) as { user: AuthUser | null };
        const user = payload.user;

        if (canceled) return;

        setAuthUser(user);
        setAuthReady(true);

        if (!user) return;

        const parts = user.fullName.trim().split(/\s+/);
        const firstName = parts[0] || "";
        const lastName = parts.slice(1).join(" ");

        setForm((prev) => {
          if (prev.firstName || prev.lastName || prev.email) return prev;

          return {
            ...prev,
            firstName,
            lastName,
            email: user.email,
          };
        });
      } catch {
        if (!canceled) {
          setAuthReady(true);
        }
        // Ignore profile prefill failures.
      }
    };

    hydrateProfile();

    return () => {
      canceled = true;
    };
  }, []);

  const selectedPackage = useMemo(
    () => packagesData.find((p) => p.id === form.packageId),
    [form.packageId, packagesData],
  );

  const parseTier = (label: string) => {
    const cleaned = label.toLowerCase().replace(/\s/g, "");
    const rangeMatch = cleaned.match(/(\d+)-(\d+)/);
    if (rangeMatch) {
      return { min: Number(rangeMatch[1]), max: Number(rangeMatch[2]) as number | null };
    }
    const plusMatch = cleaned.match(/(\d+)\+/);
    if (plusMatch) {
      return { min: Number(plusMatch[1]), max: null as number | null };
    }
    const exactMatch = cleaned.match(/(\d+)/);
    if (exactMatch) {
      const exact = Number(exactMatch[1]);
      return { min: exact, max: exact as number | null };
    }
    return { min: 1, max: null as number | null };
  };

  const extractPrice = (value: string) => {
    const numberPart = value.replace(/[^0-9.]/g, "");
    return Number(numberPart || 0);
  };

  const unitPrice = useMemo(() => {
    if (!selectedPackage) return 0;

    const sorted = [...selectedPackage.pricing].sort(
      (a, b) => parseTier(b.label).min - parseTier(a.label).min,
    );
    const tier = sorted.find((item) => {
      const { min, max } = parseTier(item.label);
      return form.people >= min && (max === null || form.people <= max);
    });

    return extractPrice(tier?.price || selectedPackage.pricing[0]?.price || "0");
  }, [selectedPackage, form.people]);

  const totalPrice = unitPrice * form.people;
  const selectedTripStyleLabel =
    tripStyles.find((option) => option.value === form.tripStyle)?.label ?? "Balanced";
  const selectedAccommodationLabel =
    accommodationOptions.find((option) => option.value === form.accommodation)?.label ??
    "Standard Tea House";
  const nextBookingPath = useMemo(() => {
    return queryString ? `${pathname}?${queryString}` : pathname;
  }, [pathname, queryString]);

  const formatUsd = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);

  const redirectToSignIn = () => {
    router.push(`/sign-in?next=${encodeURIComponent(nextBookingPath)}`);
  };

  const requireSignedInUser = () => {
    if (authUser) return true;
    setError("");
    setSuccess("");
    setShowAuthPrompt(true);
    return false;
  };

  useEffect(() => {
    if (!authReady || !authUser) return;
    if (pathname !== "/booking") return;

    if (authUser.role === "ADMIN") {
      router.replace("/dashboard/admin");
    }
  }, [authReady, authUser, pathname, router]);

  const validate = () => {
    if (!form.firstName.trim()) return "Please enter your first name.";
    if (!form.lastName.trim()) return "Please enter your last name.";
    if (!form.email.trim() || !form.email.includes("@")) return "Please enter a valid email.";
    if (!form.phone.trim()) return "Please enter your phone number.";
    if (!form.country.trim()) return "Please enter your country.";
    if (!form.pickupLocation.trim()) return "Please enter your pickup/current location.";
    if (!form.packageId) return "Please select a package first.";
    if (!form.destination) return "Please choose a destination.";
    if (!form.startDate) return "Please choose a start date.";
    if (form.people < 1) return "Number of people must be at least 1.";
    return "";
  };

  const buildMessage = () => {
    const selectedPackageName = selectedPackage?.name || "Not selected";
    const fullName = `${form.firstName} ${form.middleName} ${form.lastName}`
      .replace(/\s+/g, " ")
      .trim();
    return [
      "Hello Altigo Treks, I would like to book a trek.",
      "",
      `Name: ${fullName}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || "Not provided"}`,
      `Country: ${form.country}`,
      `Pickup/Location: ${form.pickupLocation}`,
      `Destination: ${form.destination}`,
      `Package: ${selectedPackageName}`,
      `Start Date: ${form.startDate}`,
      `No. of People: ${form.people}`,
      `Trip Style: ${form.tripStyle}`,
      `Accommodation: ${form.accommodation}`,
      `Add-ons: ${form.addOns.length ? form.addOns.join(", ") : "None"}`,
      `Price per Person: ${formatUsd(unitPrice)}`,
      `Total Price: ${formatUsd(totalPrice)}`,
      "",
      `Customization Notes: ${form.customNotes || "None"}`,
    ].join("\n");
  };

  const saveToDashboard = async () => {
    if (!requireSignedInUser()) return;
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: form.destination,
          packageName: selectedPackage?.name || "Custom Package",
          startDate: form.startDate,
          people: form.people,
          notes: buildMessage(),
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error || "Unable to save booking.");
        return;
      }

      setSuccess("Booking saved to your dashboard. You can track status from your customer dashboard.");
    } catch {
      setError("Unable to save booking.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main
      className={
        embeddedInDashboard
          ? "text-foreground"
          : "min-h-screen bg-[radial-gradient(circle_at_top,rgba(8,78,168,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(224,43,52,0.12),transparent_24%),#070707] text-foreground"
      }
    >
      <section
        className={
          embeddedInDashboard
            ? "mx-auto w-full max-w-6xl px-0 pb-4 pt-0"
            : "mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-8"
        }
      >
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-white">
              Booking Request
            </Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Customize and book your trek
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
              {embeddedInDashboard
                ? "Build your trek request with package, schedule, comfort preferences, and optional upgrades, then submit directly from your dashboard."
                : "Build your trek request with package, schedule, comfort preferences, and optional upgrades. Sign in to save it directly to your dashboard."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-white">Profile</Badge>
            <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-white">Trip</Badge>
            <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-white">Preferences</Badge>
            <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-white">Checkout</Badge>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_320px] 2xl:grid-cols-[minmax(0,1.6fr)_340px]">
          <div className="space-y-6">
            <BookingCard
              title="Profile"
              description="Tell us who is travelling and how we should contact you."
              icon={UserCircle2}
            >
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-5">
                <div className="mb-4 flex flex-col gap-1">
                  <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                    Traveller Details
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Required fields are marked with a red star.
                  </p>
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="flex items-center gap-1.5">
                          First Name
                          <RequiredMark />
                        </Label>
                        <Input
                          id="firstName"
                          required
                          value={form.firstName}
                          onChange={(e) => setField("firstName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="middleName">Middle Name</Label>
                        <Input
                          id="middleName"
                          value={form.middleName}
                          onChange={(e) => setField("middleName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="flex items-center gap-1.5">
                          Last Name
                          <RequiredMark />
                        </Label>
                        <Input
                          id="lastName"
                          required
                          value={form.lastName}
                          onChange={(e) => setField("lastName", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          Email
                          <RequiredMark />
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setField("email", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          Phone
                          <RequiredMark />
                        </Label>
                        <Input
                          id="phone"
                          required
                          value={form.phone}
                          onChange={(e) => setField("phone", e.target.value)}
                          placeholder="Enter your contact number"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 rounded-2xl border border-white/8 bg-black/20 p-4">
                    <div className="space-y-2">
                      <Label htmlFor="country" className="flex items-center gap-2">
                        <Globe2 className="h-4 w-4 text-muted-foreground" />
                        Country
                        <RequiredMark />
                      </Label>
                      <Input
                        id="country"
                        required
                        value={form.country}
                        onChange={(e) => setField("country", e.target.value)}
                        placeholder="e.g. United States"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickupLocation" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        Pickup / Current Location
                        <RequiredMark />
                      </Label>
                      <Input
                        id="pickupLocation"
                        required
                        value={form.pickupLocation}
                        onChange={(e) => setField("pickupLocation", e.target.value)}
                        placeholder="Where should we coordinate from?"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </BookingCard>

            <BookingCard
              title="Trip Details"
              description="Choose destination, trek package, travel date, and group size."
              icon={MapPinned}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPinned className="h-4 w-4 text-muted-foreground" />
                    Destination
                  </Label>
                  <Select value={form.destination} onValueChange={(value) => setField("destination", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinationsData.map((destination) => (
                        <SelectItem key={destination.id} value={destination.name}>
                          {destination.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Backpack className="h-4 w-4 text-muted-foreground" />
                    Package
                  </Label>
                  <Select
                    value={form.packageId}
                    onValueChange={(packageId) => {
                      const linkedDestination = destinationsData.find((d) => d.id === packageId);
                      setForm((prev) => ({
                        ...prev,
                        packageId,
                        destination: linkedDestination?.name || prev.destination,
                      }));
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select package" />
                    </SelectTrigger>
                    <SelectContent>
                      {packagesData.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.id}>
                          {pkg.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setField("startDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Number of People
                  </Label>
                  <div className="flex items-center gap-2 rounded-xl border border-input bg-background/70 p-1">
                    <Button type="button" variant="ghost" size="icon" onClick={() => setField("people", Math.max(1, form.people - 1))}>
                      -
                    </Button>
                    <div className="flex-1 text-center text-sm font-semibold text-white">{form.people}</div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setField("people", form.people + 1)}>
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </BookingCard>

            <BookingCard
              title="Preferences & Budget"
              description="Fine-tune how you want the trek to feel, what extras you need, and any custom notes."
              icon={SlidersHorizontal}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Trip Style</Label>
                  <Select value={form.tripStyle} onValueChange={(value) => setField("tripStyle", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select trip style" />
                    </SelectTrigger>
                    <SelectContent>
                      {tripStyles.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Accommodation</Label>
                  <Select value={form.accommodation} onValueChange={(value) => setField("accommodation", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select accommodation" />
                    </SelectTrigger>
                    <SelectContent>
                      {accommodationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {addOnOptions.map((item) => {
                  const checked = form.addOns.includes(item);
                  return (
                    <label
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 transition hover:bg-white/[0.04]"
                    >
                      <Checkbox checked={checked} onCheckedChange={() => toggleAddOn(item)} />
                      <span className="text-sm text-white">{item}</span>
                    </label>
                  );
                })}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customNotes">Customization Notes</Label>
                <Textarea
                  id="customNotes"
                  rows={6}
                  value={form.customNotes}
                  onChange={(e) => setField("customNotes", e.target.value)}
                  placeholder="Food preferences, fitness concerns, alternate routes, special requests..."
                />
              </div>
            </BookingCard>
          </div>

          <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
            <Card className="border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] shadow-[0_18px_54px_rgba(0,0,0,0.2)]">
              <CardHeader className="space-y-3 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-white">Booking Summary</CardTitle>
                    <CardDescription>
                      Review your plan before saving or sending it.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-white/85">
                    {form.packageId ? "Ready" : "Incomplete"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Selected package</p>
                  <p className="mt-1.5 text-base font-semibold text-white">
                    {selectedPackage?.name || "Choose a package"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1">
                      {form.destination || "Destination pending"}
                    </span>
                    <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1">
                      {form.startDate || "Date pending"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Per person</p>
                    <p className="mt-1.5 text-xl font-semibold text-white">
                      {form.packageId ? formatUsd(unitPrice) : "-"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Total</p>
                    <p className="mt-1.5 text-xl font-semibold text-white">
                      {form.packageId ? formatUsd(totalPrice) : "-"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Travellers</p>
                      <p className="mt-1 font-semibold text-white">{form.people}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Style</p>
                      <p className="mt-1 font-semibold text-white">{selectedTripStyleLabel}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Stay</p>
                      <p className="mt-1 font-semibold text-white">{selectedAccommodationLabel}</p>
                    </div>
                  </div>
                </div>

                {error ? (
                  <div className="rounded-xl border border-secondary/20 bg-secondary/10 px-3.5 py-3 text-sm text-secondary">
                    {error}
                  </div>
                ) : null}

                {success ? (
                  <div className="rounded-xl border border-primary/20 bg-primary/10 px-3.5 py-3 text-sm text-primary">
                    {success}
                  </div>
                ) : null}

                {!form.packageId ? (
                  <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-3 text-sm text-muted-foreground">
                    Select a package to unlock pricing and submission.
                  </div>
                ) : null}

                <div className="grid gap-2.5">
                  <Button
                    type="button"
                    onClick={saveToDashboard}
                    disabled={!form.packageId || saving || !authReady}
                    className="h-10 rounded-xl"
                  >
                    {!authReady
                      ? "Checking account..."
                      : saving
                        ? "Saving..."
                        : embeddedInDashboard
                          ? "Save Booking"
                          : "Save to Dashboard"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {showAuthPrompt ? (
        <div className="fixed inset-0 z-[2300] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0c0c0e] p-5 shadow-[0_28px_68px_rgba(0,0,0,0.55)]">
            <p className="text-sm font-semibold tracking-[0.16em] text-primary uppercase">
              Access Required
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Sign in to continue booking
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              Booking actions are available for signed-in users only. Sign in or create an account to continue.
            </p>
            <div className="mt-4 grid gap-2">
              <Button type="button" className="h-10 rounded-xl" onClick={redirectToSignIn}>
                Sign In
              </Button>
              <Button
                type="button"
                asChild
                variant="outline"
                className="h-10 rounded-xl border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.08]"
              >
                <Link href={`/sign-up?next=${encodeURIComponent(nextBookingPath)}`}>Create Account</Link>
              </Button>
              <button
                type="button"
                onClick={() => setShowAuthPrompt(false)}
                className="mt-1 text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
              >
                Continue browsing
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
