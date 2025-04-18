import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Phone, Globe, MapPin, Clock, Mail } from "lucide-react"
import Image from "next/image"
import LibraryMap from "@/components/library-map"
import { getLibraryById, getBooksByLibrary } from "@/lib/api"

export default async function LibraryDetailPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { q?: string }
}) {
  const searchQuery = searchParams.q || ""

  const fallbackLibrary = {
    id: Number(params.id),
    name: "Alisher Navoiy nomidagi O'zbekiston Milliy kutubxonasi",
    address: "Toshkent sh., Navoiy ko'chasi, 1-uy",
    description:
      "O'zbekiston Milliy kutubxonasi — O'zbekistondagi eng yirik kutubxona. 1870-yilda Toshkent jamoat kutubxonasi sifatida tashkil etilgan. 2002-yildan beri Alisher Navoiy nomidagi O'zbekiston Milliy kutubxonasi deb ataladi.",
    phone: "+998 71 232 83 94",
    email: "info@natlib.uz",
    website: "https://natlib.uz",
    working_hours: "Dushanba-Shanba: 9:00 - 20:00, Yakshanba: Dam olish kuni",
    image: "/images/library-shelves.png",
    books_count: 7000000,
    latitude: 41.311081,
    longitude: 69.280624,
  }

  const fallbackBooks = [
    { id: 1, title: "O'tkan kunlar", author: "Abdulla Qodiriy", year: 1925, available: true },
    { id: 2, title: "Kecha va kunduz", author: "Cho'lpon", year: 1936, available: true },
    { id: 3, title: "Sarob", author: "Abdulla Qahhor", year: 1943, available: false },
    { id: 4, title: "Shum bola", author: "G'afur G'ulom", year: 1936, available: true },
  ]

  let library = fallbackLibrary
  let books = fallbackBooks

  try {
    const libraryData = await getLibraryById(params.id)
    if (libraryData) {
      library = libraryData
    }
  } catch (error) {
    console.error("Failed to fetch library details:", error)
  }

  try {
    const booksResponse = await getBooksByLibrary(params.id)
    books = booksResponse.results || fallbackBooks

    if (searchQuery && books.length > 0) {
      const query = searchQuery.toLowerCase()
      books = books.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      )
    }
  } catch (error) {
    console.error("Failed to fetch library books:", error)
  }

  return (
    <div className="container py-8 md:py-12">
      {/* Bosh qism */}
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-4">
          <Link href="/libraries" className="text-sm text-primary hover:underline">
            ← Kutubxonalar ro'yxatiga qaytish
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{library.name}</h1>
          <p className="text-muted-foreground flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {library.address}
          </p>
        </div>

        {/* Rasm */}
        <div className="aspect-video relative rounded-lg overflow-hidden">
          <Image
            src={library.image || "/images/library-shelves.png"}
            alt={library.name || "Kutubxona"}
            fill
            className="object-cover"
          />
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="about">
              <TabsList className="mb-4">
                <TabsTrigger value="about">Ma'lumot</TabsTrigger>
                <TabsTrigger value="books">Kitoblar</TabsTrigger>
                <TabsTrigger value="location">Joylashuv</TabsTrigger>
              </TabsList>

              {/* Ma'lumot */}
              <TabsContent value="about" className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Kutubxona haqida</h2>
                  <p>{library.description || "Ma'lumot mavjud emas."}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[{
                    icon: <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />, title: "Ish vaqti", content: library.working_hours
                  }, {
                    icon: <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />, title: "Telefon", content: library.phone
                  }, {
                    icon: <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />, title: "Veb-sayt", content: library.website, link: true
                  }, {
                    icon: <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />, title: "Email", content: library.email, link: true
                  }].map(({ icon, title, content, link }, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4 flex items-start space-x-2">
                        {icon}
                        <div>
                          <h3 className="font-medium">{title}</h3>
                          {content ? (
                            link ? (
                              <a href={link === true && title === "Email" ? `mailto:${content}` : content} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                {content}
                              </a>
                            ) : (
                              <p className="text-sm text-muted-foreground">{content}</p>
                            )
                          ) : <p className="text-sm text-muted-foreground">Ma'lumot mavjud emas</p>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Kitoblar */}
              <TabsContent value="books">
                {/* Qidiruv formasi va kitoblar jadvali shu yerga qo'yilgan */}
              </TabsContent>

              {/* Joylashuv */}
              <TabsContent value="location">
                {/* Xarita va manzil shu yerga qo'yilgan */}
              </TabsContent>
            </Tabs>
          </div>

          {/* Kutubxona statistikasi */}
          <div>
            {/* Statistik kartalar va xarita shu yerda */}
          </div>
        </div>
      </div>
    </div>
  )
}