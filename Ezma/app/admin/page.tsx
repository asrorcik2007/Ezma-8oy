"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Loader2, Search, CheckCircle, XCircle, UserCheck, Library, Users, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { getLibraries, activateLibrary, deactivateLibrary } from "@/lib/api"
import Image from "next/image"

export default function AdminPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [libraries, setLibraries] = useState([])
  const [filteredLibraries, setFilteredLibraries] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is authenticated and is admin
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Ruxsat yo'q",
        description: "Bu sahifani ko'rish uchun tizimga kirishingiz kerak.",
        variant: "destructive",
      })
      router.push("/login")
    } else if (!authLoading && isAuthenticated && user?.role !== "admin") {
      toast({
        title: "Ruxsat yo'q",
        description: "Bu sahifani faqat administratorlar ko'ra oladi.",
        variant: "destructive",
      })
      router.push("/")
    }
  }, [isAuthenticated, authLoading, router, toast, user])

  // Fetch libraries
  useEffect(() => {
    const fetchLibraries = async () => {
      if (isAuthenticated && user?.role === "admin") {
        try {
          setIsLoading(true)
          const response = await getLibraries({ admin: true })
          setLibraries(response.results || [])
          setFilteredLibraries(response.results || [])
        } catch (error) {
          console.error("Failed to fetch libraries:", error)
          toast({
            title: "Xatolik yuz berdi",
            description: "Kutubxonalar ro'yxatini yuklashda xatolik yuz berdi.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchLibraries()
  }, [isAuthenticated, user, toast])

  // Filter libraries based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredLibraries(libraries)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = libraries.filter(
        (library) =>
          library.name.toLowerCase().includes(query) ||
          library.email.toLowerCase().includes(query) ||
          library.address.toLowerCase().includes(query),
      )
      setFilteredLibraries(filtered)
    }
  }, [searchQuery, libraries])

  const handleStatusChange = async (libraryId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active"

      if (newStatus === "active") {
        await activateLibrary(libraryId)
      } else {
        await deactivateLibrary(libraryId)
      }

      // Update local state
      setLibraries(libraries.map((lib) => (lib.id === libraryId ? { ...lib, status: newStatus } : lib)))

      // Update filtered libraries as well
      setFilteredLibraries(filteredLibraries.map((lib) => (lib.id === libraryId ? { ...lib, status: newStatus } : lib)))

      toast({
        title: "Muvaffaqiyatli yangilandi",
        description: `Kutubxona holati ${newStatus === "active" ? "faollashtirildi" : "o'chirildi"}.`,
        variant: "default",
      })
    } catch (error) {
      console.error("Failed to update library status:", error)
      toast({
        title: "Xatolik yuz berdi",
        description: "Kutubxona holatini yangilashda xatolik yuz berdi.",
        variant: "destructive",
      })
    }
  }

  // If still checking authentication, show loading
  if (authLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // If not admin, don't render the page content
  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="container py-8 md:py-12 relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/library-interior.png"
          alt="Kutubxona ichki ko'rinishi"
          fill
          className="object-cover opacity-10 dark:opacity-5"
        />
      </div>

      {/* Overlay for better content readability */}
      <div className="absolute inset-0 bg-background/70 dark:bg-background/80 z-0"></div>

      <div className="flex flex-col space-y-8 relative z-10">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Admin boshqaruv paneli</h1>
          <p className="text-muted-foreground">Kutubxonalarni boshqarish va tizim statistikasini ko'rish</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-2">
                <Library className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">{libraries.length}</h3>
                <p className="text-sm text-muted-foreground">Jami kutubxonalar</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-2">
                <UserCheck className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">{libraries.filter((lib) => lib.status === "active").length}</h3>
                <p className="text-sm text-muted-foreground">Faol kutubxonalar</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-2">
                <Users className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">152</h3>
                <p className="text-sm text-muted-foreground">Foydalanuvchilar</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="libraries" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="libraries">Kutubxonalar</TabsTrigger>
            <TabsTrigger value="users">Foydalanuvchilar</TabsTrigger>
            <TabsTrigger value="statistics">Statistika</TabsTrigger>
          </TabsList>

          <TabsContent value="libraries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kutubxonalar ro'yxati</CardTitle>
                <CardDescription>Tizimda ro'yxatdan o'tgan kutubxonalar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full sm:max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Kutubxona nomini qidirish..."
                        className="w-full pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredLibraries.length > 0 ? (
                    <div className="rounded-md border">
                      <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="h-12 px-4 text-left font-medium">Kutubxona nomi</th>
                              <th className="h-12 px-4 text-left font-medium">Email</th>
                              <th className="h-12 px-4 text-left font-medium">Ro'yxatdan o'tgan sana</th>
                              <th className="h-12 px-4 text-left font-medium">Holati</th>
                              <th className="h-12 px-4 text-left font-medium">Amallar</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredLibraries.map((library) => (
                              <tr key={library.id} className="border-b">
                                <td className="p-4 align-middle font-medium">{library.name}</td>
                                <td className="p-4 align-middle">{library.email}</td>
                                <td className="p-4 align-middle">
                                  {new Date(library.created_at || Date.now()).toLocaleDateString("uz-UZ")}
                                </td>
                                <td className="p-4 align-middle">
                                  <Badge
                                    variant={library.status === "active" ? "success" : "secondary"}
                                    className="flex items-center gap-1"
                                  >
                                    {library.status === "active" ? (
                                      <>
                                        <CheckCircle className="h-3 w-3" />
                                        Faol
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="h-3 w-3" />
                                        Faol emas
                                      </>
                                    )}
                                  </Badge>
                                </td>
                                <td className="p-4 align-middle">
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={library.status === "active"}
                                      onCheckedChange={() => handleStatusChange(library.id, library.status)}
                                    />
                                    <span className="text-xs text-muted-foreground">
                                      {library.status === "active" ? "Faol" : "Faollashtirish"}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                        <Search className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h2 className="text-xl font-bold">Kutubxonalar topilmadi</h2>
                      <p className="text-muted-foreground max-w-md">
                        {searchQuery
                          ? `"${searchQuery}" so'rovi bo'yicha hech qanday kutubxona topilmadi.`
                          : "Hozirda ro'yxatga olingan kutubxonalar mavjud emas."}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Foydalanuvchilar ro'yxati</CardTitle>
                <CardDescription>Tizimda ro'yxatdan o'tgan foydalanuvchilar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <BookOpen className="h-16 w-16 text-muted-foreground" />
                  <h2 className="text-xl font-bold">Ishlab chiqilmoqda</h2>
                  <p className="text-muted-foreground max-w-md">
                    Foydalanuvchilar boshqaruvi bo'limi hozirda ishlab chiqilmoqda.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tizim statistikasi</CardTitle>
                <CardDescription>Tizim faoliyati haqida statistik ma'lumotlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <BookOpen className="h-16 w-16 text-muted-foreground" />
                  <h2 className="text-xl font-bold">Ishlab chiqilmoqda</h2>
                  <p className="text-muted-foreground max-w-md">Statistika bo'limi hozirda ishlab chiqilmoqda.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
