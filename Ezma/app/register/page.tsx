"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { register } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import Image from "next/image"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError("Parollar mos kelmadi")
        setIsLoading(false)
        return
      }

      // Validate terms agreement
      if (!formData.agreeToTerms) {
        setError("Davom etish uchun foydalanish shartlariga rozilik bildiring")
        setIsLoading(false)
        return
      }

      // Prepare data for API
      const libraryData = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      }

      // Call the register function
      const response = await register(libraryData)

      // Show success message
      toast({
        title: "Ro'yxatdan o'tish muvaffaqiyatli",
        description: "Siz tizimga muvaffaqiyatli kirdingiz.",
        variant: "default",
      })

      // Automatically log in the user
      if (response.user) {
        // Create a token for the user
        const token = `mock-jwt-token-for-${response.user.id}`

        // Use the login function from AuthContext to set the user in the global state
        login(token, response.user)

        // Redirect to the appropriate page based on user role
        if (response.user.role === "librarian") {
          router.push("/library-profile")
        } else {
          router.push("/")
        }
      }
    } catch (error) {
      console.error("Registration failed:", error)
      setError(error.message || "Ro'yxatdan o'tishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center py-12 md:py-24 relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/library-interior.png"
          alt="Kutubxona ichki ko'rinishi"
          fill
          className="object-cover opacity-20 dark:opacity-10"
          priority
        />
      </div>

      {/* Overlay for better card readability */}
      <div className="absolute inset-0 bg-background/50 dark:bg-background/70 z-0"></div>

      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Ro'yxatdan o'tish</CardTitle>
          <CardDescription className="text-center">Kutubxonachi sifatida ro'yxatdan o'ting</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Kutubxona nomi</Label>
              <Input
                id="name"
                name="name"
                placeholder="Kutubxona nomi"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Manzil</Label>
              <Input
                id="address"
                name="address"
                placeholder="Kutubxona manzili"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon raqami</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+998 XX XXX XX XX"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">Parol kamida 6 ta belgidan iborat bo'lishi kerak</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Parolni tasdiqlang</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: checked === true }))}
              />
              <label
                htmlFor="agreeToTerms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <span>
                  <Link href="/terms" className="text-primary hover:underline">
                    Foydalanish shartlari
                  </Link>
                  ga roziman
                </span>
              </label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ro'yxatdan o'tilmoqda...
                </>
              ) : (
                "Ro'yxatdan o'tish"
              )}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Hisobingiz bormi?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Tizimga kiring
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
