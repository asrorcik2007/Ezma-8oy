"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const { login: authLogin } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validate inputs
      if (!email.trim()) {
        setError("Email kiritilishi shart.")
        setIsLoading(false)
        return
      }

      if (!password.trim()) {
        setError("Parol kiritilishi shart.")
        setIsLoading(false)
        return
      }

      // Call the login function
      const response = await login(email, password)

      // Store token in localStorage
      if (response.token) {
        // Use the login function from AuthContext
        authLogin(response.token, response.user)

        toast({
          title: "Muvaffaqiyatli kirish",
          description: "Tizimga muvaffaqiyatli kirdingiz.",
          variant: "default",
        })

        // Redirect based on user role
        if (response.user?.role === "admin") {
          router.push("/admin")
        } else if (response.user?.role === "librarian") {
          router.push("/library-profile")
        } else {
          router.push("/")
        }
      } else {
        throw new Error("Token not received")
      }
    } catch (error) {
      console.error("Login failed:", error)

      // Provide more specific error messages based on the error
      if (error.message.includes("Invalid email or password")) {
        setError("Email yoki parol noto'g'ri. Iltimos, qayta tekshiring va qayta urinib ko'ring.")
      } else {
        setError(error.message || "Tizimga kirishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center py-12 md:py-24 relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/library-bg.png"
          alt="Kutubxona foni"
          fill
          className="object-cover opacity-20 dark:opacity-10"
          priority
        />
      </div>

      {/* Overlay for better card readability */}
      <div className="absolute inset-0 bg-background/50 dark:bg-background/70 z-0"></div>

      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Tizimga kirish</CardTitle>
          <CardDescription className="text-center">
            Kutubxonachi yoki foydalanuvchi sifatida tizimga kiring
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Parol</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Parolni unutdingizmi?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Demo uchun:</p>
              <p>Admin: admin@ezma.uz / admin123</p>
              <p>Kutubxonachi: admin@natlib.uz / password123</p>
              <p>Foydalanuvchi: demo@ezma.uz / demo123</p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kirish...
                </>
              ) : (
                "Kirish"
              )}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Hisobingiz yo'qmi?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Ro'yxatdan o'ting
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
