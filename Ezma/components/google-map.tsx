"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface GoogleMapProps {
  latitude: number
  longitude: number
  name: string
  zoom?: number
}

export default function GoogleMap({ latitude, longitude, name, zoom = 15 }: GoogleMapProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  // Improve the map component to better show the library location
  // Add a more visible marker and info window for the library

  // Update the initMap function to add a more visible marker and info window
  const initMap = () => {
    if (window.google && window.google.maps) {
      const mapElement = document.getElementById("google-map")
      if (mapElement) {
        const libraryLocation = { lat: latitude, lng: longitude }

        const map = new window.google.maps.Map(mapElement, {
          center: libraryLocation,
          zoom: zoom,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        })

        // Create a more visible marker for the library location
        const marker = new window.google.maps.Marker({
          position: libraryLocation,
          map,
          title: name,
          animation: window.google.maps.Animation.DROP,
        })

        // Add an info window with the library name
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="padding: 8px;"><strong>${name}</strong></div>`,
        })

        // Open the info window when the marker is clicked
        marker.addListener("click", () => {
          infoWindow.open(map, marker)
        })

        // Open the info window by default
        infoWindow.open(map, marker)
      }
    }
  }

  if (error) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-muted-foreground">{error}</p>
          <p className="text-sm mt-2">
            Joylashuv: {latitude}, {longitude}
          </p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <div id="google-map" className="aspect-video bg-muted rounded-lg overflow-hidden"></div>
}
