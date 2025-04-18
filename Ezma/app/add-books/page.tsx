"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Plus, FileSpreadsheet, Loader2, AlertTriangle } from "lucide-react"
import { addBook, addBooksFromExcel } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AddBooksPage() {
  const [books, setBooks] = useState([{ id: 1, title: "", author: "", publisher: "", count: 1 }])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  // Check if user is authenticated and is a librarian
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        toast({
          title: "Ruxsat yo'q",
          description: "Bu sahifani ko'rish uchun tizimga kirishingiz kerak.",
          variant: "destructive",
        })
        router.push("/login")
      } else if (user?.role !== "librarian") {
        toast({
          title: "Ruxsat yo'q",
          description: "Bu sahifani faqat kutubxonachilar ko'ra oladi.",
          variant: "destructive",
        })
        router.push("/")
      }
    }
  }, [isAuthenticated, authLoading, router, toast, user])

  // Get library ID from user object
  const getLibraryId = () => {
    if (user && user.role === "librarian") {
      return user.id
    }
    return null
  }

  const addBookField = () => {
    const newId = books.length > 0 ? Math.max(...books.map((book) => book.id)) + 1 : 1
    setBooks([...books, { id: newId, title: "", author: "", publisher: "", count: 1 }])
  }

  const removeBookField = (id) => {
    if (books.length > 1) {
      setBooks(books.filter((book) => book.id !== id))
    }
  }

  const updateBookField = (id, field, value) => {
    setBooks(books.map((book) => (book.id === id ? { ...book, [field]: value } : book)))
  }

  const handleManualSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const libraryId = getLibraryId()
    if (!libraryId) {
      toast({
        title: "Xatolik",
        description: "Siz tizimga kirmagansiz. Iltimos, avval tizimga kiring.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    try {
      // Filter out empty books
      const validBooks = books.filter((book) => book.title.trim() !== "" && book.author.trim() !== "")

      if (validBooks.length === 0) {
        toast({
          title: "Xatolik",
          description: "Kamida bitta kitob ma'lumotlarini to'ldiring.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Add each book
      for (const book of validBooks) {
        await addBook(libraryId, book)
      }

      toast({
        title: "Muvaffaqiyatli",
        description: `${validBooks.length} ta kitob muvaffaqiyatli qo'shildi.`,
        variant: "default",
      })

      // Reset form
      setBooks([{ id: 1, title: "", author: "", publisher: "", count: 1 }])
    } catch (error) {
      console.error("Failed to add books:", error)
      toast({
        title: "Xatolik yuz berdi",
        description: "Kitoblarni qo'shishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleExcelSubmit = async (e) => {
    e.preventDefault()

    if (!selectedFile) {
      toast({
        title: "Fayl tanlanmagan",
        description: "Iltimos, Excel faylni tanlang.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    const libraryId = getLibraryId()
    if (!libraryId) {
      toast({
        title: "Xatolik",
        description: "Siz tizimga kirmagansiz. Iltimos, avval tizimga kiring.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      await addBooksFromExcel(libraryId, formData)

      toast({
        title: "Muvaffaqiyatli",
        description: "Kitoblar Excel fayldan muvaffaqiyatli qo'shildi.",
        variant: "default",
      })

      // Reset file selection
      setSelectedFile(null)
      // Reset file input by clearing its value
      const fileInput = document.getElementById("excel-file")
      if (fileInput) fileInput.value = ""
    } catch (error) {
      console.error("Failed to upload Excel file:", error)
      toast({
        title: "Xatolik yuz berdi",
        description:
          "Excel faylni yuklashda xatolik yuz berdi. Iltimos, fayl formatini tekshiring va qayta urinib ko'ring.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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

  // If not authenticated or not a librarian, don't render the page content
  if (!isAuthenticated || user?.role !== "librarian") {
    return null
  }

  // Check if library is pending or inactive
  if (user?.status === "pending" || user?.status === "inactive") {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Kutubxona faol emas</AlertTitle>
          <AlertDescription>
            Sizning kutubxonangiz hali administrator tomonidan faollashtirilmagan. Faollashtirilgandan so'ng kitob
            qo'shish imkoniyatiga ega bo'lasiz.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col space-y-8 max-w-4xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Kitoblar qo'shish</h1>
          <p className="text-muted-foreground">Kutubxonangizga yangi kitoblarni qo'shing</p>
        </div>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Qo'lda kiritish</TabsTrigger>
            <TabsTrigger value="excel">Excel orqali yuklash</TabsTrigger>
          </TabsList>
          <TabsContent value="manual" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Kitoblarni qo'lda kiritish</CardTitle>
                <CardDescription>Kitob ma'lumotlarini to'ldiring va saqlang</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleManualSubmit}>
                  {books.map((book, index) => (
                    <div key={book.id} className="space-y-4 p-4 border rounded-lg relative">
                      {books.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2"
                          onClick={() => removeBookField(book.id)}
                        >
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
                            className="h-4 w-4"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                          <span className="sr-only">Remove</span>
                        </Button>
                      )}
                      <h3 className="font-medium">{index + 1}-kitob</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`title-${book.id}`}>Kitob nomi</Label>
                          <Input
                            id={`title-${book.id}`}
                            value={book.title}
                            onChange={(e) => updateBookField(book.id, "title", e.target.value)}
                            placeholder="Kitob nomi"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`author-${book.id}`}>Muallifi</Label>
                          <Input
                            id={`author-${book.id}`}
                            value={book.author}
                            onChange={(e) => updateBookField(book.id, "author", e.target.value)}
                            placeholder="Muallif ismi"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`publisher-${book.id}`}>Nashriyot</Label>
                          <Input
                            id={`publisher-${book.id}`}
                            value={book.publisher}
                            onChange={(e) => updateBookField(book.id, "publisher", e.target.value)}
                            placeholder="Nashriyot nomi"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`count-${book.id}`}>Mavjud soni</Label>
                          <Input
                            id={`count-${book.id}`}
                            type="number"
                            min="1"
                            value={book.count}
                            onChange={(e) => updateBookField(book.id, "count", Number.parseInt(e.target.value) || 1)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={addBookField}
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Yana kitob qo'shish
                  </Button>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saqlanmoqda...
                      </>
                    ) : (
                      "Saqlash"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="excel" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Excel orqali yuklash</CardTitle>
                <CardDescription>Excel faylni yuklang va ma'lumotlarni tekshiring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleExcelSubmit}>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
                    <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">Excel faylni yuklang</h3>
                    <p className="text-sm text-muted-foreground mb-4">.xlsx yoki .csv formatidagi faylni yuklang</p>
                    <div className="flex flex-col space-y-2 w-full max-w-xs">
                      <Input
                        id="excel-file"
                        type="file"
                        accept=".xlsx,.csv"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("excel-file").click()}
                        disabled={isLoading}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Fayl tanlash
                      </Button>
                      {selectedFile && (
                        <p className="text-sm text-center mt-2">
                          Tanlangan fayl: <span className="font-medium">{selectedFile.name}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <h3 className="font-medium">Namuna fayl</h3>
                    <p className="text-sm text-muted-foreground">
                      Excel faylni to'g'ri formatda yuklash uchun namuna faylni yuklab oling
                    </p>
                    <Button variant="link" className="p-0 h-auto">
                      Namuna faylni yuklab olish
                    </Button>
                  </div>
                  <Button type="submit" className="w-full mt-4" disabled={!selectedFile || isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Yuklanmoqda...
                      </>
                    ) : (
                      "Saqlash"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
