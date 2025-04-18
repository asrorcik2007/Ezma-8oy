import { NextResponse } from "next/server"

// This is a server-side API route that provides a secure way to load Google Maps
export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

  // Return the script URL with the API key
  return NextResponse.json({
    scriptUrl: `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`,
  })
}
