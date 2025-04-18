"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface Library {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  distance?: number
}

interface LibraryMapProps {
  libraries: Library[]
  userLocation?: { latitude: number; longitude: number }
  zoom?: number
  height?: string
}

// Declare google variable
declare global {
  interface Window {
    google: any
  }
}

export default function LibraryMap({ libraries, userLocation, zoom = 13, height = "aspect-video" }: LibraryMapProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  // Load Google Maps API script via server API route
  const loadGoogleMapsScript = async () => {
    try {
      const response = await fetch("/api/maps")
      const data = await response.json()

      const script = document.createElement("script")
      script.src = data.scriptUrl
      script.async = true
      script.defer = true
      script.onload = () => {
        setIsLoaded(true)
        initMap()
      }
      script.onerror = () => {
        setError("Google Maps API yuklanishida xatolik yuz berdi")
      }

      document.head.appendChild(script)
      return script
    } catch (error) {
      console.error("Failed to load Google Maps script:", error)
      setError("Google Maps API yuklanishida xatolik yuz berdi")
      return null
    }
  }

  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true)
      initMap()
      return
    }

    // Load the script
    loadGoogleMapsScript().then((script) => {
      scriptElement = script
    })

    return () => {
      // Clean up script when component unmounts
      if (scriptElement && document.head.contains(scriptElement)) {
        document.head.removeChild(scriptElement)
      }
    }
  }, [])

  useEffect(() => {
    // Initialize or update map when libraries or user location changes
    if (isLoaded && map) {
      updateMap()
    }
  }, [libraries, userLocation, isLoaded, map])

  const initMap = () => {
    if (!window.google || !window.google.maps) return

    const mapElement = document.getElementById("library-map")
    if (!mapElement) return

    // Get center coordinates
    let center
    if (libraries.length === 1) {
      // If only one library, center on it
      center = { lat: libraries[0].latitude, lng: libraries[0].longitude }
    } else if (userLocation) {
      // If user location is provided, center on it
      center = { lat: userLocation.latitude, lng: userLocation.longitude }
    } else if (libraries.length > 0) {
      // Otherwise, use the first library
      center = { lat: libraries[0].latitude, lng: libraries[0].longitude }
    } else {
      // Default to Tashkent center if no libraries or user location
      center = { lat: 41.311081, lng: 69.280624 }
    }

    // Create the map
    const newMap = new window.google.maps.Map(mapElement, {
      center,
      zoom,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    })

    setMap(newMap)
  }

  const updateMap = () => {
    if (!map || !window.google || !window.google.maps) return

    // Clear existing markers
    map.data.forEach((feature) => {
      map.data.remove(feature)
    })

    // Create bounds to fit all markers
    const bounds = new window.google.maps.LatLngBounds()

    // Add user location marker if provided
    if (userLocation) {
      const userPosition = { lat: userLocation.latitude, lng: userLocation.longitude }
      bounds.extend(userPosition)

      // Create user marker with blue dot
      const userMarker = new window.google.maps.Marker({
        position: userPosition,
        map,
        title: "Sizning joylashuvingiz",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        },
        zIndex: 1000, // Ensure user marker is on top
      })

      // Add info window for user location
      const userInfoWindow = new window.google.maps.InfoWindow({
        content: `<div style="padding: 8px;"><strong>Sizning joylashuvingiz</strong></div>`,
      })

      userMarker.addListener("click", () => {
        userInfoWindow.open(map, userMarker)
      })

      // Open user info window by default if there's only one library
      if (libraries.length === 1) {
        userInfoWindow.open(map, userMarker)
      }
    }

    // Add library markers
    libraries.forEach((library) => {
      const position = { lat: library.latitude, lng: library.longitude }
      bounds.extend(position)

      // Create marker for library
      const marker = new window.google.maps.Marker({
        position,
        map,
        title: library.name,
        animation: window.google.maps.Animation.DROP,
      })

      // Create info window content
      let infoContent = `
        <div style="padding: 8px; max-width: 250px;">
          <strong>${library.name}</strong>
          <p style="margin: 4px 0;">${library.address}</p>
      `

      // Add distance if available
      if (library.distance !== undefined) {
        infoContent += `<p style="margin: 4px 0;">Masofa: ${library.distance} km</p>`
      }

      // Add directions link
      infoContent += `
          <a href="https://www.google.com/maps/dir/?api=1&destination=${library.latitude},${library.longitude}" 
             target="_blank" style="color: #1a73e8; display: block; margin-top: 8px; text-decoration: none;">
            Yo'l ko'rsatmalarini olish
          </a>
        </div>
      `

      const infoWindow = new window.google.maps.InfoWindow({
        content: infoContent,
      })

      marker.addListener("click", () => {
        infoWindow.open(map, marker)
      })

      // Open info window by default if there's only one library
      if (libraries.length === 1) {
        infoWindow.open(map, marker)
      }
    })

    // Fit map to show all markers
    if (bounds.isEmpty()) {
      // If bounds is empty, center on Tashkent
      map.setCenter({ lat: 41.311081, lng: 69.280624 })
      map.setZoom(zoom)
    } else if (libraries.length === 1 && !userLocation) {
      // If only one library and no user location, center on it with specified zoom
      map.setCenter({ lat: libraries[0].latitude, lng: libraries[0].longitude })
      map.setZoom(zoom)
    } else {
      // Fit to show all markers
      map.fitBounds(bounds)

      // Ensure minimum zoom level
      const listener = window.google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom() > 16) map.setZoom(16)
        window.google.maps.event.removeListener(listener)
      })
    }
  }

  if (error) {
    return (
      <div className={`${height} bg-muted rounded-lg flex items-center justify-center`}>
        <div className="text-center p-4">
          <p className="text-muted-foreground">{error}</p>
          {libraries.length > 0 && (
            <p className="text-sm mt-2">
              Joylashuv: {libraries[0].latitude}, {libraries[0].longitude}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`${height} bg-muted rounded-lg overflow-hidden relative`}>
      <div id="library-map" className="w-full h-full"></div>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  )
}
