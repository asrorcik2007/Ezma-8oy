"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Loader2, MapPin, Library } from "lucide-react"
import { getNearbyLibraries } from "@/lib/api"
import LibraryMap from "@/components/library-map"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function NearbyLibrariesPage() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [libraries, setLibraries] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [radius, setRadius] = useState(5) // Default radius in km
  const { toast } = useToast()

  useEffect(() => {
    // Get user's current location when component mounts
    setIsLoading(true)

    // Function to handle location errors with better fallback
    const handleLocationError = (error) => {
      console.error("Error getting location:", error)

      // Set a default location (Tashkent city center) when geolocation fails
      const defaultLocation = { latitude: 41.311081, longitude: 69.280624 }
      setLocation(defaultLocation)

      // Show error message based on the error type
      if (error.code === 1) {
        // Permission denied
        setError("Joylashuvga ruxsat berilmadi. Quyida ko'rsatilgan standart joylashuv ishlatilmoqda.")
      } else if (error.code === 2) {
        // Position unavailable
        setError("Joylashuvni aniqlashda xatolik yuz berdi. Quyida ko'rsatilgan standart joylashuv ishlatilmoqda.")
      } else if (error.code === 3) {
        // Timeout
        setError("Joylashuvni aniqlash vaqti tugadi. Quyida ko'rsatilgan standart joylashuv ishlatilmoqda.")
      } else {
        // For the specific permissions policy error or other errors
        setError(
          "Joylashuv xizmati mavjud emas yoki o'chirilgan. Quyida ko'rsatilgan standart joylashuv ishlatilmoqda.",
        )
      }

      // Still fetch nearby libraries using the default location
      fetchNearbyLibraries(defaultLocation.latitude, defaultLocation.longitude, radius)
      setIsLoading(false)
    }

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            setLocation({ latitude, longitude })
            fetchNearbyLibraries(latitude, longitude, radius)
            setIsLoading(false)
          },
          handleLocationError,
          { timeout: 10000, enableHighAccuracy: true },
        )
      } else {
        handleLocationError({ message: "Geolocation is not supported by this browser." })
      }
    } catch (error) {
      handleLocationError(error)
    }
  }, [])

  const fetchNearbyLibraries = async (latitude: number, longitude: number, radius: number) => {
    try {
      setIsLoading(true)
      const response = await getNearbyLibraries(latitude, longitude, radius)
      setLibraries(response.results || [])
    } catch (error) {
      console.error("Failed to fetch nearby libraries:", error)
      setError("Yaqin atrofdagi kutubxonalarni yuklashda xatolik yuz berdi.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRadiusChange = (value: number[]) => {
    const newRadius = value[0]
    setRadius(newRadius)
    if (location) {
      fetchNearbyLibraries(location.latitude, location.longitude, newRadius)
    }
  }

  const handleManualLocationSubmit = (e) => {
    e.preventDefault()
    const lat = Number.parseFloat(e.target.latitude.value)
    const lng = Number.parseFloat(e.target.longitude.value)

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast({
        title: "Xatolik",
        description: "Noto'g'ri koordinatalar kiritildi. Iltimos, to'g'ri koordinatalarni kiriting.",
        variant: "destructive",
      })
      return
    }

    setLocation({ latitude: lat, longitude: lng })
    fetchNearbyLibraries(lat, lng, radius)
    setError(null)
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Yaqin atrofdagi kutubxonalar</h1>
          <p className="text-muted-foreground">Joylashuvingizga eng yaqin kutubxonalarni toping</p>
        </div>

        {error ? (
          <div className="bg-destructive/10 text-destructive p-6 rounded-lg">
            <p className="mb-4">{error}</p>

            <div className="space-y-4 mt-4 p-4 border rounded-lg bg-background/50">
              <h3 className="font-medium">Joylashuvni qo'lda kiriting</h3>
              <form onSubmit={handleManualLocationSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Kenglik (Latitude)</Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="text"
                      placeholder="41.311081"
                      defaultValue="41.311081"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Uzunlik (Longitude)</Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="text"
                      placeholder="69.280624"
                      defaultValue="69.280624"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Joylashuvni qo'llash
                </Button>
              </form>

              <div className="text-xs text-muted-foreground mt-2">
                <p>Standart joylashuv: Toshkent shahri markazi</p>
                <p>Kenglik: 41.311081, Uzunlik: 69.280624</p>
              </div>
            </div>

            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Qayta urinish
            </Button>
          </div>
        ) : isLoading && !location ? (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p>Joylashuvingiz aniqlanmoqda...</p>
            </div>
          </div>
        ) : (
          <>
            {location && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold">Xaritada ko'rish</h2>
                      {libraries.length > 0 ? (
                        <LibraryMap libraries={libraries} userLocation={location} />
                      ) : (
                        <LibraryMap libraries={[]} userLocation={location} />
                      )}
                    </div>
                  </div>
                  <div>
                    <Card>
                      <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                          <h3 className="font-medium">Qidiruv radiusi</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">1 km</span>
                            <span className="text-sm font-medium">{radius} km</span>
                            <span className="text-sm text-muted-foreground">20 km</span>
                          </div>
                          <Slider
                            defaultValue={[radius]}
                            min={1}
                            max={20}
                            step={1}
                            onValueChange={handleRadiusChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium">Koordinatalar</h3>
                          <p className="text-sm text-muted-foreground">Kenglik: {location.latitude.toFixed(6)}</p>
                          <p className="text-sm text-muted-foreground">Uzunlik: {location.longitude.toFixed(6)}</p>
                        </div>
                        <div className="pt-4 border-t">
                          <h3 className="font-medium mb-2">Topilgan kutubxonalar</h3>
                          <p className="text-2xl font-bold">{libraries.length}</p>
                          <p className="text-sm text-muted-foreground">
                            {radius} km radiusda {libraries.length} ta kutubxona topildi
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold">
                    {libraries.length > 0
                      ? `${radius} km radiusda ${libraries.length} ta kutubxona topildi`
                      : `${radius} km radiusda kutubxonalar topilmadi`}
                  </h2>

                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : libraries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {libraries.map((library) => (
                        <Card key={library.id} className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-3">
                              <Library className="h-5 w-5 text-primary mt-1" />
                              <div>
                                <h3 className="font-bold text-lg line-clamp-2">{library.name}</h3>
                                <p className="text-sm text-muted-foreground flex items-center mt-1">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {library.address}
                                </p>
                                <p className="text-sm mt-2">
                                  <span className="font-medium">Masofa:</span> {library.distance} km
                                </p>
                              </div>
                            </div>
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
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Belgilangan radius ichida kutubxonalar topilmadi. Radiusni kattalashtiring yoki boshqa joyni
                        tanlang.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
