"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Menu, X, LogOut, MapPin } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import { useAuth } from "./auth-provider"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Ezma</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Bosh sahifa</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Biz haqimizda</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/libraries" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Kutubxonalar</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/nearby" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <MapPin className="h-4 w-4 mr-1" />
                  Yaqin atrofda
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {isAuthenticated && user?.role === "librarian" && (
              <NavigationMenuItem>
                <Link href="/add-books" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Kitob qo'shish</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <NavigationMenuItem>
                <Link href="/admin" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Admin panel</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-2">
          <ModeToggle />
          <div className="hidden md:flex space-x-2">
            {isAuthenticated ? (
              <>
                <Button variant="outline" asChild>
                  <Link href={user?.role === "admin" ? "/admin" : "/library-profile"}>{user?.name || "Profilim"}</Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={logout} title="Chiqish">
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Chiqish</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Kirish</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Ro'yxatdan o'tish</Link>
                </Button>
              </>
            )}
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="container md:hidden py-4 space-y-4">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium rounded-md hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              Bosh sahifa
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-sm font-medium rounded-md hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              Biz haqimizda
            </Link>
            <Link
              href="/libraries"
              className="px-4 py-2 text-sm font-medium rounded-md hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              Kutubxonalar
            </Link>
            <Link
              href="/nearby"
              className="px-4 py-2 text-sm font-medium rounded-md hover:bg-accent flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <MapPin className="h-4 w-4 mr-1" />
              Yaqin atrofda
            </Link>
            {isAuthenticated && user?.role === "librarian" && (
              <Link
                href="/add-books"
                className="px-4 py-2 text-sm font-medium rounded-md hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                Kitob qo'shish
              </Link>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <Link
                href="/admin"
                className="px-4 py-2 text-sm font-medium rounded-md hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin panel
              </Link>
            )}
            <div className="flex flex-col space-y-2 pt-2 border-t">
              {isAuthenticated ? (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link
                      href={user?.role === "admin" ? "/admin" : "/library-profile"}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {user?.name || "Profilim"}
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                  >
                    Chiqish
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      Kirish
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                      Ro'yxatdan o'tish
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
