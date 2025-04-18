import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Library, MapPin } from "lucide-react"
import Image from "next/image"
import { searchBooks } from "@/lib/api"

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const searchQuery = searchParams.q || ""

  // If no search query, show empty state
  if (!searchQuery) {
    return (
      <div className="container py-12 md:py-24">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <Search className="h-12 w-12 text-muted-foreground" />
          <h1 className="text-3xl font-bold">Kitob qidirish</h1>
          <p className="text-muted-foreground max-w-md">
            Kitob nomi yoki muallifi bo'yicha qidirish uchun qidiruv so'rovini kiriting.
          </p>
          <form action="/search" className="w-full max-w-lg flex flex-col sm:flex-row items-center gap-2 mt-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                name="q"
                placeholder="Kitob nomi yoki muallifi..."
                className="w-full pl-10"
                required
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              Qidirish
            </Button>
          </form>
        </div>
      </div>
    )
  }

  // Fetch search results - now this will return mock data directly
  let searchResults = []
  try {
    const response = await searchBooks(searchQuery)
    searchResults = response.results || []
  } catch (error) {
    console.error("Search failed:", error)
    searchResults = []
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Qidiruv natijalari</h1>
          <p className="text-muted-foreground">
            <span className="font-medium">&quot;{searchQuery}&quot;</span> uchun {searchResults.length} ta natija
            topildi
          </p>
        </div>

        <form className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              name="q"
              placeholder="Kitob nomi yoki muallifi..."
              className="w-full pl-10"
              defaultValue={searchQuery}
            />
          </div>
          <Button type="submit">Qidirish</Button>
        </form>

        {searchResults.length > 0 ? (
          <div className="space-y-6">
            {searchResults.map((result) => (
              <Card key={result.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="aspect-[3/4] relative md:col-span-1">
                      <Image
                        src={
                          result.image && result.image.trim() !== ""
                            ? result.image
                            : "/placeholder.svg?height=300&width=200"
                        }
                        alt={result.title || "Kitob"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 md:col-span-3 space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold">{result.title}</h2>
                        <p className="text-muted-foreground">{result.author}</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Mavjud kutubxonalar:</h3>
                        <div className="space-y-2">
                          {result.libraries &&
                            result.libraries.map((library) => (
                              <div key={library.id} className="flex items-start space-x-2 p-2 rounded-md border">
                                <Library className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <Link href={`/libraries/${library.id}`} className="font-medium hover:underline">
                                    {library.name}
                                  </Link>
                                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {library.address}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      <Button asChild>
                        <Link href={`/books/${result.id}`}>Batafsil</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold">Natija topilmadi</h2>
            <p className="text-muted-foreground max-w-md">
              &quot;{searchQuery}&quot; so'rovi bo'yicha hech qanday kitob topilmadi. Boshqa so'rovni kiriting yoki
              barcha kutubxonalarni ko'ring.
            </p>
            <Button asChild variant="outline" className="mt-2">
              <Link href="/libraries">Barcha kutubxonalarni ko'rish</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
