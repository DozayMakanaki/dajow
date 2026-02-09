"use client"

import { LogOut, User } from "lucide-react"
import { logoutUser } from "@/lib/auth"
import { useAuthStore } from "../store/auth-store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function UserMenu() {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return (
      <Button asChild variant="outline">
        <a href="/login">Login</a>
      </Button>
    )
  }

  const initial =
    user.displayName?.charAt(0) ||
    user.email?.charAt(0) ||
    "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user.photoURL ?? undefined} />
          <AvatarFallback>{initial.toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled>
          <User className="mr-2 h-4 w-4" />
          {user.email}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={async () => {
            await logoutUser()
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
