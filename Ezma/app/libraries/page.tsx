import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Image from "next/image"
import { getLibraries } from "@/lib/api"

export default async function LibrariesPage({ searchParams }: { searchParams: { q?: string } }) {
  // Get search query from URL params
  const searchQuery = searchParams.q || ""

  // Fetch libraries from API - now this will return mock data directly
  let libraries = []
  try {
    const params = searchQuery ? { search: searchQuery } : {}
    const response = await getLibraries(params)
    libraries = response.results || []
  } catch (error) {
    console.error("Failed to fetch libraries:", error)
    // Fallback to empty array if there's an unexpected error
    libraries = []
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Kutubxonalar ro'yxati</h1>
          <p className="text-muted-foreground">O'zbekistondagi barcha ro'yxatdan o'tgan kutubxonalar</p>
        </div>

        <form className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              name="q"
              placeholder="Kutubxona nomini qidirish..."
              className="w-full pl-10"
              defaultValue={searchQuery}
            />
          </div>
          <Button type="submit">Qidirish</Button>
        </form>

        {libraries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {libraries.map((library) => (
              <Card key={library.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={library.image || "/images/library-modern.png"}
                    alt={library.name || "Kutubxona"}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg line-clamp-2 mb-2">{library.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{library.address}</p>
                  <p className="text-sm">
                    <span className="font-medium">Kitoblar soni:</span> {(library.books_count || 0).toLocaleString()}
                  </p>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0">
                  <Button asChild className="w-full">
                    <Link href={`/libraries/${library.id}`}>Batafsil</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold">Kutubxonalar topilmadi</h2>
            <p className="text-muted-foreground max-w-md">
              {searchQuery ? (
                <>
                  &quot;{searchQuery}&quot; so'rovi bo'yicha hech qanday kutubxona topilmadi. Boshqa so'rovni kiriting.
                </>
              ) : (
                <>Hozirda ro'yxatga olingan kutubxonalar mavjud emas.</>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
