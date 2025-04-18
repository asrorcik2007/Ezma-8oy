import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Library, MapPin, Calendar, BookOpen } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"

// This is a placeholder for the book detail page
// In a real implementation, you would fetch the book details from the API
export default async function BookDetailPage({ params }: { params: { id: string } }) {
  // Mock data for book details
  const book = {
    id: Number(params.id),
    title: "O'tkan kunlar",
    author: "Abdulla Qodiriy",
    image: "/placeholder.svg?height=500&width=350",
    year: 1925,
    publisher: "O'zbekiston nashriyoti",
    description:
      "O'tkan kunlar — o'zbek yozuvchisi Abdulla Qodiriyning romani. Asar 1922-1924-yillarda yozilgan bo'lib, ilk bor 1925-1926-yillarda nashr etilgan. Roman o'zbek adabiyotining eng mashhur asarlaridan biri hisoblanadi.",
    genre: "Tarixiy roman",
    pages: 368,
    language: "O'zbek",
    libraries: [
      {
        id: 1,
        name: "Alisher Navoiy nomidagi O'zbekiston Milliy kutubxonasi",
        address: "Toshkent sh., Navoiy ko'chasi, 1-uy",
        available: true,
      },
      {
        id: 2,
        name: "Mirzo Ulug'bek nomidagi O'zbekiston Milliy universiteti kutubxonasi",
        address: "Toshkent sh., Universitet ko'chasi, 4-uy",
        available: true,
      },
      {
        id: 3,
        name: "Toshkent axborot texnologiyalari universiteti kutubxonasi",
        address: "Toshkent sh., Amir Temur shoh ko'chasi, 108-uy",
        available: false,
      },
    ],
  }

  // If book not found, return 404
  if (!book) {
    return notFound()
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-4">
          <Link href="/search" className="text-sm text-primary hover:underline">
            ← Qidiruv natijalariga qaytish
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
              <Image
                src={book.image && book.image.trim() !== "" ? book.image : "/placeholder.svg?height=500&width=350"}
                alt={book.title || "Kitob"}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{book.title}</h1>
                <p className="text-xl text-muted-foreground">{book.author}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>
                    <span className="font-medium">Nashr yili:</span> {book.year}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <span>
                    <span className="font-medium">Sahifalar:</span> {book.pages}
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-2">Kitob haqida</h2>
                <p>{book.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Nashriyot</h3>
                  <p className="text-muted-foreground">{book.publisher}</p>
                </div>
                <div>
                  <h3 className="font-medium">Janr</h3>
                  <p className="text-muted-foreground">{book.genre}</p>
                </div>
                <div>
                  <h3 className="font-medium">Til</h3>
                  <p className="text-muted-foreground">{book.language}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Tabs defaultValue="libraries">
            <TabsList className="mb-4">
              <TabsTrigger value="libraries">Mavjud kutubxonalar</TabsTrigger>
            </TabsList>
            <TabsContent value="libraries" className="space-y-4">
              <h2 className="text-xl font-bold">Kitob mavjud kutubxonalar</h2>
              <div className="space-y-4">
                {book.libraries.map((library) => (
                  <Card key={library.id}>
                    <CardContent className="p-4 flex items-start space-x-4">
                      <Library className="h-6 w-6 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Link href={`/libraries/${library.id}`} className="font-bold hover:underline">
                            {library.name}
                          </Link>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              library.available
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {library.available ? "Mavjud" : "Mavjud emas"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {library.address}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
