import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { getPopularBooks } from "@/lib/api"

// This is a server component that fetches data
export default async function Home() {
  // Fetch popular books - now this will return mock data directly
  let popularBooks = []
  try {
    const response = await getPopularBooks()
    popularBooks = response.results || []
  } catch (error) {
    console.error("Failed to fetch books:", error)
    // This shouldn't happen now that we're using mock data,
    // but just in case there's an unexpected error
    popularBooks = []
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Library Background */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/library-bg.png"
            alt="Kutubxona foni"
            fill
            className="object-cover opacity-50 dark:opacity-30"
            priority
          />
        </div>

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-background/70 dark:bg-background/80 z-0"></div>

        {/* Content */}
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              O'zbekiston kutubxonalaridan kitoblarni qidiring
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Ezma orqali qidirayotgan kitobingizni qaysi kutubxonada borligini toping va eng yaqin kutubxonani
              aniqlang.
            </p>
            <form action="/search" className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-2">
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
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Tezkor qidiruv</h3>
              <p className="text-muted-foreground">
                Bir necha soniyada O'zbekistondagi barcha kutubxonalardan kitoblarni qidiring.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
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
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Eng yaqin kutubxona</h3>
              <p className="text-muted-foreground">Joylashuvingizga asoslanib, eng yaqin kutubxonani toping.</p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
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
                  <path d="M12 6V2H8" />
                  <path d="m8 2 4 4" />
                  <rect width="16" height="8" x="4" y="10" rx="1" />
                  <path d="M8 18h8" />
                  <path d="M12 22v-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Bepul foydalanish</h3>
              <p className="text-muted-foreground">Ezma xizmatidan to'liq bepul foydalaning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Books Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Eng ko'p qidirilgan kitoblar</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              O'zbekistonda eng mashhur va ko'p qidirilgan kitoblar
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {popularBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <Image
                    src={book.image && book.image.trim() !== "" ? book.image : "/placeholder.svg?height=200&width=150"}
                    alt={book.title || "Kitob"}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold truncate">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                  <p className="text-sm mt-2">{book.libraries_count || 0} ta kutubxonada mavjud</p>
                  <Button variant="link" className="p-0 h-auto mt-2" asChild>
                    <Link href={`/books/${book.id}`}>Batafsil</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button asChild>
              <Link href="/books">Barcha kitoblarni ko'rish</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section with Library Background */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/library-interior.png"
            alt="Kutubxona ichki ko'rinishi"
            fill
            className="object-cover opacity-50 dark:opacity-30"
          />
        </div>

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-background/70 dark:bg-background/80 z-0"></div>

        {/* Content */}
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Kutubxonachi bo'lsangiz, ro'yxatdan o'ting
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Kutubxonangizni tizimga qo'shing va kitobxonlarga xizmat ko'rsating
            </p>
            <Button size="lg" asChild>
              <Link href="/register">Ro'yxatdan o'tish</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
