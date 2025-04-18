"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Loader2, Save, Library, Book, Clock, Phone, Mail, Globe, MapPin, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { updateLibraryProfile } from "@/lib/api"
import LibraryMap from "@/components/library-map"

export default function LibraryProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Initial library data state
  const [libraryData, setLibraryData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    workingHours: "",
    latitude: 0,
    longitude: 0,
  })

  // State for form validation
  const [errors, setErrors] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    latitude: "",
    longitude: "",
  })

  // Load library data when user is authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Ruxsat yo'q",
        description: "Bu sahifani ko'rish uchun tizimga kirishingiz kerak.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!authLoading && isAuthenticated && user) {
      setIsLoading(true)

      // In a real app, you would fetch the library data from the API
      // For demo purposes, we'll use mock data
      const mockLibraryData = {
        name: user.name || "Alisher Navoiy nomidagi O'zbekiston Milliy kutubxonasi",
        address: "Toshkent sh., Navoiy ko'chasi, 1-uy",
        phone: "+998 71 232 83 94",
        email: user.email || "info@natlib.uz",
        website: "https://natlib.uz",
        description:
          "O'zbekiston Milliy kutubxonasi — O'zbekistondagi eng yirik kutubxona. 1870-yilda Toshkent jamoat kutubxonasi sifatida tashkil etilgan. 2002-yildan beri Alisher Navoiy nomidagi O'zbekiston Milliy kutubxonasi deb ataladi.",
        workingHours: "Dushanba-Shanba: 9:00 - 20:00, Yakshanba: Dam olish kuni",
        latitude: 41.311081,
        longitude: 69.280624,
      }

      setLibraryData(mockLibraryData)
      setIsLoading(false)
    }
  }, [isAuthenticated, authLoading, router, toast, user])

  // Mock books data
  const [books, setBooks] = useState([
    { id: 1, title: "O'tkan kunlar", author: "Abdulla Qodiriy", year: 1925, available: true },
    { id: 2, title: "Kecha va kunduz", author: "Cho'lpon", year: 1936, available: true },
    { id: 3, title: "Sarob", author: "Abdulla Qahhor", year: 1943, available: false },
    { id: 4, title: "Shum bola", author: "G'afur G'ulom", year: 1936, available: true },
  ])

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      name: "",
      address: "",
      phone: "",
      email: "",
      latitude: "",
      longitude: "",
    }

    // Validate name
    if (!libraryData.name.trim()) {
      newErrors.name = "Kutubxona nomi kiritilishi shart"
      isValid = false
    }

    // Validate address
    if (!libraryData.address.trim()) {
      newErrors.address = "Manzil kiritilishi shart"
      isValid = false
    }

    // Validate phone
    if (!libraryData.phone.trim()) {
      newErrors.phone = "Telefon raqami kiritilishi shart"
      isValid = false
    }

    // Validate email
    if (!libraryData.email.trim()) {
      newErrors.email = "Email kiritilishi shart"
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(libraryData.email)) {
      newErrors.email = "Email formati noto'g'ri"
      isValid = false
    }

    // Validate coordinates
    if (libraryData.latitude === 0 || isNaN(libraryData.latitude)) {
      newErrors.latitude = "Kenglik koordinatasi kiritilishi shart"
      isValid = false
    }

    if (libraryData.longitude === 0 || isNaN(libraryData.longitude)) {
      newErrors.longitude = "Uzunlik koordinatasi kiritilishi shart"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Xatolik",
        description: "Iltimos, barcha majburiy maydonlarni to'ldiring",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // In a real app, you would make an API call to update the profile
      const response = await updateLibraryProfile(user.id, libraryData)

      toast({
        title: "Muvaffaqiyatli yangilandi",
        description: "Kutubxona ma'lumotlari muvaffaqiyatli yangilandi.",
        variant: "default",
      })

      // Exit edit mode
      setIsEditing(false)
    } catch (error) {
      console.error("Profile update failed:", error)
      toast({
        title: "Xatolik yuz berdi",
        description: "Ma'lumotlarni yangilashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type } = e.target

    // Handle number inputs separately
    if (type === "number") {
      setLibraryData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : Number(value),
      }))
    } else {
      setLibraryData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
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

  // Check if user is a librarian
  if (isAuthenticated && user?.role !== "librarian") {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Bu sahifa faqat kutubxonachilar uchun. Siz kutubxonachi emassiz.</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Check if library is pending or inactive
  if ((isAuthenticated && user?.status === "pending") || user?.status === "inactive") {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Sizning kutubxonangiz hali administrator tomonidan faollashtirilmagan. Faollashtirilgandan so'ng
            profilingizni tahrirlash imkoniyatiga ega bo'lasiz.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Kutubxona profili</h1>
          <p className="text-muted-foreground">Kutubxona ma'lumotlarini boshqarish va yangilash</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="books">Kitoblar</TabsTrigger>
            <TabsTrigger value="statistics">Statistika</TabsTrigger>
            <TabsTrigger value="location">Joylashuv</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Kutubxona ma'lumotlari</CardTitle>
                  <CardDescription>Kutubxona haqidagi asosiy ma'lumotlarni yangilang</CardDescription>
                </div>
                {!isEditing && <Button onClick={() => setIsEditing(true)}>Tahrirlash</Button>}
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : isEditing ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Kutubxona nomi <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={libraryData.name}
                          onChange={handleInputChange}
                          required
                          className={errors.name ? "border-destructive" : ""}
                        />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">
                          Manzil <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          value={libraryData.address}
                          onChange={handleInputChange}
                          required
                          className={errors.address ? "border-destructive" : ""}
                        />
                        {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          Telefon raqami <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={libraryData.phone}
                          onChange={handleInputChange}
                          required
                          className={errors.phone ? "border-destructive" : ""}
                        />
                        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={libraryData.email}
                          onChange={handleInputChange}
                          required
                          className={errors.email ? "border-destructive" : ""}
                        />
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Veb-sayt</Label>
                        <Input id="website" name="website" value={libraryData.website} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workingHours">
                          Ish vaqti <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="workingHours"
                          name="workingHours"
                          value={libraryData.workingHours}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Kutubxona haqida</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={libraryData.description}
                          onChange={handleInputChange}
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="latitude">
                          Kenglik (Latitude) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="latitude"
                          name="latitude"
                          type="number"
                          step="any"
                          value={libraryData.latitude || ""}
                          onChange={handleInputChange}
                          required
                          className={errors.latitude ? "border-destructive" : ""}
                        />
                        {errors.latitude && <p className="text-xs text-destructive">{errors.latitude}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">
                          Uzunlik (Longitude) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="longitude"
                          name="longitude"
                          type="number"
                          step="any"
                          value={libraryData.longitude || ""}
                          onChange={handleInputChange}
                          required
                          className={errors.longitude ? "border-destructive" : ""}
                        />
                        {errors.longitude && <p className="text-xs text-destructive">{errors.longitude}</p>}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saqlanmoqda...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Saqlash
                          </>
                        )}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                        Bekor qilish
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-destructive">*</span> - majburiy maydonlar
                    </p>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h3 className="font-medium">Kutubxona nomi</h3>
                        <p>{libraryData.name}</p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Manzil</h3>
                        <p>{libraryData.address}</p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Telefon raqami</h3>
                        <p>{libraryData.phone}</p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Email</h3>
                        <p>{libraryData.email}</p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Veb-sayt</h3>
                        {libraryData.website ? (
                          <a
                            href={libraryData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {libraryData.website}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">Kiritilmagan</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Ish vaqti</h3>
                        <p>{libraryData.workingHours}</p>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <h3 className="font-medium">Kutubxona haqida</h3>
                        <p>{libraryData.description || "Ma'lumot kiritilmagan"}</p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Kenglik (Latitude)</h3>
                        <p>{libraryData.latitude}</p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Uzunlik (Longitude)</h3>
                        <p>{libraryData.longitude}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kutubxona ko'rinishi</CardTitle>
                <CardDescription>Kutubxonangiz foydalanuvchilarga qanday ko'rinadi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-6 space-y-6">
                  <div className="flex flex-col space-y-2">
                    <h2 className="text-2xl font-bold">{libraryData.name}</h2>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {libraryData.address}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-2">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Ish vaqti</h3>
                        <p className="text-sm text-muted-foreground">{libraryData.workingHours}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Telefon</h3>
                        <p className="text-sm text-muted-foreground">{libraryData.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Veb-sayt</h3>
                        {libraryData.website ? (
                          <a
                            href={libraryData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            {libraryData.website}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">Kiritilmagan</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <a href={`mailto:${libraryData.email}`} className="text-sm text-primary hover:underline">
                          {libraryData.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Kutubxona haqida</h3>
                    <p className="text-sm text-muted-foreground">
                      {libraryData.description || "Ma'lumot kiritilmagan"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="books" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Kutubxona kitoblari</CardTitle>
                  <CardDescription>Kutubxonangizda mavjud kitoblar ro'yxati</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/add-books">
                    <Book className="mr-2 h-4 w-4" />
                    Kitob qo'shish
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-12 px-4 text-left font-medium">Kitob nomi</th>
                          <th className="h-12 px-4 text-left font-medium">Muallif</th>
                          <th className="h-12 px-4 text-left font-medium">Yil</th>
                          <th className="h-12 px-4 text-left font-medium">Holati</th>
                          <th className="h-12 px-4 text-left font-medium">Amallar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {books.map((book) => (
                          <tr key={book.id} className="border-b">
                            <td className="p-4 align-middle">{book.title}</td>
                            <td className="p-4 align-middle">{book.author}</td>
                            <td className="p-4 align-middle">{book.year}</td>
                            <td className="p-4 align-middle">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  book.available
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                }`}
                              >
                                {book.available ? "Mavjud" : "Mavjud emas"}
                              </span>
                            </td>
                            <td className="p-4 align-middle">
                              <Button variant="ghost" size="sm">
                                Tahrirlash
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kutubxona statistikasi</CardTitle>
                <CardDescription>Kutubxonangiz faoliyati haqida statistik ma'lumotlar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center space-y-2">
                        <Library className="h-8 w-8 text-primary" />
                        <h3 className="text-2xl font-bold">{books.length}</h3>
                        <p className="text-sm text-muted-foreground">Jami kitoblar</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center space-y-2">
                        <Book className="h-8 w-8 text-primary" />
                        <h3 className="text-2xl font-bold">{books.filter((b) => b.available).length}</h3>
                        <p className="text-sm text-muted-foreground">Mavjud kitoblar</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center space-y-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-8 w-8 text-primary"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <h3 className="text-2xl font-bold">125</h3>
                        <p className="text-sm text-muted-foreground">Oylik tashrif buyuruvchilar</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Book Statistics */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Kitoblar statistikasi</h3>
                  <div className="rounded-md border">
                    <div className="p-6">
                      <div className="space-y-6">
                        {/* Book Categories Chart */}
                        <div>
                          <h4 className="font-medium mb-2">Kitoblar kategoriyalari</h4>
                          <div className="h-[200px] w-full bg-muted/30 rounded-md relative overflow-hidden">
                            {/* Mock Bar Chart */}
                            <div className="absolute bottom-0 left-0 w-1/5 h-[70%] bg-primary/80 rounded-t-sm"></div>
                            <div className="absolute bottom-0 left-[20%] w-1/5 h-[40%] bg-primary/80 rounded-t-sm"></div>
                            <div className="absolute bottom-0 left-[40%] w-1/5 h-[90%] bg-primary/80 rounded-t-sm"></div>
                            <div className="absolute bottom-0 left-[60%] w-1/5 h-[30%] bg-primary/80 rounded-t-sm"></div>
                            <div className="absolute bottom-0 left-[80%] w-1/5 h-[50%] bg-primary/80 rounded-t-sm"></div>

                            {/* Labels */}
                            <div className="absolute bottom-[-25px] left-[10%] text-xs text-muted-foreground">
                              Badiiy
                            </div>
                            <div className="absolute bottom-[-25px] left-[30%] text-xs text-muted-foreground">
                              Ilmiy
                            </div>
                            <div className="absolute bottom-[-25px] left-[50%] text-xs text-muted-foreground">
                              Tarixiy
                            </div>
                            <div className="absolute bottom-[-25px] left-[70%] text-xs text-muted-foreground">
                              O'quv
                            </div>
                            <div className="absolute bottom-[-25px] left-[90%] text-xs text-muted-foreground">
                              Boshqa
                            </div>
                          </div>
                        </div>

                        {/* Book Availability */}
                        <div className="pt-8">
                          <h4 className="font-medium mb-2">Kitoblar holati</h4>
                          <div className="flex items-center space-x-4">
                            <div className="w-[120px] h-[120px] rounded-full border-8 border-primary relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <span className="text-2xl font-bold">75%</span>
                                  <p className="text-xs text-muted-foreground">Mavjud</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-primary mr-2"></div>
                                <span>Mavjud kitoblar (75%)</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-muted mr-2"></div>
                                <span>Mavjud bo'lmagan kitoblar (25%)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visitor Statistics */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Tashrif buyuruvchilar statistikasi</h3>
                  <div className="rounded-md border">
                    <div className="p-6">
                      <div className="space-y-6">
                        {/* Monthly Visitors Chart */}
                        <div>
                          <h4 className="font-medium mb-2">Oylik tashrif buyuruvchilar</h4>
                          <div className="h-[200px] w-full bg-muted/30 rounded-md relative overflow-hidden">
                            {/* Mock Line Chart */}
                            <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                              <polyline
                                points="0,40 10,35 20,38 30,30 40,32 50,25 60,20 70,15 80,18 90,10 100,15"
                                fill="none"
                                stroke="hsl(var(--primary))"
                                strokeWidth="2"
                              />
                              <polyline
                                points="0,40 10,35 20,38 30,30 40,32 50,25 60,20 70,15 80,18 90,10 100,15"
                                fill="hsl(var(--primary) / 0.2)"
                                strokeWidth="0"
                              />
                            </svg>

                            {/* Month Labels */}
                            <div className="absolute bottom-0 left-0 w-full flex justify-between px-2 text-xs text-muted-foreground">
                              <span>Yan</span>
                              <span>Fev</span>
                              <span>Mar</span>
                              <span>Apr</span>
                              <span>May</span>
                              <span>Iyn</span>
                              <span>Iyl</span>
                              <span>Avg</span>
                              <span>Sen</span>
                              <span>Okt</span>
                              <span>Noy</span>
                              <span>Dek</span>
                            </div>
                          </div>
                        </div>

                        {/* Visitor Demographics */}
                        <div className="pt-8">
                          <h4 className="font-medium mb-2">Tashrif buyuruvchilar demografiyasi</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="text-sm font-medium mb-2">Yosh bo'yicha</h5>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">0-18 yosh</span>
                                  <span className="text-sm">30%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-primary h-2 rounded-full" style={{ width: "30%" }}></div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-sm">19-30 yosh</span>
                                  <span className="text-sm">45%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-sm">31-50 yosh</span>
                                  <span className="text-sm">20%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-primary h-2 rounded-full" style={{ width: "20%" }}></div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-sm">50+ yosh</span>
                                  <span className="text-sm">5%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-primary h-2 rounded-full" style={{ width: "5%" }}></div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h5 className="text-sm font-medium mb-2">Maqsad bo'yicha</h5>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">O'qish</span>
                                  <span className="text-sm">40%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-primary h-2 rounded-full" style={{ width: "40%" }}></div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Tadqiqot</span>
                                  <span className="text-sm">25%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-primary h-2 rounded-full" style={{ width: "25%" }}></div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-sm">O'rganish</span>
                                  <span className="text-sm">30%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-primary h-2 rounded-full" style={{ width: "30%" }}></div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Boshqa</span>
                                  <span className="text-sm">5%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div className="bg-primary h-2 rounded-full" style={{ width: "5%" }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Popular Books */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Eng mashhur kitoblar</h3>
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="h-12 px-4 text-left font-medium">Kitob nomi</th>
                            <th className="h-12 px-4 text-left font-medium">Muallif</th>
                            <th className="h-12 px-4 text-left font-medium">So'rovlar soni</th>
                            <th className="h-12 px-4 text-left font-medium">Holati</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-4 align-middle">O'tkan kunlar</td>
                            <td className="p-4 align-middle">Abdulla Qodiriy</td>
                            <td className="p-4 align-middle">245</td>
                            <td className="p-4 align-middle">
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                Mavjud
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-4 align-middle">Kecha va kunduz</td>
                            <td className="p-4 align-middle">Cho'lpon</td>
                            <td className="p-4 align-middle">187</td>
                            <td className="p-4 align-middle">
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                Mavjud
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-4 align-middle">Sarob</td>
                            <td className="p-4 align-middle">Abdulla Qahhor</td>
                            <td className="p-4 align-middle">156</td>
                            <td className="p-4 align-middle">
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                Mavjud emas
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-4 align-middle">Shum bola</td>
                            <td className="p-4 align-middle">G'afur G'ulom</td>
                            <td className="p-4 align-middle">132</td>
                            <td className="p-4 align-middle">
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                Mavjud
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-4 align-middle">Yulduzli tunlar</td>
                            <td className="p-4 align-middle">Pirimqul Qodirov</td>
                            <td className="p-4 align-middle">118</td>
                            <td className="p-4 align-middle">
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                Mavjud
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Export Options */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button variant="outline" className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 mr-2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    PDF formatida yuklab olish
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 mr-2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Excel formatida yuklab olish
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kutubxona joylashuvi</CardTitle>
                <CardDescription>Kutubxonangizning xaritadagi joylashuvi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {libraryData.latitude && libraryData.longitude ? (
                  <>
                    <div className="aspect-video relative rounded-lg overflow-hidden">
                      <LibraryMap
                        libraries={[
                          {
                            id: 1,
                            name: libraryData.name,
                            address: libraryData.address,
                            latitude: libraryData.latitude,
                            longitude: libraryData.longitude,
                          },
                        ]}
                        zoom={15}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-2">Koordinatalar</h3>
                        <p className="text-sm text-muted-foreground">Kenglik (Latitude): {libraryData.latitude}</p>
                        <p className="text-sm text-muted-foreground">Uzunlik (Longitude): {libraryData.longitude}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Yo'l ko'rsatmalar</h3>
                        <Button asChild className="w-full">
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${libraryData.latitude},${libraryData.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            Yo'l ko'rsatmalarini olish
                          </a>
                        </Button>
                      </div>
                    </div>
                    <div className="pt-4">
                      <h3 className="font-medium mb-2">Joylashuvni tahrirlash</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Kutubxonangizning joylashuv koordinatalarini o'zgartirish uchun "Profil" bo'limiga o'ting va
                        "Tahrirlash" tugmasini bosing.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(true)
                          document.querySelector('[data-value="profile"]')?.click()
                        }}
                      >
                        Joylashuvni tahrirlash
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                      <MapPin className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-bold">Joylashuv ma'lumotlari kiritilmagan</h2>
                    <p className="text-muted-foreground max-w-md">
                      Kutubxonangizning joylashuv koordinatalarini kiritish uchun "Profil" bo'limiga o'ting va
                      "Tahrirlash" tugmasini bosing.
                    </p>
                    <Button
                      onClick={() => {
                        setIsEditing(true)
                        document.querySelector('[data-value="profile"]')?.click()
                      }}
                    >
                      Joylashuvni kiritish
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
