"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  IconBackpack,
  IconCalendarEvent,
  IconChartBar,
  IconCompass,
  IconHome2,
  IconMap2,
  IconMountain,
  IconSettings,
  IconShield,
  IconUserCircle,
  IconUsersGroup,
  IconLogout,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { dashboardHomeForRole } from "@/lib/auth/redirect"

type DashboardUser = {
  id: string
  fullName: string
  email: string
  role: "ADMIN" | "CUSTOMER"
  avatarUrl?: string | null
}

type NavItem = {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  exact?: boolean
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "AT"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function isActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: DashboardUser
}) {
  const pathname = usePathname()
  const router = useRouter()
  const roleHomePath = dashboardHomeForRole(user.role)

  const mainItems: NavItem[] =
    user.role === "ADMIN"
      ? [
          {
            title: "Analytics",
            href: "/dashboard/admin",
            icon: IconChartBar,
            exact: true,
          },
          {
            title: "Managers",
            href: "/dashboard/admin/managers",
            icon: IconShield,
          },
          {
            title: "Bookings",
            href: "/dashboard/admin/customers",
            icon: IconUsersGroup,
          },
          {
            title: "Packages",
            href: "/dashboard/admin/packages",
            icon: IconBackpack,
          },
          {
            title: "Destinations",
            href: "/dashboard/admin/destinations",
            icon: IconMap2,
          },
        ]
      : [
          {
            title: "My Bookings",
            href: "/dashboard/customer",
            icon: IconChartBar,
            exact: true,
          },
          {
            title: "New Booking",
            href: "/dashboard/customer/new-booking",
            icon: IconCalendarEvent,
          },
          {
            title: "Packages",
            href: "/dashboard/customer/packages",
            icon: IconBackpack,
          },
          {
            title: "Destinations",
            href: "/dashboard/customer/destinations",
            icon: IconMap2,
          },
        ]

  const actionItems: NavItem[] =
    user.role === "ADMIN"
      ? [
          {
            title: "New Booking",
            href: "/booking",
            icon: IconCalendarEvent,
          },
          {
            title: "Add Package",
            href: "/dashboard/admin/packages/new",
            icon: IconBackpack,
          },
          {
            title: "Add Destination",
            href: "/dashboard/admin/destinations/new",
            icon: IconCompass,
          },
        ]
      : [
          {
            title: "Profile",
            href: "/dashboard/profile",
            icon: IconUserCircle,
          },
          {
            title: "Contact Team",
            href: "/contact",
            icon: IconMountain,
          },
        ]

  const secondaryItems: NavItem[] = [
    {
      title: "Website Home",
      href: "/",
      icon: IconHome2,
      exact: true,
    },
    {
      title: "Contact Team",
      href: "/contact",
      icon: IconSettings,
    },
  ]

  const signOut = async () => {
    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
      })
    } catch {
      // Keep navigation responsive even if the request fails.
    }

    router.push("/")
    router.refresh()
  }

  return (
    <Sidebar
      variant="inset"
      collapsible="offcanvas"
      className="border-r border-sidebar-border"
      {...props}
    >
      <SidebarHeader className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="h-14 w-full rounded-xl bg-transparent px-2.5 text-sidebar-foreground hover:bg-white/8 hover:text-sidebar-foreground group-data-[collapsible=offcanvas]:border-transparent group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:p-0"
            >
              <Link href={roleHomePath}>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5 p-1.5 sm:size-10">
                  <span className="relative block size-full">
                    <Image
                      src="/logo.webp"
                      alt="Altigo Himalayan Treks"
                      fill
                      sizes="44px"
                      className="object-contain"
                      priority
                    />
                  </span>
                </span>
                <span className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-semibold">Altigo Ops</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">
                    {user.role === "ADMIN" ? "Admin control room" : "Traveller workspace"}
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(pathname, item)}
                    tooltip={item.title}
                    className="rounded-xl"
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {actionItems.length > 0 ? (
          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {actionItems.map((item, index) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={index === 0 ? "rounded-xl bg-primary/12 text-primary" : "rounded-xl"}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Shortcuts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild tooltip={item.title} className="rounded-xl">
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-14 rounded-xl bg-transparent data-[state=open]:bg-accent"
            >
              <Avatar className="h-9 w-9 rounded-xl">
                <AvatarImage src={user.avatarUrl ?? undefined} alt={user.fullName} />
                <AvatarFallback className="rounded-xl bg-primary/15 text-primary">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.fullName}</span>
                <span className="truncate text-xs text-sidebar-foreground/70">{user.email}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="right"
            sideOffset={8}
            className="w-60 rounded-2xl border-border bg-popover text-popover-foreground"
          >
            <div className="px-2 py-1.5">
              <p className="text-sm font-semibold">{user.fullName}</p>
              <p className="text-xs text-muted-foreground">{user.role === "ADMIN" ? "Administrator" : "Traveller"}</p>
            </div>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="cursor-pointer rounded-xl">
                <IconUserCircle />
                Account settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={user.role === "CUSTOMER" ? "/dashboard/customer/new-booking" : "/booking"}
                className="cursor-pointer rounded-xl"
              >
                <IconCalendarEvent />
                Create booking
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={signOut}
              className="cursor-pointer rounded-xl text-secondary focus:bg-secondary/15 focus:text-secondary-foreground"
            >
              <IconLogout />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
